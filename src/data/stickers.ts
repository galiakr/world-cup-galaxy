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

  // ── COUNTRY STICKERS (remaining 32 teams) ────────────────────────────────
  { id: 'c_bih', category: 'country', rarity: 'common', emoji: '🇧🇦', color_from: '#003366', color_to: '#FFD700', text_color: '#fff', team_id: '6' },
  { id: 'c_qat', category: 'country', rarity: 'common', emoji: '🇶🇦', color_from: '#8D1B3D', color_to: '#6B1230', text_color: '#fff', team_id: '7' },
  { id: 'c_sui', category: 'country', rarity: 'common', emoji: '🇨🇭', color_from: '#D52B1E', color_to: '#B31217', text_color: '#fff', team_id: '8' },
  { id: 'c_hai', category: 'country', rarity: 'common', emoji: '🇭🇹', color_from: '#00209F', color_to: '#D21034', text_color: '#fff', team_id: '11' },
  { id: 'c_sco', category: 'country', rarity: 'common', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color_from: '#003F87', color_to: '#005EB8', text_color: '#fff', team_id: '12' },
  { id: 'c_par', category: 'country', rarity: 'common', emoji: '🇵🇾', color_from: '#D52B1E', color_to: '#0038A8', text_color: '#fff', team_id: '14' },
  { id: 'c_aus', category: 'country', rarity: 'common', emoji: '🇦🇺', color_from: '#00008B', color_to: '#FF0000', text_color: '#FFD700', team_id: '15' },
  { id: 'c_tur', category: 'country', rarity: 'common', emoji: '🇹🇷', color_from: '#E30A17', color_to: '#C8102E', text_color: '#fff', team_id: '16' },
  { id: 'c_cuw', category: 'country', rarity: 'common', emoji: '🇨🇼', color_from: '#003087', color_to: '#0099CC', text_color: '#FFD700', team_id: '18' },
  { id: 'c_civ', category: 'country', rarity: 'common', emoji: '🇨🇮', color_from: '#F77F00', color_to: '#009A44', text_color: '#fff', team_id: '19' },
  { id: 'c_ecu', category: 'country', rarity: 'common', emoji: '🇪🇨', color_from: '#FFD100', color_to: '#0033A0', text_color: '#fff', team_id: '20' },
  { id: 'c_swe', category: 'country', rarity: 'common', emoji: '🇸🇪', color_from: '#006AA7', color_to: '#FECC02', text_color: '#fff', team_id: '23' },
  { id: 'c_tun', category: 'country', rarity: 'common', emoji: '🇹🇳', color_from: '#E70013', color_to: '#C8102E', text_color: '#fff', team_id: '24' },
  { id: 'c_bel', category: 'country', rarity: 'common', emoji: '🇧🇪', color_from: '#000000', color_to: '#E30C29', text_color: '#FFD700', team_id: '25' },
  { id: 'c_egy', category: 'country', rarity: 'common', emoji: '🇪🇬', color_from: '#C8102E', color_to: '#000000', text_color: '#FFD700', team_id: '26' },
  { id: 'c_irn', category: 'country', rarity: 'common', emoji: '🇮🇷', color_from: '#239F40', color_to: '#DA0000', text_color: '#fff', team_id: '27' },
  { id: 'c_nzl', category: 'country', rarity: 'common', emoji: '🇳🇿', color_from: '#00247D', color_to: '#CC142B', text_color: '#fff', team_id: '28' },
  { id: 'c_cpv', category: 'country', rarity: 'common', emoji: '🇨🇻', color_from: '#003893', color_to: '#CF2027', text_color: '#FFD700', team_id: '30' },
  { id: 'c_ksa', category: 'country', rarity: 'common', emoji: '🇸🇦', color_from: '#006C35', color_to: '#008A2E', text_color: '#fff', team_id: '31' },
  { id: 'c_uru', category: 'country', rarity: 'common', emoji: '🇺🇾', color_from: '#75AADB', color_to: '#4A90D9', text_color: '#fff', team_id: '32' },
  { id: 'c_sen', category: 'country', rarity: 'common', emoji: '🇸🇳', color_from: '#00853F', color_to: '#E31B23', text_color: '#FDEF42', team_id: '34' },
  { id: 'c_irq', category: 'country', rarity: 'common', emoji: '🇮🇶', color_from: '#CE1126', color_to: '#007A3D', text_color: '#fff', team_id: '35' },
  { id: 'c_nor', category: 'country', rarity: 'common', emoji: '🇳🇴', color_from: '#EF2B2D', color_to: '#003087', text_color: '#fff', team_id: '36' },
  { id: 'c_alg', category: 'country', rarity: 'common', emoji: '🇩🇿', color_from: '#006233', color_to: '#D21034', text_color: '#fff', team_id: '38' },
  { id: 'c_aut', category: 'country', rarity: 'common', emoji: '🇦🇹', color_from: '#ED2939', color_to: '#C8102E', text_color: '#fff', team_id: '39' },
  { id: 'c_jor', category: 'country', rarity: 'common', emoji: '🇯🇴', color_from: '#007A3D', color_to: '#CE1126', text_color: '#fff', team_id: '40' },
  { id: 'c_drc', category: 'country', rarity: 'common', emoji: '🇨🇩', color_from: '#007FFF', color_to: '#CE1021', text_color: '#F7D618', team_id: '42' },
  { id: 'c_uzb', category: 'country', rarity: 'common', emoji: '🇺🇿', color_from: '#1EB53A', color_to: '#0099B5', text_color: '#fff', team_id: '43' },
  { id: 'c_col', category: 'country', rarity: 'common', emoji: '🇨🇴', color_from: '#FCD116', color_to: '#003087', text_color: '#CE1126', team_id: '44' },
  { id: 'c_gha', category: 'country', rarity: 'common', emoji: '🇬🇭', color_from: '#CE1126', color_to: '#006B3F', text_color: '#FCD116', team_id: '47' },
  { id: 'c_pan', category: 'country', rarity: 'common', emoji: '🇵🇦', color_from: '#C8102E', color_to: '#003087', text_color: '#fff', team_id: '48' },

  // ── PLAYER STICKERS (rare) ───────────────────────────────────────────────
  { id: 'p_mbappe', category: 'player', rarity: 'rare', emoji: '⚡', color_from: '#002395', color_to: '#ED2939', text_color: '#FFD700', player_name: 'Kylian Mbappé' },
  { id: 'p_vini', category: 'player', rarity: 'rare', emoji: '🌟', color_from: '#009c3b', color_to: '#FFDF00', text_color: '#002776', player_name: 'Vinicius Jr.' },
  { id: 'p_ronaldo', category: 'player', rarity: 'epic', emoji: '🐐', color_from: '#006600', color_to: '#FF0000', text_color: '#FFD700', player_name: 'Cristiano Ronaldo' },
  { id: 'p_messi', category: 'player', rarity: 'legend', emoji: '👑', color_from: '#74ACDF', color_to: '#FFD700', text_color: '#002776', player_name: 'Lionel Messi' },
  { id: 'p_bellingham', category: 'player', rarity: 'rare', emoji: '🦁', color_from: '#012169', color_to: '#C8102E', text_color: '#FFD700', player_name: 'Jude Bellingham' },
  { id: 'p_haaland', category: 'player', rarity: 'rare', emoji: '🚀', color_from: '#EF0107', color_to: '#6CABDD', text_color: '#fff', player_name: 'Erling Haaland' },
  { id: 'p_pedri', category: 'player', rarity: 'rare', emoji: '✨', color_from: '#AA151B', color_to: '#F1BF00', text_color: '#fff', player_name: 'Pedri' },
  { id: 'p_neuer', category: 'player', rarity: 'rare', emoji: '🧤', color_from: '#000000', color_to: '#DD0000', text_color: '#FFCE00', player_name: 'Manuel Neuer' },
  { id: 'p_yamal', category: 'player', rarity: 'epic', emoji: '⭐', color_from: '#AA151B', color_to: '#F1BF00', text_color: '#fff', player_name: 'Lamine Yamal' },
  { id: 'p_saka', category: 'player', rarity: 'rare', emoji: '💫', color_from: '#C8102E', color_to: '#012169', text_color: '#FFD700', player_name: 'Bukayo Saka' },
  { id: 'p_lautaro', category: 'player', rarity: 'rare', emoji: '🐉', color_from: '#74ACDF', color_to: '#FFD700', text_color: '#002776', player_name: 'Lautaro Martínez' },
  { id: 'p_odegaard', category: 'player', rarity: 'rare', emoji: '🎼', color_from: '#EF2B2D', color_to: '#003087', text_color: '#fff', player_name: 'Martin Ødegaard' },

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
  { id: 'm_freekick', category: 'moment', rarity: 'rare', emoji: '🌀', color_from: '#2193b0', color_to: '#6dd5ed', text_color: '#fff' },
  { id: 'm_comeback', category: 'moment', rarity: 'epic', emoji: '🔄', color_from: '#f46b45', color_to: '#eea849', text_color: '#fff' },
  { id: 'm_brace', category: 'moment', rarity: 'rare', emoji: '✌️', color_from: '#7B2D8B', color_to: '#c471ed', text_color: '#fff' },
  { id: 'm_golden_goal', category: 'moment', rarity: 'legend', emoji: '🥇', color_from: '#FFD700', color_to: '#FF8C00', text_color: '#000' },

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
  { id: 'a_collector50', category: 'achievement', rarity: 'legend', emoji: '👑', color_from: '#FFD700', color_to: '#FF8C00', text_color: '#000' },
  { id: 'a_all_groups', category: 'achievement', rarity: 'legend', emoji: '🌍', color_from: '#023e8a', color_to: '#00b4d8', text_color: '#FFD700' },
  { id: 'a_streak14', category: 'achievement', rarity: 'legend', emoji: '🌙', color_from: '#240090', color_to: '#7400b8', text_color: '#e040fb' },
  { id: 'a_quiz10', category: 'achievement', rarity: 'rare', emoji: '🎓', color_from: '#023e8a', color_to: '#90e0ef', text_color: '#fff' },
  { id: 'a_predict_pen', category: 'achievement', rarity: 'rare', emoji: '🥅', color_from: '#5390d9', color_to: '#4361ee', text_color: '#fff' },
  { id: 'a_pen_prophet', category: 'achievement', rarity: 'epic', emoji: '🎱', color_from: '#00b4d8', color_to: '#0077b6', text_color: '#caf0f8' },
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
