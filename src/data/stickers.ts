import { StickerDefinition } from '@/types'

export const STICKERS: StickerDefinition[] = [
  // ── COUNTRY STICKERS (common, one per group-A team for now) ──────────────
  { id: 'c_mex', name_en: 'Mexico', name_he: 'מקסיקו', category: 'country', rarity: 'common', emoji: '🇲🇽', color_from: '#006847', color_to: '#CE1126', text_color: '#fff', team_id: '1', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_rsa', name_en: 'South Africa', name_he: 'ד. אפריקה', category: 'country', rarity: 'common', emoji: '🇿🇦', color_from: '#007A4D', color_to: '#FFB81C', text_color: '#fff', team_id: '2', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_kor', name_en: 'South Korea', name_he: 'קוריאה', category: 'country', rarity: 'common', emoji: '🇰🇷', color_from: '#003478', color_to: '#CD2E3A', text_color: '#fff', team_id: '3', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_can', name_en: 'Canada', name_he: 'קנדה', category: 'country', rarity: 'common', emoji: '🇨🇦', color_from: '#FF0000', color_to: '#cc0000', text_color: '#fff', team_id: '5', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_bra', name_en: 'Brazil', name_he: 'ברזיל', category: 'country', rarity: 'common', emoji: '🇧🇷', color_from: '#009c3b', color_to: '#FFDF00', text_color: '#002776', team_id: '9', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_mar', name_en: 'Morocco', name_he: 'מרוקו', category: 'country', rarity: 'common', emoji: '🇲🇦', color_from: '#C1272D', color_to: '#006233', text_color: '#fff', team_id: '10', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_usa', name_en: 'USA', name_he: 'ארה"ב', category: 'country', rarity: 'common', emoji: '🇺🇸', color_from: '#002868', color_to: '#BF0A30', text_color: '#fff', team_id: '13', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_ger', name_en: 'Germany', name_he: 'גרמניה', category: 'country', rarity: 'common', emoji: '🇩🇪', color_from: '#000000', color_to: '#DD0000', text_color: '#FFCE00', team_id: '17', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_ned', name_en: 'Netherlands', name_he: 'הולנד', category: 'country', rarity: 'common', emoji: '🇳🇱', color_from: '#AE1C28', color_to: '#FF6600', text_color: '#fff', team_id: '21', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_esp', name_en: 'Spain', name_he: 'ספרד', category: 'country', rarity: 'common', emoji: '🇪🇸', color_from: '#AA151B', color_to: '#F1BF00', text_color: '#fff', team_id: '29', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_fra', name_en: 'France', name_he: 'צרפת', category: 'country', rarity: 'common', emoji: '🇫🇷', color_from: '#002395', color_to: '#ED2939', text_color: '#fff', team_id: '33', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_arg', name_en: 'Argentina', name_he: 'ארגנטינה', category: 'country', rarity: 'common', emoji: '🇦🇷', color_from: '#74ACDF', color_to: '#5BA4CF', text_color: '#fff', team_id: '37', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_por', name_en: 'Portugal', name_he: 'פורטוגל', category: 'country', rarity: 'common', emoji: '🇵🇹', color_from: '#006600', color_to: '#FF0000', text_color: '#FFD700', team_id: '41', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_eng', name_en: 'England', name_he: 'אנגליה', category: 'country', rarity: 'common', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color_from: '#012169', color_to: '#C8102E', text_color: '#fff', team_id: '45', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_cro', name_en: 'Croatia', name_he: 'קרואטיה', category: 'country', rarity: 'common', emoji: '🇭🇷', color_from: '#FF0000', color_to: '#171796', text_color: '#fff', team_id: '46', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },
  { id: 'c_jap', name_en: 'Japan', name_he: 'יפן', category: 'country', rarity: 'common', emoji: '🇯🇵', color_from: '#003087', color_to: '#BC002D', text_color: '#fff', team_id: '22', unlock_condition: 'Daily login', unlock_condition_he: 'כניסה יומית' },

  // ── PLAYER STICKERS (rare) ───────────────────────────────────────────────
  { id: 'p_mbappe', name_en: 'Mbappé', name_he: 'מבאפה', category: 'player', rarity: 'rare', emoji: '⚡', color_from: '#002395', color_to: '#ED2939', text_color: '#FFD700', player_name: 'Kylian Mbappé', unlock_condition: 'Answer 3 quiz questions correctly', unlock_condition_he: 'ענה נכון על 3 שאלות' },
  { id: 'p_vini', name_en: 'Vinicius Jr.', name_he: "ויניציוס", category: 'player', rarity: 'rare', emoji: '🌟', color_from: '#009c3b', color_to: '#FFDF00', text_color: '#002776', player_name: 'Vinicius Jr.', unlock_condition: 'Answer 3 quiz questions correctly', unlock_condition_he: 'ענה נכון על 3 שאלות' },
  { id: 'p_ronaldo', name_en: 'Ronaldo', name_he: 'רונאלדו', category: 'player', rarity: 'epic', emoji: '🐐', color_from: '#006600', color_to: '#FF0000', text_color: '#FFD700', player_name: 'Cristiano Ronaldo', unlock_condition: '7-day login streak', unlock_condition_he: '7 ימי כניסה רצופים' },
  { id: 'p_messi', name_en: 'Messi', name_he: 'מסי', category: 'player', rarity: 'legend', emoji: '👑', color_from: '#74ACDF', color_to: '#FFD700', text_color: '#002776', player_name: 'Lionel Messi', unlock_condition: 'Perfect score prediction', unlock_condition_he: 'ניחוש תוצאה מדויק' },
  { id: 'p_bellingham', name_en: 'Bellingham', name_he: 'בלינגהם', category: 'player', rarity: 'rare', emoji: '🦁', color_from: '#012169', color_to: '#C8102E', text_color: '#FFD700', player_name: 'Jude Bellingham', unlock_condition: 'Answer 5 quiz questions', unlock_condition_he: 'ענה על 5 שאלות' },
  { id: 'p_haaland', name_en: 'Haaland', name_he: 'הולאנד', category: 'player', rarity: 'rare', emoji: '🚀', color_from: '#EF0107', color_to: '#6CABDD', text_color: '#fff', player_name: 'Erling Haaland', unlock_condition: 'Predict a Norway match', unlock_condition_he: 'נחש משחק של נורווגיה' },
  { id: 'p_pedri', name_en: 'Pedri', name_he: 'פדרי', category: 'player', rarity: 'rare', emoji: '✨', color_from: '#AA151B', color_to: '#F1BF00', text_color: '#fff', player_name: 'Pedri', unlock_condition: 'Answer 3 quiz questions', unlock_condition_he: 'ענה על 3 שאלות' },
  { id: 'p_neuer', name_en: 'Neuer', name_he: 'נויאר', category: 'player', rarity: 'rare', emoji: '🧤', color_from: '#000000', color_to: '#DD0000', text_color: '#FFCE00', player_name: 'Manuel Neuer', unlock_condition: 'Predict 3 match results', unlock_condition_he: 'נחש 3 תוצאות' },

  // ── MOMENT STICKERS (epic) ───────────────────────────────────────────────
  { id: 'm_hattrick', name_en: 'Hat-Trick!', name_he: 'האט-טריק!', category: 'moment', rarity: 'epic', emoji: '🎩', color_from: '#7B2D8B', color_to: '#FF6B6B', text_color: '#FFD700', unlock_condition: 'A hat-trick occurs in a match', unlock_condition_he: 'שחקן כבש 3 שערים במשחק' },
  { id: 'm_penalty_miss', name_en: 'Penalty Miss', name_he: 'החטאת פנדל', category: 'moment', rarity: 'epic', emoji: '😱', color_from: '#e63946', color_to: '#c1121f', text_color: '#fff', unlock_condition: 'A penalty is missed', unlock_condition_he: 'פנדל לא נכנס' },
  { id: 'm_red_card', name_en: 'Red Card!', name_he: 'כרטיס אדום!', category: 'moment', rarity: 'rare', emoji: '🟥', color_from: '#e63946', color_to: '#9d0208', text_color: '#fff', unlock_condition: 'A red card is shown', unlock_condition_he: 'ניתן כרטיס אדום' },
  { id: 'm_og', name_en: 'Own Goal', name_he: 'גול עצמי', category: 'moment', rarity: 'rare', emoji: '😬', color_from: '#f77f00', color_to: '#d62828', text_color: '#fff', unlock_condition: 'An own goal occurs', unlock_condition_he: 'גול עצמי' },
  { id: 'm_extra_time', name_en: 'Extra Time!', name_he: 'הארכה!', category: 'moment', rarity: 'epic', emoji: '⏰', color_from: '#023e8a', color_to: '#0077b6', text_color: '#90e0ef', unlock_condition: 'A match goes to extra time', unlock_condition_he: 'משחק הגיע להארכה' },
  { id: 'm_penalties', name_en: 'Penalty Shootout', name_he: 'בעיטות עונשין', category: 'moment', rarity: 'epic', emoji: '🎯', color_from: '#7400b8', color_to: '#5e60ce', text_color: '#c77dff', unlock_condition: 'A penalty shootout occurs', unlock_condition_he: 'פנדלים' },
  { id: 'm_last_min', name_en: 'Last Minute!', name_he: 'רגע אחרון!', category: 'moment', rarity: 'epic', emoji: '💥', color_from: '#d62828', color_to: '#f77f00', text_color: '#fff', unlock_condition: 'A 90th-minute goal is scored', unlock_condition_he: 'שער בדקה ה-90' },
  { id: 'm_clean_sheet', name_en: 'Clean Sheet', name_he: 'שמירה על 0', category: 'moment', rarity: 'rare', emoji: '🛡️', color_from: '#2b9348', color_to: '#55a630', text_color: '#fff', unlock_condition: 'A team keeps a clean sheet', unlock_condition_he: 'קבוצה לא ספגה שערים' },
  { id: 'm_big_win', name_en: 'Big Win!', name_he: 'ניצחון גדול!', category: 'moment', rarity: 'rare', emoji: '🏅', color_from: '#e9c46a', color_to: '#f4a261', text_color: '#264653', unlock_condition: 'A team wins by 3+ goals', unlock_condition_he: 'ניצחון ב-3 שערים הפרש' },

  // ── ACHIEVEMENT STICKERS (epic/legend) ───────────────────────────────────
  { id: 'a_welcome', name_en: 'Welcome!', name_he: 'ברוך הבא!', category: 'achievement', rarity: 'common', emoji: '🎉', color_from: '#48cae4', color_to: '#0096c7', text_color: '#fff', unlock_condition: 'First login', unlock_condition_he: 'כניסה ראשונה' },
  { id: 'a_streak3', name_en: '3-Day Streak', name_he: '3 ימים רצופים', category: 'achievement', rarity: 'rare', emoji: '🔥', color_from: '#f77f00', color_to: '#d62828', text_color: '#fff', unlock_condition: 'Login 3 days in a row', unlock_condition_he: '3 ימי כניסה רצופים' },
  { id: 'a_streak7', name_en: 'Week Warrior', name_he: 'לוחם השבוע', category: 'achievement', rarity: 'epic', emoji: '⚡', color_from: '#7400b8', color_to: '#e040fb', text_color: '#fff', unlock_condition: 'Login 7 days in a row', unlock_condition_he: '7 ימי כניסה רצופים' },
  { id: 'a_quiz5', name_en: 'Quiz Whiz', name_he: 'אלוף החידון', category: 'achievement', rarity: 'rare', emoji: '🧠', color_from: '#023e8a', color_to: '#48cae4', text_color: '#fff', unlock_condition: 'Answer 5 quiz questions correctly', unlock_condition_he: '5 תשובות נכונות' },
  { id: 'a_quiz20', name_en: 'Quiz Master', name_he: 'מאסטר החידון', category: 'achievement', rarity: 'epic', emoji: '🏆', color_from: '#FFD700', color_to: '#FFA500', text_color: '#333', unlock_condition: 'Answer 20 quiz questions correctly', unlock_condition_he: '20 תשובות נכונות' },
  { id: 'a_predict1', name_en: 'First Guess', name_he: 'ניחוש ראשון', category: 'achievement', rarity: 'common', emoji: '🔮', color_from: '#5e60ce', color_to: '#7400b8', text_color: '#fff', unlock_condition: 'Make your first prediction', unlock_condition_he: 'ניחוש ראשון' },
  { id: 'a_predict_win', name_en: 'Right Winner', name_he: 'ניחשת נכון!', category: 'achievement', rarity: 'rare', emoji: '🎯', color_from: '#2b9348', color_to: '#aacc00', text_color: '#fff', unlock_condition: 'Predict the correct match winner', unlock_condition_he: 'ניחוש מנצח נכון' },
  { id: 'a_exact_score', name_en: 'Exact Score!', name_he: 'תוצאה מדויקת!', category: 'achievement', rarity: 'legend', emoji: '💎', color_from: '#c9d6ff', color_to: '#e2e2e2', text_color: '#000', unlock_condition: 'Predict the exact final score', unlock_condition_he: 'ניחוש תוצאה מדויקת' },
  { id: 'a_bug', name_en: 'Helper', name_he: 'עוזר', category: 'achievement', rarity: 'common', emoji: '🐛', color_from: '#52b788', color_to: '#40916c', text_color: '#fff', unlock_condition: 'Submit a bug report', unlock_condition_he: 'דיווח על בעיה' },
  { id: 'a_collector10', name_en: '10 Stickers', name_he: '10 מדבקות', category: 'achievement', rarity: 'rare', emoji: '📚', color_from: '#e9c46a', color_to: '#2a9d8f', text_color: '#fff', unlock_condition: 'Collect 10 stickers', unlock_condition_he: '10 מדבקות באלבום' },
  { id: 'a_collector30', name_en: '30 Stickers', name_he: '30 מדבקות', category: 'achievement', rarity: 'epic', emoji: '🌟', color_from: '#FFD700', color_to: '#FF6B6B', text_color: '#fff', unlock_condition: 'Collect 30 stickers', unlock_condition_he: '30 מדבקות באלבום' },
  { id: 'a_all_groups', name_en: 'Globe Trotter', name_he: 'סייר עולמי', category: 'achievement', rarity: 'legend', emoji: '🌍', color_from: '#023e8a', color_to: '#00b4d8', text_color: '#FFD700', unlock_condition: 'Collect a sticker from every group', unlock_condition_he: 'מדבקה מכל קבוצה' },
]

export const STICKERS_BY_ID = Object.fromEntries(STICKERS.map(s => [s.id, s]))

export const RARITY_ORDER: Record<string, number> = {
  common: 0, rare: 1, epic: 2, legend: 3
}

export const RARITY_COLORS: Record<string, { border: string; glow: string; label: string }> = {
  common:  { border: '#9e9e9e', glow: 'rgba(158,158,158,0.3)', label: '📗 COMMON' },
  rare:    { border: '#2196f3', glow: 'rgba(33,150,243,0.4)',  label: '💙 RARE' },
  epic:    { border: '#9c27b0', glow: 'rgba(156,39,176,0.5)', label: '💜 EPIC' },
  legend:  { border: '#FFD700', glow: 'rgba(255,215,0,0.6)',  label: '⭐ LEGEND' },
}
