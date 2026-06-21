import { Team, Language } from '@/types'
import { TEAM_NAMES_EN } from './en'
import { TEAM_NAMES_HE } from './he'

// All 48 World Cup 2026 qualified teams — language-independent fields
// only. Display names live in data/en.ts / data/he.ts, resolved via
// getTeamName() below.
// flag_url uses flagcdn.com (free, no key) using ISO 3166-1 alpha-2 codes
// wikipedia_slug used to fetch coach photo from Wikipedia Commons API

export const TEAMS: Team[] = [
  // Group A
  { id: '1', fifa_code: 'MEX', group: 'A', flag_emoji: '🇲🇽', flag_url: 'https://flagcdn.com/w80/mx.png', wikipedia_slug: 'Mexico_national_football_team' },
  { id: '2', fifa_code: 'RSA', group: 'A', flag_emoji: '🇿🇦', flag_url: 'https://flagcdn.com/w80/za.png', wikipedia_slug: 'South_Africa_national_football_team' },
  { id: '3', fifa_code: 'KOR', group: 'A', flag_emoji: '🇰🇷', flag_url: 'https://flagcdn.com/w80/kr.png', wikipedia_slug: 'South_Korea_national_football_team' },
  { id: '4', fifa_code: 'CZE', group: 'A', flag_emoji: '🇨🇿', flag_url: 'https://flagcdn.com/w80/cz.png', wikipedia_slug: 'Czech_Republic_national_football_team' },
  // Group B
  { id: '5', fifa_code: 'CAN', group: 'B', flag_emoji: '🇨🇦', flag_url: 'https://flagcdn.com/w80/ca.png', wikipedia_slug: 'Canada_national_soccer_team' },
  { id: '6', fifa_code: 'BIH', group: 'B', flag_emoji: '🇧🇦', flag_url: 'https://flagcdn.com/w80/ba.png', wikipedia_slug: 'Bosnia_and_Herzegovina_national_football_team' },
  { id: '7', fifa_code: 'QAT', group: 'B', flag_emoji: '🇶🇦', flag_url: 'https://flagcdn.com/w80/qa.png', wikipedia_slug: 'Qatar_national_football_team' },
  { id: '8', fifa_code: 'SUI', group: 'B', flag_emoji: '🇨🇭', flag_url: 'https://flagcdn.com/w80/ch.png', wikipedia_slug: 'Switzerland_national_football_team' },
  // Group C
  { id: '9', fifa_code: 'BRA', group: 'C', flag_emoji: '🇧🇷', flag_url: 'https://flagcdn.com/w80/br.png', wikipedia_slug: 'Brazil_national_football_team' },
  { id: '10', fifa_code: 'MAR', group: 'C', flag_emoji: '🇲🇦', flag_url: 'https://flagcdn.com/w80/ma.png', wikipedia_slug: 'Morocco_national_football_team' },
  { id: '11', fifa_code: 'HAI', group: 'C', flag_emoji: '🇭🇹', flag_url: 'https://flagcdn.com/w80/ht.png', wikipedia_slug: 'Haiti_national_football_team' },
  { id: '12', fifa_code: 'SCO', group: 'C', flag_emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flag_url: 'https://flagcdn.com/w80/gb-sct.png', wikipedia_slug: 'Scotland_national_football_team' },
  // Group D
  { id: '13', fifa_code: 'USA', group: 'D', flag_emoji: '🇺🇸', flag_url: 'https://flagcdn.com/w80/us.png', wikipedia_slug: 'United_States_men%27s_national_soccer_team' },
  { id: '14', fifa_code: 'PAR', group: 'D', flag_emoji: '🇵🇾', flag_url: 'https://flagcdn.com/w80/py.png', wikipedia_slug: 'Paraguay_national_football_team' },
  { id: '15', fifa_code: 'AUS', group: 'D', flag_emoji: '🇦🇺', flag_url: 'https://flagcdn.com/w80/au.png', wikipedia_slug: 'Australia_national_soccer_team' },
  { id: '16', fifa_code: 'TUR', group: 'D', flag_emoji: '🇹🇷', flag_url: 'https://flagcdn.com/w80/tr.png', wikipedia_slug: 'Turkey_national_football_team' },
  // Group E
  { id: '17', fifa_code: 'GER', group: 'E', flag_emoji: '🇩🇪', flag_url: 'https://flagcdn.com/w80/de.png', wikipedia_slug: 'Germany_national_football_team' },
  { id: '18', fifa_code: 'CUW', group: 'E', flag_emoji: '🇨🇼', flag_url: 'https://flagcdn.com/w80/cw.png', wikipedia_slug: 'Curaçao_national_football_team' },
  { id: '19', fifa_code: 'CIV', group: 'E', flag_emoji: '🇨🇮', flag_url: 'https://flagcdn.com/w80/ci.png', wikipedia_slug: 'Ivory_Coast_national_football_team' },
  { id: '20', fifa_code: 'ECU', group: 'E', flag_emoji: '🇪🇨', flag_url: 'https://flagcdn.com/w80/ec.png', wikipedia_slug: 'Ecuador_national_football_team' },
  // Group F
  { id: '21', fifa_code: 'NED', group: 'F', flag_emoji: '🇳🇱', flag_url: 'https://flagcdn.com/w80/nl.png', wikipedia_slug: 'Netherlands_national_football_team' },
  { id: '22', fifa_code: 'JPN', group: 'F', flag_emoji: '🇯🇵', flag_url: 'https://flagcdn.com/w80/jp.png', wikipedia_slug: 'Japan_national_football_team' },
  { id: '23', fifa_code: 'SWE', group: 'F', flag_emoji: '🇸🇪', flag_url: 'https://flagcdn.com/w80/se.png', wikipedia_slug: 'Sweden_national_football_team' },
  { id: '24', fifa_code: 'TUN', group: 'F', flag_emoji: '🇹🇳', flag_url: 'https://flagcdn.com/w80/tn.png', wikipedia_slug: 'Tunisia_national_football_team' },
  // Group G
  { id: '25', fifa_code: 'BEL', group: 'G', flag_emoji: '🇧🇪', flag_url: 'https://flagcdn.com/w80/be.png', wikipedia_slug: 'Belgium_national_football_team' },
  { id: '26', fifa_code: 'EGY', group: 'G', flag_emoji: '🇪🇬', flag_url: 'https://flagcdn.com/w80/eg.png', wikipedia_slug: 'Egypt_national_football_team' },
  { id: '27', fifa_code: 'IRN', group: 'G', flag_emoji: '🇮🇷', flag_url: 'https://flagcdn.com/w80/ir.png', wikipedia_slug: 'Iran_national_football_team' },
  { id: '28', fifa_code: 'NZL', group: 'G', flag_emoji: '🇳🇿', flag_url: 'https://flagcdn.com/w80/nz.png', wikipedia_slug: 'New_Zealand_national_football_team' },
  // Group H
  { id: '29', fifa_code: 'ESP', group: 'H', flag_emoji: '🇪🇸', flag_url: 'https://flagcdn.com/w80/es.png', wikipedia_slug: 'Spain_national_football_team' },
  { id: '30', fifa_code: 'CPV', group: 'H', flag_emoji: '🇨🇻', flag_url: 'https://flagcdn.com/w80/cv.png', wikipedia_slug: 'Cape_Verde_national_football_team' },
  { id: '31', fifa_code: 'KSA', group: 'H', flag_emoji: '🇸🇦', flag_url: 'https://flagcdn.com/w80/sa.png', wikipedia_slug: 'Saudi_Arabia_national_football_team' },
  { id: '32', fifa_code: 'URU', group: 'H', flag_emoji: '🇺🇾', flag_url: 'https://flagcdn.com/w80/uy.png', wikipedia_slug: 'Uruguay_national_football_team' },
  // Group I
  { id: '33', fifa_code: 'FRA', group: 'I', flag_emoji: '🇫🇷', flag_url: 'https://flagcdn.com/w80/fr.png', wikipedia_slug: 'France_national_football_team' },
  { id: '34', fifa_code: 'SEN', group: 'I', flag_emoji: '🇸🇳', flag_url: 'https://flagcdn.com/w80/sn.png', wikipedia_slug: 'Senegal_national_football_team' },
  { id: '35', fifa_code: 'IRQ', group: 'I', flag_emoji: '🇮🇶', flag_url: 'https://flagcdn.com/w80/iq.png', wikipedia_slug: 'Iraq_national_football_team' },
  { id: '36', fifa_code: 'NOR', group: 'I', flag_emoji: '🇳🇴', flag_url: 'https://flagcdn.com/w80/no.png', wikipedia_slug: 'Norway_national_football_team' },
  // Group J
  { id: '37', fifa_code: 'ARG', group: 'J', flag_emoji: '🇦🇷', flag_url: 'https://flagcdn.com/w80/ar.png', wikipedia_slug: 'Argentina_national_football_team' },
  { id: '38', fifa_code: 'ALG', group: 'J', flag_emoji: '🇩🇿', flag_url: 'https://flagcdn.com/w80/dz.png', wikipedia_slug: 'Algeria_national_football_team' },
  { id: '39', fifa_code: 'AUT', group: 'J', flag_emoji: '🇦🇹', flag_url: 'https://flagcdn.com/w80/at.png', wikipedia_slug: 'Austria_national_football_team' },
  { id: '40', fifa_code: 'JOR', group: 'J', flag_emoji: '🇯🇴', flag_url: 'https://flagcdn.com/w80/jo.png', wikipedia_slug: 'Jordan_national_football_team' },
  // Group K
  { id: '41', fifa_code: 'POR', group: 'K', flag_emoji: '🇵🇹', flag_url: 'https://flagcdn.com/w80/pt.png', wikipedia_slug: 'Portugal_national_football_team' },
  { id: '42', fifa_code: 'COD', group: 'K', flag_emoji: '🇨🇩', flag_url: 'https://flagcdn.com/w80/cd.png', wikipedia_slug: 'DR_Congo_national_football_team' },
  { id: '43', fifa_code: 'UZB', group: 'K', flag_emoji: '🇺🇿', flag_url: 'https://flagcdn.com/w80/uz.png', wikipedia_slug: 'Uzbekistan_national_football_team' },
  { id: '44', fifa_code: 'COL', group: 'K', flag_emoji: '🇨🇴', flag_url: 'https://flagcdn.com/w80/co.png', wikipedia_slug: 'Colombia_national_football_team' },
  // Group L
  { id: '45', fifa_code: 'ENG', group: 'L', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag_url: 'https://flagcdn.com/w80/gb-eng.png', wikipedia_slug: 'England_national_football_team' },
  { id: '46', fifa_code: 'CRO', group: 'L', flag_emoji: '🇭🇷', flag_url: 'https://flagcdn.com/w80/hr.png', wikipedia_slug: 'Croatia_national_football_team' },
  { id: '47', fifa_code: 'GHA', group: 'L', flag_emoji: '🇬🇭', flag_url: 'https://flagcdn.com/w80/gh.png', wikipedia_slug: 'Ghana_national_football_team' },
  { id: '48', fifa_code: 'PAN', group: 'L', flag_emoji: '🇵🇦', flag_url: 'https://flagcdn.com/w80/pa.png', wikipedia_slug: 'Panama_national_football_team' },
]

export const TEAMS_BY_ID = Object.fromEntries(TEAMS.map(t => [t.id, t]))
export const TEAMS_BY_FIFA_CODE = Object.fromEntries(TEAMS.map(t => [t.fifa_code, t]))
export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

export function getTeamName(id: string | undefined, lang: Language): string {
  if (!id) return ''
  return (lang === 'he' ? TEAM_NAMES_HE : TEAM_NAMES_EN)[id] ?? id
}
