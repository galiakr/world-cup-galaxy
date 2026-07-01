import { createClient } from '@supabase/supabase-js'
import { AppUser, UserSticker, Prediction, BugReport, UserQuizAnswer } from '@/types'
import { israelDateString } from '@/lib/date'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Auth ──────────────────────────────────────────────────────────────────
// Every browser/device gets a real (anonymous) Supabase Auth session, so
// auth.uid() is a trustworthy identity RLS policies can check against —
// instead of just believing whatever user_id a client claims. Requires
// "Allow anonymous sign-ins" enabled in Supabase → Authentication → Providers.

export async function ensureAnonSession(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) return session.user.id

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) { console.error('signInAnonymously:', error); return null }
  return data.session?.user.id ?? null
}

// ─── Users ─────────────────────────────────────────────────────────────────

// A device can hold at most this many linked profiles — see
// device_profile_count() in supabase-schema.sql (kept in sync manually).
export const DEVICE_PROFILE_LIMIT = 4

function isDeviceLimitError(error: { message?: string } | null): boolean {
  return !!error?.message?.includes('device_limit_reached')
}

// Creates a brand-new profile and links this device to it. Returns the
// profile plus its one-time plaintext recovery code (never retrievable
// again — only a hash of it is stored). Returns 'limit_reached' if this
// device already holds DEVICE_PROFILE_LIMIT profiles.
export async function createProfile(
  username: string,
  avatarEmoji: string,
  lang: 'he' | 'en'
): Promise<{ user: AppUser; recoveryCode: string } | 'limit_reached' | null> {
  const { data, error } = await supabase.rpc('create_profile', {
    p_username: username,
    p_avatar: avatarEmoji,
    p_lang: lang,
  })
  if (error || !data?.length) {
    if (isDeviceLimitError(error)) return 'limit_reached'
    console.error('createProfile:', error)
    return null
  }
  const { recovery_code, ...user } = data[0]
  return { user, recoveryCode: recovery_code }
}

// Verifies a username + recovery code and, if they match, links this
// device to that profile. Returns null if the code is wrong, or
// 'limit_reached' if this device already holds DEVICE_PROFILE_LIMIT
// other profiles.
export async function recoverProfile(username: string, code: string): Promise<AppUser | 'limit_reached' | null> {
  const { data, error } = await supabase.rpc('recover_profile', {
    p_username: username,
    p_code: code,
  })
  if (error) return isDeviceLimitError(error) ? 'limit_reached' : null
  if (!data?.length) return null
  return data[0]
}

// All profiles this device is trusted for — a device can hold more than
// one (siblings sharing it), switchable instantly with no recovery code,
// since the device is already linked to each of them.
export async function getMyLinkedProfiles(): Promise<AppUser[]> {
  const { data: links } = await supabase.from('user_auth_links').select('user_id, linked_at').order('linked_at', { ascending: true })
  const ids = (links ?? []).map(l => l.user_id)
  if (ids.length === 0) return []
  const { data: users } = await supabase.from('users').select('*').in('id', ids)
  const byId = new Map((users ?? []).map(u => [u.id, u]))
  return ids.map(id => byId.get(id)).filter((u): u is AppUser => !!u)
}

// Migration helper for sessions created before user_auth_links existed —
// see claim_orphan_profile() in supabase-schema.sql for the safety check.
export async function claimOrphanProfile(userId: string): Promise<boolean> {
  const { data } = await supabase.rpc('claim_orphan_profile', { p_user_id: userId })
  return !!data
}

export async function getUserByUsername(username: string): Promise<AppUser | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()
  return data
}

export async function updateStreak(userId: string): Promise<{ streak: number; isNew: boolean }> {
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()
  if (!user) return { streak: 1, isNew: false }

  const today = israelDateString()
  const lastLogin = user.last_login_date

  if (lastLogin === today) return { streak: user.streak_days, isNew: false }

  const yesterdayStr = israelDateString(-1)
  const newStreak = lastLogin === yesterdayStr ? user.streak_days + 1 : 1

  await supabase.from('users').update({
    streak_days: newStreak,
    last_login_date: today,
  }).eq('id', userId)

  if (newStreak === 14) await awardSticker(userId, 'a_streak14')

  return { streak: newStreak, isNew: true }
}

// ─── Stickers ──────────────────────────────────────────────────────────────

export async function getUserStickers(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('user_stickers')
    .select('sticker_id')
    .eq('user_id', userId)
  return data?.map(r => r.sticker_id) ?? []
}

export async function awardSticker(userId: string, stickerId: string): Promise<boolean> {
  // Check if already has it
  const { data: existing } = await supabase
    .from('user_stickers')
    .select('id')
    .eq('user_id', userId)
    .eq('sticker_id', stickerId)
    .single()

  if (existing) return false // already owned

  const { error } = await supabase.from('user_stickers').insert({
    user_id: userId,
    sticker_id: stickerId,
    earned_at: new Date().toISOString(),
    is_new: true,
  })

  if (!error) {
    await supabase.rpc('increment_sticker_count', { user_id_param: userId })
    // Award collector milestones based on the new total count.
    // This also fixes a prior bug where a_collector10 / a_collector30
    // were defined but never actually triggered.
    const { data: freshUser } = await supabase
      .from('users').select('stickers_count').eq('id', userId).single()
    const count = freshUser?.stickers_count ?? 0
    if (count === 10) await awardSticker(userId, 'a_collector10')
    if (count === 30) await awardSticker(userId, 'a_collector30')
    if (count === 50) await awardSticker(userId, 'a_collector50')
  }

  return !error
}

export async function claimDailySticker(userId: string): Promise<{ claimed: boolean; stickerId: string | null }> {
  const today = israelDateString()

  const { data: existing } = await supabase
    .from('daily_claims')
    .select('id')
    .eq('user_id', userId)
    .eq('claimed_date', today)
    .single()

  if (existing) return { claimed: false, stickerId: null }

  // Pick a random common country sticker (all 48 teams in the pool)
  const commonStickerIds = [
    'c_mex','c_rsa','c_kor','c_can','c_bra','c_mar','c_usa','c_ger','c_ned','c_esp',
    'c_fra','c_arg','c_por','c_eng','c_cro','c_jap',
    'c_bih','c_qat','c_sui','c_hai','c_sco','c_par','c_aus','c_tur','c_cuw','c_civ',
    'c_ecu','c_swe','c_tun','c_bel','c_egy','c_irn','c_nzl','c_cpv','c_ksa','c_uru',
    'c_sen','c_irq','c_nor','c_alg','c_aut','c_jor','c_drc','c_uzb','c_col','c_gha','c_pan',
  ]
  const stickerId = commonStickerIds[Math.floor(Math.random() * commonStickerIds.length)]

  const { error } = await supabase.from('daily_claims').insert({ user_id: userId, claimed_date: today, sticker_id: stickerId })
  // Lost a race to a concurrent claim for the same user+day (UNIQUE
  // constraint) — don't award a sticker for the call that lost.
  if (error) return { claimed: false, stickerId: null }

  await awardSticker(userId, stickerId)
  return { claimed: true, stickerId }
}

// ─── Quiz ──────────────────────────────────────────────────────────────────

export async function getAnsweredQuestions(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('quiz_answers')
    .select('question_id')
    .eq('user_id', userId)
  return data?.map(r => r.question_id) ?? []
}

export async function saveQuizAnswer(
  userId: string,
  questionId: string,
  chosenIndex: number,
  isCorrect: boolean,
  stickerId?: string
): Promise<void> {
  await supabase.from('quiz_answers').insert({
    user_id: userId,
    question_id: questionId,
    chosen_index: chosenIndex,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
  })
  if (isCorrect && stickerId) {
    await awardSticker(userId, stickerId)
  }
  // Award quiz achievement stickers
  const { count } = await supabase
    .from('quiz_answers')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_correct', true)
  if (count === 5)  await awardSticker(userId, 'a_quiz5')
  if (count === 10) await awardSticker(userId, 'a_quiz10')
  if (count === 20) await awardSticker(userId, 'a_quiz20')
}

// ─── Predictions ───────────────────────────────────────────────────────────

export async function getUserPredictions(userId: string): Promise<Prediction[]> {
  const { data } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function savePrediction(
  userId: string,
  matchId: string,
  homeGoals: number,
  awayGoals: number,
  homePen?: number | null,
  awayPen?: number | null
): Promise<boolean> {
  const { error } = await supabase.from('predictions').upsert({
    user_id: userId,
    match_id: matchId,
    predicted_home: homeGoals,
    predicted_away: awayGoals,
    predicted_home_pen: homePen ?? null,
    predicted_away_pen: awayPen ?? null,
    created_at: new Date().toISOString(),
  }, { onConflict: 'user_id,match_id' })

  if (!error) {
    await awardSticker(userId, 'a_predict1')
    if (homePen != null && awayPen != null && homePen !== awayPen) {
      await awardSticker(userId, 'a_predict_pen')
    }
  }
  return !error
}

// Records whether a finished match's result matched a prediction, so the
// history view can show it and so it's never re-scored on a later visit.
export async function scorePrediction(
  predictionId: string,
  isCorrectWinner: boolean,
  isExactScore: boolean
): Promise<void> {
  await supabase.from('predictions').update({
    is_correct_winner: isCorrectWinner,
    is_exact_score: isExactScore,
  }).eq('id', predictionId)
}

// ─── Bug Reports ───────────────────────────────────────────────────────────

export async function submitBugReport(
  userId: string | undefined,
  username: string | undefined,
  type: BugReport['type'],
  description: string
): Promise<boolean> {
  const { error } = await supabase.from('bug_reports').insert({
    user_id: userId,
    username,
    type,
    description,
    created_at: new Date().toISOString(),
    status: 'open',
  })
  if (!error && userId) await awardSticker(userId, 'a_bug')
  return !error
}
