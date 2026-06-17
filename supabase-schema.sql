-- ════════════════════════════════════════════════════════════════════
-- World Cup Kids App — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- ── Row Level Security ─────────────────────────────────────────────
-- Allow anon reads for the app (child-safe: no passwords, no emails)
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_claims  ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports   ENABLE ROW LEVEL SECURITY;

-- Public policies (username-based auth, no Supabase auth)
CREATE POLICY "Allow all on users"         ON users         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on user_stickers" ON user_stickers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on daily_claims"  ON daily_claims  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on quiz_answers"  ON quiz_answers  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on predictions"   ON predictions   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on bug_reports"   ON bug_reports   FOR ALL USING (true) WITH CHECK (true);

-- ── Indexes ────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_stickers_user ON user_stickers(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_claims_user  ON daily_claims(user_id, claimed_date);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user  ON quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user   ON predictions(user_id);
