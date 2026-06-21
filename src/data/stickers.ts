import { StickerDefinition, Language } from '@/types'
import { STICKER_TEXT_EN } from './en'
import { STICKER_TEXT_HE } from './he'

// Display names/unlock conditions live in data/en.ts / data/he.ts,
// resolved via getStickerText() below.
export const STICKERS: StickerDefinition[] = [
  // ── COUNTRY STICKERS (common, one per group-A team for now) ──────────────
  { id: 'c_mex', category: 'country', rarity: 'common', emoji: '🇲🇽', color_from: '#006847', color_to: '#CE1126', text_color: '#fff', team_id: '1' },
  { id: 'c_rsa', category: 'country', rarity: 'common', emoji: '🇿🇦', color_from: '#007A4D', color_to: '#FFB81C', text_color: '#fff', team_id: '2' },
  { id: 'c_kor', category: 'country', rarity: 'common', emoji: '🇰🇷', color_from: '#003478', color_to: '#CD2E3A', text_color: '#fff', team_id: '3' },
  { id: 'c_can', category: 'country', rarity: 'common', emoji: '🇨🇦', color_from: '#FF0000', color_to: '#cc0000', text_color: '#fff', team_id: '5' },
  { id: 'c_bra', category: 'country', rarity: 'common', emoji: '🇧🇷', color_from: '#009c3b', color_to: '#FFDF00', text_color: '#002776', team_id: '9' },
  { id: 'c_mar', category: 'country', rarity: 'common', emoji: '🇲🇦', color_from: '#C1272D', color_to: '#006233', text_color: '#fff', team_id: '10' },
  { id: 'c_usa', category: 'country', rarity: 'common', emoji: '🇺🇸', color_from: '#002868', color_to: '#BF0A30', text_color: '#fff', team_id: '13' },
  { id: 'c_ger', category: 'country', rarity: 'common', emoji: '🇩🇪', color_from: '#000000', color_to: '#DD0000', text_color: '#FFCE00', team_id: '17' },
  { id: 'c_ned', category: 'country', rarity: 'common', emoji: '🇳🇱', color_from: '#AE1C28', color_to: '#FF6600', text_color: '#fff', team_id: '21' },
  { id: 'c_esp', category: 'country', rarity: 'common', emoji: '🇪🇸', color_from: '#AA151B', color_to: '#F1BF00', text_color: '#fff', team_id: '29' },
  { id: 'c_fra', category: 'country', rarity: 'common', emoji: '🇫🇷', color_from: '#002395', color_to: '#ED2939', text_color: '#fff', team_id: '33' },
  { id: 'c_arg', category: 'country', rarity: 'common', emoji: '🇦🇷', color_from: '#74ACDF', color_to: '#5BA4CF', text_color: '#fff', team_id: '37' },
  { id: 'c_por', category: 'country', rarity: 'common', emoji: '🇵🇹', color_from: '#006600', color_to: '#FF0000', text_color: '#FFD700', team_id: '41' },
  { id: 'c_eng', category: 'country', rarity: 'common', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color_from: '#012169', color_to: '#C8102E', text_color: '#fff', team_id: '45' },
  { id: 'c_cro', category: 'country', rarity: 'common', emoji: '🇭🇷', color_from: '#FF0000', color_to: '#171796', text_color: '#fff', team_id: '46' },
  { id: 'c_jap', category: 'country', rarity: 'common', emoji: '🇯🇵', color_from: '#003087', color_to: '#BC002D', text_color: '#fff', team_id: '22' },

  // ── PLAYER STICKERS (rare) ───────────────────────────────────────────────
  { id: 'p_mbappe', category: 'player', rarity: 'rare', emoji: '⚡', color_from: '#002395', color_to: '#ED2939', text_color: '#FFD700', player_name: 'Kylian Mbappé' },
  { id: 'p_vini', category: 'player', rarity: 'rare', emoji: '🌟', color_from: '#009c3b', color_to: '#FFDF00', text_color: '#002776', player_name: 'Vinicius Jr.' },
  { id: 'p_ronaldo', category: 'player', rarity: 'epic', emoji: '🐐', color_from: '#006600', color_to: '#FF0000', text_color: '#FFD700', player_name: 'Cristiano Ronaldo' },
  { id: 'p_messi', category: 'player', rarity: 'legend', emoji: '👑', color_from: '#74ACDF', color_to: '#FFD700', text_color: '#002776', player_name: 'Lionel Messi' },
  { id: 'p_bellingham', category: 'player', rarity: 'rare', emoji: '🦁', color_from: '#012169', color_to: '#C8102E', text_color: '#FFD700', player_name: 'Jude Bellingham' },
  { id: 'p_haaland', category: 'player', rarity: 'rare', emoji: '🚀', color_from: '#EF0107', color_to: '#6CABDD', text_color: '#fff', player_name: 'Erling Haaland' },
  { id: 'p_pedri', category: 'player', rarity: 'rare', emoji: '✨', color_from: '#AA151B', color_to: '#F1BF00', text_color: '#fff', player_name: 'Pedri' },
  { id: 'p_neuer', category: 'player', rarity: 'rare', emoji: '🧤', color_from: '#000000', color_to: '#DD0000', text_color: '#FFCE00', player_name: 'Manuel Neuer' },

  // ── MOMENT STICKERS (epic) ───────────────────────────────────────────────
  { id: 'm_hattrick', category: 'moment', rarity: 'epic', emoji: '🎩', color_from: '#7B2D8B', color_to: '#FF6B6B', text_color: '#FFD700' },
  { id: 'm_penalty_miss', category: 'moment', rarity: 'epic', emoji: '😱', color_from: '#e63946', color_to: '#c1121f', text_color: '#fff' },
  { id: 'm_red_card', category: 'moment', rarity: 'rare', emoji: '🟥', color_from: '#e63946', color_to: '#9d0208', text_color: '#fff' },
  { id: 'm_og', category: 'moment', rarity: 'rare', emoji: '😬', color_from: '#f77f00', color_to: '#d62828', text_color: '#fff' },
  { id: 'm_extra_time', category: 'moment', rarity: 'epic', emoji: '⏰', color_from: '#023e8a', color_to: '#0077b6', text_color: '#90e0ef' },
  { id: 'm_penalties', category: 'moment', rarity: 'epic', emoji: '🎯', color_from: '#7400b8', color_to: '#5e60ce', text_color: '#c77dff' },
  { id: 'm_last_min', category: 'moment', rarity: 'epic', emoji: '💥', color_from: '#d62828', color_to: '#f77f00', text_color: '#fff' },
  { id: 'm_clean_sheet', category: 'moment', rarity: 'rare', emoji: '🛡️', color_from: '#2b9348', color_to: '#55a630', text_color: '#fff' },
  { id: 'm_big_win', category: 'moment', rarity: 'rare', emoji: '🏅', color_from: '#e9c46a', color_to: '#f4a261', text_color: '#264653' },

  // ── ACHIEVEMENT STICKERS (epic/legend) ───────────────────────────────────
  { id: 'a_welcome', category: 'achievement', rarity: 'common', emoji: '🎉', color_from: '#48cae4', color_to: '#0096c7', text_color: '#fff' },
  { id: 'a_streak3', category: 'achievement', rarity: 'rare', emoji: '🔥', color_from: '#f77f00', color_to: '#d62828', text_color: '#fff' },
  { id: 'a_streak7', category: 'achievement', rarity: 'epic', emoji: '⚡', color_from: '#7400b8', color_to: '#e040fb', text_color: '#fff' },
  { id: 'a_quiz5', category: 'achievement', rarity: 'rare', emoji: '🧠', color_from: '#023e8a', color_to: '#48cae4', text_color: '#fff' },
  { id: 'a_quiz20', category: 'achievement', rarity: 'epic', emoji: '🏆', color_from: '#FFD700', color_to: '#FFA500', text_color: '#333' },
  { id: 'a_predict1', category: 'achievement', rarity: 'common', emoji: '🔮', color_from: '#5e60ce', color_to: '#7400b8', text_color: '#fff' },
  { id: 'a_predict_win', category: 'achievement', rarity: 'rare', emoji: '🎯', color_from: '#2b9348', color_to: '#aacc00', text_color: '#fff' },
  { id: 'a_exact_score', category: 'achievement', rarity: 'legend', emoji: '💎', color_from: '#c9d6ff', color_to: '#e2e2e2', text_color: '#000' },
  { id: 'a_bug', category: 'achievement', rarity: 'common', emoji: '🐛', color_from: '#52b788', color_to: '#40916c', text_color: '#fff' },
  { id: 'a_collector10', category: 'achievement', rarity: 'rare', emoji: '📚', color_from: '#e9c46a', color_to: '#2a9d8f', text_color: '#fff' },
  { id: 'a_collector30', category: 'achievement', rarity: 'epic', emoji: '🌟', color_from: '#FFD700', color_to: '#FF6B6B', text_color: '#fff' },
  { id: 'a_all_groups', category: 'achievement', rarity: 'legend', emoji: '🌍', color_from: '#023e8a', color_to: '#00b4d8', text_color: '#FFD700' },
]

export const STICKERS_BY_ID = Object.fromEntries(STICKERS.map(s => [s.id, s]))

export const RARITY_ORDER: Record<string, number> = {
  common: 0, rare: 1, epic: 2, legend: 3
}

export const RARITY_COLORS: Record<string, { border: string; glow: string }> = {
  common:  { border: '#9e9e9e', glow: 'rgba(158,158,158,0.3)' },
  rare:    { border: '#2196f3', glow: 'rgba(33,150,243,0.4)' },
  epic:    { border: '#9c27b0', glow: 'rgba(156,39,176,0.5)' },
  legend:  { border: '#FFD700', glow: 'rgba(255,215,0,0.6)' },
}

export function getStickerText(id: string | undefined, lang: Language): { name: string; unlock_condition: string } {
  if (!id) return { name: '', unlock_condition: '' }
  const map = lang === 'he' ? STICKER_TEXT_HE : STICKER_TEXT_EN
  return map[id] ?? { name: id, unlock_condition: '' }
}
