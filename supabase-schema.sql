-- ════════════════════════════════════════════════════════════════════
-- World Cup Kids App — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════════════

-- Enable UUID + crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username        TEXT NOT NULL UNIQUE,
  avatar_emoji    TEXT NOT NULL DEFAULT '🦁',
  streak_days     INTEGER NOT NULL DEFAULT 1,
  last_login_date DATE NOT NULL DEFAULT CURRENT_DATE,
  stickers_count  INTEGER NOT NULL DEFAULT 0,
  lang            TEXT NOT NULL DEFAULT 'he' CHECK (lang IN ('he', 'en')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── User Stickers ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_stickers (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sticker_id  TEXT NOT NULL,
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_new      BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(user_id, sticker_id)
);

-- ── Daily Claims ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_claims (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  claimed_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  sticker_id    TEXT NOT NULL,
  UNIQUE(user_id, claimed_date)
);

-- ── Quiz Answers ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_answers (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id  TEXT NOT NULL,
  chosen_index INTEGER NOT NULL,
  is_correct   BOOLEAN NOT NULL,
  answered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Predictions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id         TEXT NOT NULL,
  predicted_home   INTEGER NOT NULL DEFAULT 0,
  predicted_away   INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_correct_winner BOOLEAN,
  is_exact_score   BOOLEAN,
  sticker_awarded  BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, match_id)
);

-- ── Bug Reports ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bug_reports (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  username    TEXT,
  type        TEXT NOT NULL DEFAULT 'other',
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved'))
);

-- ── RPC: increment sticker count ───────────────────────────────────
CREATE OR REPLACE FUNCTION increment_sticker_count(user_id_param UUID)
RETURNS VOID AS $$
  UPDATE users SET stickers_count = stickers_count + 1 WHERE id = user_id_param;
$$ LANGUAGE SQL;

-- ── Device identity + recovery codes ─────────────────────────────────
-- A profile (users row) isn't tied to one auth.uid(), and a device isn't
-- tied to one profile either — siblings can share a device, each with
-- their own profile, switching between them with no code needed (the
-- device is already trusted for all of them). A recovery code is only
-- needed to add a profile from a *different*, not-yet-trusted device.
-- user_auth_links is the current set of (device, profile) pairs that are
-- allowed to act as each other; user_recovery holds only a salted hash
-- of each profile's code, never the plaintext, and has no client-facing
-- policies at all — only the SECURITY DEFINER functions below can read
-- or write it.
CREATE TABLE IF NOT EXISTS user_auth_links (
  auth_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (auth_id, user_id)
);

-- Migration: widen an existing single-profile-per-device PK to the
-- composite (auth_id, user_id) PK above, if this is re-run against a
-- database created before multi-profile devices were supported.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'user_auth_links'::regclass
      AND contype = 'p'
      AND conkey = (SELECT ARRAY[attnum] FROM pg_attribute WHERE attrelid = 'user_auth_links'::regclass AND attname = 'auth_id')
  ) THEN
    ALTER TABLE user_auth_links DROP CONSTRAINT user_auth_links_pkey;
    ALTER TABLE user_auth_links ADD PRIMARY KEY (auth_id, user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS user_recovery (
  user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  code_hash  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generates an 8-character code (e.g. "XJ4M-7QPR") from an alphabet
-- with no ambiguous characters (no 0/O, 1/I/L), ~40 bits of entropy —
-- far beyond what's brute-forceable through the app's RPC.
CREATE OR REPLACE FUNCTION generate_recovery_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  code TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..8 LOOP
    code := code || substr(chars, floor(random() * length(chars))::int + 1, 1);
    IF i = 4 THEN code := code || '-'; END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Returns membership: is the calling device (auth.uid()) linked to
-- this profile? Used by every per-user RLS policy below.
CREATE OR REPLACE FUNCTION is_my_profile(p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_auth_links WHERE auth_id = auth.uid() AND user_id = p_user_id
  );
$$ LANGUAGE sql STABLE;

-- How many profiles is this device currently linked to? Capped at 4
-- (see DEVICE_PROFILE_LIMIT below) — enough for a family sharing one
-- device, while keeping the switcher list short and bounding abuse.
CREATE OR REPLACE FUNCTION device_profile_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM user_auth_links WHERE auth_id = auth.uid();
$$ LANGUAGE sql STABLE;

-- One-time migration helper: profiles created before user_auth_links
-- existed have no link at all, so is_my_profile() denies every write
-- for them. If a profile truly has zero links (nobody has gone through
-- create_profile/recover_profile for it), let the calling device claim
-- it — equivalent to the trust level that existed before this table
-- did. Returns false (no-op) if the profile already has a link, so an
-- *actively used* profile can't be hijacked this way.
CREATE OR REPLACE FUNCTION claim_orphan_profile(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_claimed BOOLEAN := FALSE;
BEGIN
  IF device_profile_count() >= 4 THEN
    RETURN FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM user_auth_links WHERE user_id = p_user_id) THEN
    INSERT INTO user_auth_links (auth_id, user_id) VALUES (auth.uid(), p_user_id)
    ON CONFLICT (auth_id, user_id) DO NOTHING;
    v_claimed := TRUE;
  END IF;
  RETURN v_claimed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Creates a brand-new profile, links this device to it, and returns
-- the new profile plus its one-time plaintext recovery code. Runs as
-- SECURITY DEFINER so it can write user_recovery, which clients can't
-- touch directly.
CREATE OR REPLACE FUNCTION create_profile(p_username TEXT, p_avatar TEXT, p_lang TEXT)
RETURNS TABLE(id UUID, username TEXT, avatar_emoji TEXT, streak_days INTEGER, last_login_date DATE, stickers_count INTEGER, lang TEXT, created_at TIMESTAMPTZ, recovery_code TEXT)
AS $$
DECLARE
  v_user_id UUID := uuid_generate_v4();
  v_code TEXT := generate_recovery_code();
BEGIN
  IF device_profile_count() >= 4 THEN
    RAISE EXCEPTION 'device_limit_reached';
  END IF;

  INSERT INTO users (id, username, avatar_emoji, streak_days, last_login_date, stickers_count, lang)
  VALUES (v_user_id, p_username, p_avatar, 1, CURRENT_DATE, 0, p_lang);

  INSERT INTO user_recovery (user_id, code_hash)
  VALUES (v_user_id, crypt(v_code, gen_salt('bf')));

  INSERT INTO user_auth_links (auth_id, user_id)
  VALUES (auth.uid(), v_user_id);

  RETURN QUERY
    SELECT u.id, u.username, u.avatar_emoji, u.streak_days, u.last_login_date, u.stickers_count, u.lang, u.created_at, v_code
    FROM users u WHERE u.id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verifies a username + recovery code and, if they match, adds this
-- device to that profile's set of linked devices (on top of whatever
-- profiles it's already linked to). Returns the profile, or no rows if
-- the code is wrong.
CREATE OR REPLACE FUNCTION recover_profile(p_username TEXT, p_code TEXT)
RETURNS TABLE(id UUID, username TEXT, avatar_emoji TEXT, streak_days INTEGER, last_login_date DATE, stickers_count INTEGER, lang TEXT, created_at TIMESTAMPTZ)
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT u.id INTO v_user_id
  FROM users u
  JOIN user_recovery r ON r.user_id = u.id
  WHERE u.username = p_username
    AND r.code_hash = crypt(p_code, r.code_hash);

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Recovering a profile this device already holds is a harmless no-op,
  -- so only the device's *other* profiles count against the limit.
  IF NOT EXISTS (SELECT 1 FROM user_auth_links WHERE auth_id = auth.uid() AND user_id = v_user_id)
     AND device_profile_count() >= 4 THEN
    RAISE EXCEPTION 'device_limit_reached';
  END IF;

  INSERT INTO user_auth_links (auth_id, user_id)
  VALUES (auth.uid(), v_user_id)
  ON CONFLICT (auth_id, user_id) DO NOTHING;

  RETURN QUERY
    SELECT u.id, u.username, u.avatar_emoji, u.streak_days, u.last_login_date, u.stickers_count, u.lang, u.created_at
    FROM users u WHERE u.id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Row Level Security ─────────────────────────────────────────────
-- Each browser/device signs in via Supabase Anonymous Auth (see
-- ensureAnonSession() in src/lib/supabase.ts), giving every session a
-- real auth.uid(). A profile's actual identity is the set of devices
-- linked to it in user_auth_links (see is_my_profile() above), so
-- these policies enforce real row ownership instead of trusting
-- whatever user_id a client claims — while still allowing a profile
-- to be recovered onto a second device via a recovery code.
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_claims    ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_auth_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recovery   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on users"         ON users;
DROP POLICY IF EXISTS "Allow all on user_stickers" ON user_stickers;
DROP POLICY IF EXISTS "Allow all on daily_claims"  ON daily_claims;
DROP POLICY IF EXISTS "Allow all on quiz_answers"  ON quiz_answers;
DROP POLICY IF EXISTS "Allow all on predictions"   ON predictions;
DROP POLICY IF EXISTS "Allow all on bug_reports"   ON bug_reports;

-- users: username lookup must stay public (login needs to find a row
-- by username before it knows whether it's "your" row), and other
-- pages read team-mate-style data (avatar/streak) — none of it is
-- sensitive (no emails, no passwords). Profiles are only ever created
-- via create_profile()/recover_profile() (no public insert policy),
-- but ordinary field updates (streak, sticker_count) still go through
-- the client directly, scoped to your linked profile(s).
DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (is_my_profile(id)) WITH CHECK (is_my_profile(id));

-- user_stickers: only your own rows, in both directions.
DROP POLICY IF EXISTS "user_stickers_select" ON user_stickers;
DROP POLICY IF EXISTS "user_stickers_insert" ON user_stickers;
CREATE POLICY "user_stickers_select" ON user_stickers FOR SELECT USING (is_my_profile(user_id));
CREATE POLICY "user_stickers_insert" ON user_stickers FOR INSERT WITH CHECK (is_my_profile(user_id));

-- daily_claims: internal bookkeeping, never shown to other users.
DROP POLICY IF EXISTS "daily_claims_select" ON daily_claims;
DROP POLICY IF EXISTS "daily_claims_insert" ON daily_claims;
CREATE POLICY "daily_claims_select" ON daily_claims FOR SELECT USING (is_my_profile(user_id));
CREATE POLICY "daily_claims_insert" ON daily_claims FOR INSERT WITH CHECK (is_my_profile(user_id));

-- quiz_answers: only ever read/written for yourself.
DROP POLICY IF EXISTS "quiz_answers_select" ON quiz_answers;
DROP POLICY IF EXISTS "quiz_answers_insert" ON quiz_answers;
CREATE POLICY "quiz_answers_select" ON quiz_answers FOR SELECT USING (is_my_profile(user_id));
CREATE POLICY "quiz_answers_insert" ON quiz_answers FOR INSERT WITH CHECK (is_my_profile(user_id));

-- predictions: only ever read/written for yourself (no leaderboard
-- feature reads anyone else's predictions today).
DROP POLICY IF EXISTS "predictions_select" ON predictions;
DROP POLICY IF EXISTS "predictions_insert" ON predictions;
DROP POLICY IF EXISTS "predictions_update" ON predictions;
CREATE POLICY "predictions_select" ON predictions FOR SELECT USING (is_my_profile(user_id));
CREATE POLICY "predictions_insert" ON predictions FOR INSERT WITH CHECK (is_my_profile(user_id));
CREATE POLICY "predictions_update" ON predictions FOR UPDATE USING (is_my_profile(user_id)) WITH CHECK (is_my_profile(user_id));

-- bug_reports: write-only from the app, and only attributable to
-- yourself — reports are read from the Supabase dashboard with the
-- service role key, which bypasses RLS, so there's no public select.
DROP POLICY IF EXISTS "bug_reports_insert" ON bug_reports;
CREATE POLICY "bug_reports_insert" ON bug_reports FOR INSERT WITH CHECK (is_my_profile(user_id));

-- user_auth_links: a device can see its own link (to know which
-- profile it's attached to); links are otherwise only ever written by
-- create_profile()/recover_profile() (SECURITY DEFINER, bypasses RLS).
DROP POLICY IF EXISTS "user_auth_links_select" ON user_auth_links;
CREATE POLICY "user_auth_links_select" ON user_auth_links FOR SELECT USING (auth_id = auth.uid());

-- user_recovery: no policies at all — completely inaccessible to
-- anon/authenticated clients. Only the SECURITY DEFINER functions
-- above (which run with elevated privileges) can read or write it.

-- ── Indexes ────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_stickers_user ON user_stickers(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_claims_user  ON daily_claims(user_id, claimed_date);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user  ON quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user   ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_auth_links_user ON user_auth_links(user_id);
