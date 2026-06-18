import { Team } from '@/types'

// All 48 World Cup 2026 qualified teams
// flag_url uses flagcdn.com (free, no key) using ISO 3166-1 alpha-2 codes
// wikipedia_slug used to fetch coach photo from Wikipedia Commons API

export const TEAMS: Team[] = [
  // Group A
  { id: '1', name_en: 'Mexico', name_he: 'מקסיקו', fifa_code: 'MEX', group: 'A', flag_emoji: '🇲🇽', flag_url: 'https://flagcdn.com/w80/mx.png', wikipedia_slug: 'Mexico_national_football_team' },
  { id: '2', name_en: 'South Africa', name_he: 'דרום אפריקה', fifa_code: 'RSA', group: 'A', flag_emoji: '🇿🇦', flag_url: 'https://flagcdn.com/w80/za.png', wikipedia_slug: 'South_Africa_national_football_team' },
  { id: '3', name_en: 'South Korea', name_he: 'קוריאה הדרומית', fifa_code: 'KOR', group: 'A', flag_emoji: '🇰🇷', flag_url: 'https://flagcdn.com/w80/kr.png', wikipedia_slug: 'South_Korea_national_football_team' },
  { id: '4', name_en: 'Czech Republic', name_he: 'צ\'כיה', fifa_code: 'CZE', group: 'A', flag_emoji: '🇨🇿', flag_url: 'https://flagcdn.com/w80/cz.png', wikipedia_slug: 'Czech_Republic_national_football_team' },
  // Group B
  { id: '5', name_en: 'Canada', name_he: 'קנדה', fifa_code: 'CAN', group: 'B', flag_emoji: '🇨🇦', flag_url: 'https://flagcdn.com/w80/ca.png', wikipedia_slug: 'Canada_national_soccer_team' },
  { id: '6', name_en: 'Bosnia and Herzegovina', name_he: 'בוסניה והרצגובינה', fifa_code: 'BIH', group: 'B', flag_emoji: '🇧🇦', flag_url: 'https://flagcdn.com/w80/ba.png', wikipedia_slug: 'Bosnia_and_Herzegovina_national_football_team' },
  { id: '7', name_en: 'Qatar', name_he: 'קטר', fifa_code: 'QAT', group: 'B', flag_emoji: '🇶🇦', flag_url: 'https://flagcdn.com/w80/qa.png', wikipedia_slug: 'Qatar_national_football_team' },
  { id: '8', name_en: 'Switzerland', name_he: 'שוויץ', fifa_code: 'SUI', group: 'B', flag_emoji: '🇨🇭', flag_url: 'https://flagcdn.com/w80/ch.png', wikipedia_slug: 'Switzerland_national_football_team' },
  // Group C
  { id: '9', name_en: 'Brazil', name_he: 'ברזיל', fifa_code: 'BRA', group: 'C', flag_emoji: '🇧🇷', flag_url: 'https://flagcdn.com/w80/br.png', wikipedia_slug: 'Brazil_national_football_team' },
  { id: '10', name_en: 'Morocco', name_he: 'מרוקו', fifa_code: 'MAR', group: 'C', flag_emoji: '🇲🇦', flag_url: 'https://flagcdn.com/w80/ma.png', wikipedia_slug: 'Morocco_national_football_team' },
  { id: '11', name_en: 'Haiti', name_he: "האיטי", fifa_code: 'HAI', group: 'C', flag_emoji: '🇭🇹', flag_url: 'https://flagcdn.com/w80/ht.png', wikipedia_slug: 'Haiti_national_football_team' },
  { id: '12', name_en: 'Scotland', name_he: 'סקוטלנד', fifa_code: 'SCO', group: 'C', flag_emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flag_url: 'https://flagcdn.com/w80/gb-sct.png', wikipedia_slug: 'Scotland_national_football_team' },
  // Group D
  { id: '13', name_en: 'USA', name_he: 'ארה"ב', fifa_code: 'USA', group: 'D', flag_emoji: '🇺🇸', flag_url: 'https://flagcdn.com/w80/us.png', wikipedia_slug: 'United_States_men%27s_national_soccer_team' },
  { id: '14', name_en: 'Paraguay', name_he: 'פרגוואי', fifa_code: 'PAR', group: 'D', flag_emoji: '🇵🇾', flag_url: 'https://flagcdn.com/w80/py.png', wikipedia_slug: 'Paraguay_national_football_team' },
  { id: '15', name_en: 'Australia', name_he: 'אוסטרליה', fifa_code: 'AUS', group: 'D', flag_emoji: '🇦🇺', flag_url: 'https://flagcdn.com/w80/au.png', wikipedia_slug: 'Australia_national_soccer_team' },
  { id: '16', name_en: 'Turkey', name_he: 'טורקיה', fifa_code: 'TUR', group: 'D', flag_emoji: '🇹🇷', flag_url: 'https://flagcdn.com/w80/tr.png', wikipedia_slug: 'Turkey_national_football_team' },
  // Group E
  { id: '17', name_en: 'Germany', name_he: 'גרמניה', fifa_code: 'GER', group: 'E', flag_emoji: '🇩🇪', flag_url: 'https://flagcdn.com/w80/de.png', wikipedia_slug: 'Germany_national_football_team' },
  { id: '18', name_en: 'Curaçao', name_he: 'קוראסאו', fifa_code: 'CUW', group: 'E', flag_emoji: '🇨🇼', flag_url: 'https://flagcdn.com/w80/cw.png', wikipedia_slug: 'Curaçao_national_football_team' },
  { id: '19', name_en: 'Ivory Coast', name_he: "חוף השנהב", fifa_code: 'CIV', group: 'E', flag_emoji: '🇨🇮', flag_url: 'https://flagcdn.com/w80/ci.png', wikipedia_slug: 'Ivory_Coast_national_football_team' },
  { id: '20', name_en: 'Ecuador', name_he: 'אקוודור', fifa_code: 'ECU', group: 'E', flag_emoji: '🇪🇨', flag_url: 'https://flagcdn.com/w80/ec.png', wikipedia_slug: 'Ecuador_national_football_team' },
  // Group F
  { id: '21', name_en: 'Netherlands', name_he: 'הולנד', fifa_code: 'NED', group: 'F', flag_emoji: '🇳🇱', flag_url: 'https://flagcdn.com/w80/nl.png', wikipedia_slug: 'Netherlands_national_football_team' },
  { id: '22', name_en: 'Japan', name_he: 'יפן', fifa_code: 'JPN', group: 'F', flag_emoji: '🇯🇵', flag_url: 'https://flagcdn.com/w80/jp.png', wikipedia_slug: 'Japan_national_football_team' },
  { id: '23', name_en: 'Sweden', name_he: 'שוודיה', fifa_code: 'SWE', group: 'F', flag_emoji: '🇸🇪', flag_url: 'https://flagcdn.com/w80/se.png', wikipedia_slug: 'Sweden_national_football_team' },
  { id: '24', name_en: 'Tunisia', name_he: 'תוניסיה', fifa_code: 'TUN', group: 'F', flag_emoji: '🇹🇳', flag_url: 'https://flagcdn.com/w80/tn.png', wikipedia_slug: 'Tunisia_national_football_team' },
  // Group G
  { id: '25', name_en: 'Belgium', name_he: 'בלגיה', fifa_code: 'BEL', group: 'G', flag_emoji: '🇧🇪', flag_url: 'https://flagcdn.com/w80/be.png', wikipedia_slug: 'Belgium_national_football_team' },
  { id: '26', name_en: 'Egypt', name_he: 'מצרים', fifa_code: 'EGY', group: 'G', flag_emoji: '🇪🇬', flag_url: 'https://flagcdn.com/w80/eg.png', wikipedia_slug: 'Egypt_national_football_team' },
  { id: '27', name_en: 'Iran', name_he: 'איראן', fifa_code: 'IRN', group: 'G', flag_emoji: '🇮🇷', flag_url: 'https://flagcdn.com/w80/ir.png', wikipedia_slug: 'Iran_national_football_team' },
  { id: '28', name_en: 'New Zealand', name_he: 'ניו זילנד', fifa_code: 'NZL', group: 'G', flag_emoji: '🇳🇿', flag_url: 'https://flagcdn.com/w80/nz.png', wikipedia_slug: 'New_Zealand_national_football_team' },
  // Group H
  { id: '29', name_en: 'Spain', name_he: 'ספרד', fifa_code: 'ESP', group: 'H', flag_emoji: '🇪🇸', flag_url: 'https://flagcdn.com/w80/es.png', wikipedia_slug: 'Spain_national_football_team' },
  { id: '30', name_en: 'Cape Verde', name_he: 'כף ורדה', fifa_code: 'CPV', group: 'H', flag_emoji: '🇨🇻', flag_url: 'https://flagcdn.com/w80/cv.png', wikipedia_slug: 'Cape_Verde_national_football_team' },
  { id: '31', name_en: 'Saudi Arabia', name_he: 'ערב הסעודית', fifa_code: 'KSA', group: 'H', flag_emoji: '🇸🇦', flag_url: 'https://flagcdn.com/w80/sa.png', wikipedia_slug: 'Saudi_Arabia_national_football_team' },
  { id: '32', name_en: 'Uruguay', name_he: 'אורוגוואי', fifa_code: 'URU', group: 'H', flag_emoji: '🇺🇾', flag_url: 'https://flagcdn.com/w80/uy.png', wikipedia_slug: 'Uruguay_national_football_team' },
  // Group I
  { id: '33', name_en: 'France', name_he: 'צרפת', fifa_code: 'FRA', group: 'I', flag_emoji: '🇫🇷', flag_url: 'https://flagcdn.com/w80/fr.png', wikipedia_slug: 'France_national_football_team' },
  { id: '34', name_en: 'Senegal', name_he: 'סנגל', fifa_code: 'SEN', group: 'I', flag_emoji: '🇸🇳', flag_url: 'https://flagcdn.com/w80/sn.png', wikipedia_slug: 'Senegal_national_football_team' },
  { id: '35', name_en: 'Iraq', name_he: 'עיראק', fifa_code: 'IRQ', group: 'I', flag_emoji: '🇮🇶', flag_url: 'https://flagcdn.com/w80/iq.png', wikipedia_slug: 'Iraq_national_football_team' },
  { id: '36', name_en: 'Norway', name_he: 'נורווגיה', fifa_code: 'NOR', group: 'I', flag_emoji: '🇳🇴', flag_url: 'https://flagcdn.com/w80/no.png', wikipedia_slug: 'Norway_national_football_team' },
  // Group J
  { id: '37', name_en: 'Argentina', name_he: 'ארגנטינה', fifa_code: 'ARG', group: 'J', flag_emoji: '🇦🇷', flag_url: 'https://flagcdn.com/w80/ar.png', wikipedia_slug: 'Argentina_national_football_team' },
  { id: '38', name_en: 'Algeria', name_he: 'אלג\'יריה', fifa_code: 'ALG', group: 'J', flag_emoji: '🇩🇿', flag_url: 'https://flagcdn.com/w80/dz.png', wikipedia_slug: 'Algeria_national_football_team' },
  { id: '39', name_en: 'Austria', name_he: 'אוסטריה', fifa_code: 'AUT', group: 'J', flag_emoji: '🇦🇹', flag_url: 'https://flagcdn.com/w80/at.png', wikipedia_slug: 'Austria_national_football_team' },
  { id: '40', name_en: 'Jordan', name_he: 'ירדן', fifa_code: 'JOR', group: 'J', flag_emoji: '🇯🇴', flag_url: 'https://flagcdn.com/w80/jo.png', wikipedia_slug: 'Jordan_national_football_team' },
  // Group K
  { id: '41', name_en: 'Portugal', name_he: 'פורטוגל', fifa_code: 'POR', group: 'K', flag_emoji: '🇵🇹', flag_url: 'https://flagcdn.com/w80/pt.png', wikipedia_slug: 'Portugal_national_football_team' },
  { id: '42', name_en: 'Democratic Republic of the Congo', name_he: 'קונגו הדמוקרטית', fifa_code: 'COD', group: 'K', flag_emoji: '🇨🇩', flag_url: 'https://flagcdn.com/w80/cd.png', wikipedia_slug: 'DR_Congo_national_football_team' },
  { id: '43', name_en: 'Uzbekistan', name_he: 'אוזבקיסטן', fifa_code: 'UZB', group: 'K', flag_emoji: '🇺🇿', flag_url: 'https://flagcdn.com/w80/uz.png', wikipedia_slug: 'Uzbekistan_national_football_team' },
  { id: '44', name_en: 'Colombia', name_he: 'קולומביה', fifa_code: 'COL', group: 'K', flag_emoji: '🇨🇴', flag_url: 'https://flagcdn.com/w80/co.png', wikipedia_slug: 'Colombia_national_football_team' },
  // Group L
  { id: '45', name_en: 'England', name_he: 'אנגליה', fifa_code: 'ENG', group: 'L', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag_url: 'https://flagcdn.com/w80/gb-eng.png', wikipedia_slug: 'England_national_football_team' },
  { id: '46', name_en: 'Croatia', name_he: 'קרואטיה', fifa_code: 'CRO', group: 'L', flag_emoji: '🇭🇷', flag_url: 'https://flagcdn.com/w80/hr.png', wikipedia_slug: 'Croatia_national_football_team' },
  { id: '47', name_en: 'Ghana', name_he: 'גאנה', fifa_code: 'GHA', group: 'L', flag_emoji: '🇬🇭', flag_url: 'https://flagcdn.com/w80/gh.png', wikipedia_slug: 'Ghana_national_football_team' },
  { id: '48', name_en: 'Panama', name_he: 'פנמה', fifa_code: 'PAN', group: 'L', flag_emoji: '🇵🇦', flag_url: 'https://flagcdn.com/w80/pa.png', wikipedia_slug: 'Panama_national_football_team' },
]

export const TEAMS_BY_ID = Object.fromEntries(TEAMS.map(t => [t.id, t]))
export const TEAMS_BY_FIFA_CODE = Object.fromEntries(TEAMS.map(t => [t.fifa_code, t]))
export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']
