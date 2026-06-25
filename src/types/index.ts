// ─── Tournament Data ───────────────────────────────────────────────────────

// Team carries no language-dependent fields — its display name lives in
// data/en.ts / data/he.ts and is resolved via getTeamName(id, lang) at
// render time. This matters because Team objects (and Match/TopScorer
// below) get embedded into server-fetched data that's cached and shared
// across all users regardless of their language — baking in one
// language at fetch time would show the wrong one to half of them.
export interface Team {
  id: string
  fifa_code: string
  group: string
  flag_url: string        // from flag-icons CDN
  flag_emoji: string
  coach_name?: string
  coach_photo_url?: string
  team_photo_url?: string
  wikipedia_slug?: string // for coach/team photo lookup
  lat?: number            // capital city coordinates, for the countries map
  lng?: number
}

export interface Player {
  id: string
  team_id: string
  name: string
  name_he?: string
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'
  position_he: string
  jersey_number: number
  is_captain: boolean
  photo_url?: string
  goals?: number
  assists?: number
}

export interface GoalEvent {
  scorer: string
  minute: string   // e.g. "67" or "45+5"
  own_goal: boolean
}

export interface Match {
  id: string
  match_number: number
  home_team_id: string
  away_team_id: string
  home_score: number | null
  away_score: number | null
  status: 'scheduled' | 'live' | 'finished'
  round: 'group' | 'round_of_32' | 'round_of_16' | 'quarter' | 'semi' | 'third_place' | 'final'
  group_name?: string
  match_date: string      // ISO date string
  kick_off_utc: string    // ISO datetime
  stadium_id: string
  phase?: string
  home_scorers: GoalEvent[]
  away_scorers: GoalEvent[]
  referee?: string
}

export interface Stadium {
  id: string
  country: string
  capacity: number
  lat: number
  lng: number
}

export interface GroupStanding {
  group: string
  teams: GroupTeamRow[]
}

export interface GroupTeamRow {
  team_id: string
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_diff: number
  points: number
}

export interface TopScorer {
  player_name: string
  team_id: string        // FIFA code — look up via TEAMS_BY_FIFA_CODE
  goals: number
  assists: number
  photo_url?: string
  fact_en?: string        // English Wikipedia summary, best-effort
  fact_he?: string        // native Hebrew Wikipedia article, when one exists
}

// ─── User & Auth ───────────────────────────────────────────────────────────

export interface AppUser {
  id: string
  username: string
  avatar_emoji: string
  streak_days: number
  last_login_date: string
  stickers_count: number
  created_at: string
  lang: 'he' | 'en'
}

// ─── Sticker System ────────────────────────────────────────────────────────

export type StickerRarity = 'common' | 'rare' | 'epic' | 'legend'
export type StickerCategory = 'country' | 'player' | 'moment' | 'achievement'

export interface StickerDefinition {
  id: string
  category: StickerCategory
  rarity: StickerRarity
  emoji: string
  color_from: string    // gradient start
  color_to: string      // gradient end
  text_color: string
  team_id?: string       // for country stickers
  player_name?: string   // for player stickers
}

export interface UserSticker {
  id: string
  user_id: string
  sticker_id: string
  sticker: StickerDefinition
  earned_at: string
  is_new: boolean       // for animation
}

// ─── Quiz ──────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string
  correct_index: number
  difficulty: 'easy' | 'medium' | 'hard'
  sticker_reward_id?: string
  category: 'rules' | 'teams' | 'history' | 'players' | 'tournament'
}

export interface UserQuizAnswer {
  id: string
  user_id: string
  question_id: string
  chosen_index: number
  is_correct: boolean
  answered_at: string
}

// ─── Predictions ───────────────────────────────────────────────────────────

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  match?: Match
  predicted_home: number
  predicted_away: number
  created_at: string
  is_correct_winner?: boolean
  is_exact_score?: boolean
  sticker_awarded?: boolean
}

// ─── Bug Reports ───────────────────────────────────────────────────────────

export interface BugReport {
  id: string
  user_id?: string
  username?: string
  type: 'wrong_info' | 'technical' | 'missing_info' | 'other'
  description: string
  created_at: string
  status: 'open' | 'resolved'
}

// ─── UI State ──────────────────────────────────────────────────────────────

export type Language = 'he' | 'en'
export type Page = 'home' | 'matches' | 'teams' | 'quiz' | 'stickers' | 'predict' | 'rules'
