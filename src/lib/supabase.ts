import { createClient } from '@supabase/supabase-js'
import { AppUser, UserSticker, Prediction, BugReport, UserQuizAnswer } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Users ─────────────────────────────────────────────────────────────────

export async function createUser(username: string, avatarEmoji: string, lang: 'he' | 'en'): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      username,
      avatar_emoji: avatarEmoji,
      streak_days: 1,
      last_login_date: new Date().toISOString().split('T')[0],
      stickers_count: 0,
      lang,
    })
    .select()
    .single()
  if (error) { console.error('createUser:', error); return null }
  return data
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

  const today = new Date().toISOString().split('T')[0]
  const lastLogin = user.last_login_date

  if (lastLogin === today) return { streak: user.streak_days, isNew: false }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const newStreak = lastLogin === yesterdayStr ? user.streak_days + 1 : 1

  await supabase.from('users').update({
    streak_days: newStreak,
    last_login_date: today,
  }).eq('id', userId)

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
    // Increment user sticker count
    await supabase.rpc('increment_sticker_count', { user_id_param: userId })
  }

  return !error
}

export async function claimDailySticker(userId: string): Promise<{ claimed: boolean; stickerId: string | null }> {
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('daily_claims')
    .select('id')
    .eq('user_id', userId)
    .eq('claimed_date', today)
    .single()

  if (existing) return { claimed: false, stickerId: null }

  // Pick a random common country sticker
  const commonStickerIds = ['c_mex','c_rsa','c_kor','c_can','c_bra','c_mar','c_usa','c_ger','c_ned','c_esp','c_fra','c_arg','c_por','c_eng']
  const stickerId = commonStickerIds[Math.floor(Math.random() * commonStickerIds.length)]

  await supabase.from('daily_claims').insert({ user_id: userId, claimed_date: today, sticker_id: stickerId })
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
  if (count === 5) await awardSticker(userId, 'a_quiz5')
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
  awayGoals: number
): Promise<boolean> {
  const { error } = await supabase.from('predictions').upsert({
    user_id: userId,
    match_id: matchId,
    predicted_home: homeGoals,
    predicted_away: awayGoals,
    created_at: new Date().toISOString(),
  }, { onConflict: 'user_id,match_id' })

  if (!error) await awardSticker(userId, 'a_predict1')
  return !error
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
