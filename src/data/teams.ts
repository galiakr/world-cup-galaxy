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
  { id: '1', fifa_code: 'MEX', group: 'A', flag_emoji: '🇲🇽', flag_url: 'https://flagcdn.com/w80/mx.png', wikipedia_slug: 'Mexico_national_football_team', lat: 19.4326, lng: -99.1332 },
  { id: '2', fifa_code: 'RSA', group: 'A', flag_emoji: '🇿🇦', flag_url: 'https://flagcdn.com/w80/za.png', wikipedia_slug: 'South_Africa_national_football_team', lat: -25.7461, lng: 28.1881 },
  { id: '3', fifa_code: 'KOR', group: 'A', flag_emoji: '🇰🇷', flag_url: 'https://flagcdn.com/w80/kr.png', wikipedia_slug: 'South_Korea_national_football_team', lat: 37.5665, lng: 126.9780 },
  { id: '4', fifa_code: 'CZE', group: 'A', flag_emoji: '🇨🇿', flag_url: 'https://flagcdn.com/w80/cz.png', wikipedia_slug: 'Czech_Republic_national_football_team', lat: 50.0755, lng: 14.4378 },
  // Group B
  { id: '5', fifa_code: 'CAN', group: 'B', flag_emoji: '🇨🇦', flag_url: 'https://flagcdn.com/w80/ca.png', wikipedia_slug: 'Canada_national_soccer_team', lat: 45.4215, lng: -75.6972 },
  { id: '6', fifa_code: 'BIH', group: 'B', flag_emoji: '🇧🇦', flag_url: 'https://flagcdn.com/w80/ba.png', wikipedia_slug: 'Bosnia_and_Herzegovina_national_football_team', lat: 43.8563, lng: 18.4131 },
  { id: '7', fifa_code: 'QAT', group: 'B', flag_emoji: '🇶🇦', flag_url: 'https://flagcdn.com/w80/qa.png', wikipedia_slug: 'Qatar_national_football_team', lat: 25.2854, lng: 51.5310 },
  { id: '8', fifa_code: 'SUI', group: 'B', flag_emoji: '🇨🇭', flag_url: 'https://flagcdn.com/w80/ch.png', wikipedia_slug: 'Switzerland_national_football_team', lat: 46.9480, lng: 7.4474 },
  // Group C
  { id: '9', fifa_code: 'BRA', group: 'C', flag_emoji: '🇧🇷', flag_url: 'https://flagcdn.com/w80/br.png', wikipedia_slug: 'Brazil_national_football_team', lat: -15.7939, lng: -47.8828 },
  { id: '10', fifa_code: 'MAR', group: 'C', flag_emoji: '🇲🇦', flag_url: 'https://flagcdn.com/w80/ma.png', wikipedia_slug: 'Morocco_national_football_team', lat: 34.0209, lng: -6.8416 },
  { id: '11', fifa_code: 'HAI', group: 'C', flag_emoji: '🇭🇹', flag_url: 'https://flagcdn.com/w80/ht.png', wikipedia_slug: 'Haiti_national_football_team', lat: 18.5944, lng: -72.3074 },
  { id: '12', fifa_code: 'SCO', group: 'C', flag_emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flag_url: 'https://flagcdn.com/w80/gb-sct.png', wikipedia_slug: 'Scotland_national_football_team', lat: 55.9533, lng: -3.1883 },
  // Group D
  { id: '13', fifa_code: 'USA', group: 'D', flag_emoji: '🇺🇸', flag_url: 'https://flagcdn.com/w80/us.png', wikipedia_slug: 'United_States_men%27s_national_soccer_team', lat: 38.9072, lng: -77.0369 },
  { id: '14', fifa_code: 'PAR', group: 'D', flag_emoji: '🇵🇾', flag_url: 'https://flagcdn.com/w80/py.png', wikipedia_slug: 'Paraguay_national_football_team', lat: -25.2637, lng: -57.5759 },
  { id: '15', fifa_code: 'AUS', group: 'D', flag_emoji: '🇦🇺', flag_url: 'https://flagcdn.com/w80/au.png', wikipedia_slug: 'Australia_national_soccer_team', lat: -35.2809, lng: 149.1300 },
  { id: '16', fifa_code: 'TUR', group: 'D', flag_emoji: '🇹🇷', flag_url: 'https://flagcdn.com/w80/tr.png', wikipedia_slug: 'Turkey_national_football_team', lat: 39.9334, lng: 32.8597 },
  // Group E
  { id: '17', fifa_code: 'GER', group: 'E', flag_emoji: '🇩🇪', flag_url: 'https://flagcdn.com/w80/de.png', wikipedia_slug: 'Germany_national_football_team', lat: 52.5200, lng: 13.4050 },
  { id: '18', fifa_code: 'CUW', group: 'E', flag_emoji: '🇨🇼', flag_url: 'https://flagcdn.com/w80/cw.png', wikipedia_slug: 'Curaçao_national_football_team', lat: 12.1224, lng: -68.9343 },
  { id: '19', fifa_code: 'CIV', group: 'E', flag_emoji: '🇨🇮', flag_url: 'https://flagcdn.com/w80/ci.png', wikipedia_slug: 'Ivory_Coast_national_football_team', lat: 6.8276, lng: -5.2893 },
  { id: '20', fifa_code: 'ECU', group: 'E', flag_emoji: '🇪🇨', flag_url: 'https://flagcdn.com/w80/ec.png', wikipedia_slug: 'Ecuador_national_football_team', lat: -0.1807, lng: -78.4678 },
  // Group F
  { id: '21', fifa_code: 'NED', group: 'F', flag_emoji: '🇳🇱', flag_url: 'https://flagcdn.com/w80/nl.png', wikipedia_slug: 'Netherlands_national_football_team', lat: 52.3676, lng: 4.9041 },
  { id: '22', fifa_code: 'JPN', group: 'F', flag_emoji: '🇯🇵', flag_url: 'https://flagcdn.com/w80/jp.png', wikipedia_slug: 'Japan_national_football_team', lat: 35.6762, lng: 139.6503 },
  { id: '23', fifa_code: 'SWE', group: 'F', flag_emoji: '🇸🇪', flag_url: 'https://flagcdn.com/w80/se.png', wikipedia_slug: 'Sweden_national_football_team', lat: 59.3293, lng: 18.0686 },
  { id: '24', fifa_code: 'TUN', group: 'F', flag_emoji: '🇹🇳', flag_url: 'https://flagcdn.com/w80/tn.png', wikipedia_slug: 'Tunisia_national_football_team', lat: 36.8065, lng: 10.1815 },
  // Group G
  { id: '25', fifa_code: 'BEL', group: 'G', flag_emoji: '🇧🇪', flag_url: 'https://flagcdn.com/w80/be.png', wikipedia_slug: 'Belgium_national_football_team', lat: 50.8503, lng: 4.3517 },
  { id: '26', fifa_code: 'EGY', group: 'G', flag_emoji: '🇪🇬', flag_url: 'https://flagcdn.com/w80/eg.png', wikipedia_slug: 'Egypt_national_football_team', lat: 30.0444, lng: 31.2357 },
  { id: '27', fifa_code: 'IRN', group: 'G', flag_emoji: '🇮🇷', flag_url: 'https://flagcdn.com/w80/ir.png', wikipedia_slug: 'Iran_national_football_team', lat: 35.6892, lng: 51.3890 },
  { id: '28', fifa_code: 'NZL', group: 'G', flag_emoji: '🇳🇿', flag_url: 'https://flagcdn.com/w80/nz.png', wikipedia_slug: 'New_Zealand_national_football_team', lat: -41.2865, lng: 174.7762 },
  // Group H
  { id: '29', fifa_code: 'ESP', group: 'H', flag_emoji: '🇪🇸', flag_url: 'https://flagcdn.com/w80/es.png', wikipedia_slug: 'Spain_national_football_team', lat: 40.4168, lng: -3.7038 },
  { id: '30', fifa_code: 'CPV', group: 'H', flag_emoji: '🇨🇻', flag_url: 'https://flagcdn.com/w80/cv.png', wikipedia_slug: 'Cape_Verde_national_football_team', lat: 14.9330, lng: -23.5133 },
  { id: '31', fifa_code: 'KSA', group: 'H', flag_emoji: '🇸🇦', flag_url: 'https://flagcdn.com/w80/sa.png', wikipedia_slug: 'Saudi_Arabia_national_football_team', lat: 24.7136, lng: 46.6753 },
  { id: '32', fifa_code: 'URU', group: 'H', flag_emoji: '🇺🇾', flag_url: 'https://flagcdn.com/w80/uy.png', wikipedia_slug: 'Uruguay_national_football_team', lat: -34.9011, lng: -56.1645 },
  // Group I
  { id: '33', fifa_code: 'FRA', group: 'I', flag_emoji: '🇫🇷', flag_url: 'https://flagcdn.com/w80/fr.png', wikipedia_slug: 'France_national_football_team', lat: 48.8566, lng: 2.3522 },
  { id: '34', fifa_code: 'SEN', group: 'I', flag_emoji: '🇸🇳', flag_url: 'https://flagcdn.com/w80/sn.png', wikipedia_slug: 'Senegal_national_football_team', lat: 14.7167, lng: -17.4677 },
  { id: '35', fifa_code: 'IRQ', group: 'I', flag_emoji: '🇮🇶', flag_url: 'https://flagcdn.com/w80/iq.png', wikipedia_slug: 'Iraq_national_football_team', lat: 33.3152, lng: 44.3661 },
  { id: '36', fifa_code: 'NOR', group: 'I', flag_emoji: '🇳🇴', flag_url: 'https://flagcdn.com/w80/no.png', wikipedia_slug: 'Norway_national_football_team', lat: 59.9139, lng: 10.7522 },
  // Group J
  { id: '37', fifa_code: 'ARG', group: 'J', flag_emoji: '🇦🇷', flag_url: 'https://flagcdn.com/w80/ar.png', wikipedia_slug: 'Argentina_national_football_team', lat: -34.6037, lng: -58.3816 },
  { id: '38', fifa_code: 'ALG', group: 'J', flag_emoji: '🇩🇿', flag_url: 'https://flagcdn.com/w80/dz.png', wikipedia_slug: 'Algeria_national_football_team', lat: 36.7538, lng: 3.0588 },
  { id: '39', fifa_code: 'AUT', group: 'J', flag_emoji: '🇦🇹', flag_url: 'https://flagcdn.com/w80/at.png', wikipedia_slug: 'Austria_national_football_team', lat: 48.2082, lng: 16.3738 },
  { id: '40', fifa_code: 'JOR', group: 'J', flag_emoji: '🇯🇴', flag_url: 'https://flagcdn.com/w80/jo.png', wikipedia_slug: 'Jordan_national_football_team', lat: 31.9454, lng: 35.9284 },
  // Group K
  { id: '41', fifa_code: 'POR', group: 'K', flag_emoji: '🇵🇹', flag_url: 'https://flagcdn.com/w80/pt.png', wikipedia_slug: 'Portugal_national_football_team', lat: 38.7223, lng: -9.1393 },
  { id: '42', fifa_code: 'COD', group: 'K', flag_emoji: '🇨🇩', flag_url: 'https://flagcdn.com/w80/cd.png', wikipedia_slug: 'DR_Congo_national_football_team', lat: -4.4419, lng: 15.2663 },
  { id: '43', fifa_code: 'UZB', group: 'K', flag_emoji: '🇺🇿', flag_url: 'https://flagcdn.com/w80/uz.png', wikipedia_slug: 'Uzbekistan_national_football_team', lat: 41.2995, lng: 69.2401 },
  { id: '44', fifa_code: 'COL', group: 'K', flag_emoji: '🇨🇴', flag_url: 'https://flagcdn.com/w80/co.png', wikipedia_slug: 'Colombia_national_football_team', lat: 4.7110, lng: -74.0721 },
  // Group L
  { id: '45', fifa_code: 'ENG', group: 'L', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag_url: 'https://flagcdn.com/w80/gb-eng.png', wikipedia_slug: 'England_national_football_team', lat: 51.5072, lng: -0.1276 },
  { id: '46', fifa_code: 'CRO', group: 'L', flag_emoji: '🇭🇷', flag_url: 'https://flagcdn.com/w80/hr.png', wikipedia_slug: 'Croatia_national_football_team', lat: 45.8150, lng: 15.9819 },
  { id: '47', fifa_code: 'GHA', group: 'L', flag_emoji: '🇬🇭', flag_url: 'https://flagcdn.com/w80/gh.png', wikipedia_slug: 'Ghana_national_football_team', lat: 5.6037, lng: -0.1870 },
  { id: '48', fifa_code: 'PAN', group: 'L', flag_emoji: '🇵🇦', flag_url: 'https://flagcdn.com/w80/pa.png', wikipedia_slug: 'Panama_national_football_team', lat: 8.9824, lng: -79.5199 },
]

export const TEAMS_BY_ID = Object.fromEntries(TEAMS.map(t => [t.id, t]))
export const TEAMS_BY_FIFA_CODE = Object.fromEntries(TEAMS.map(t => [t.fifa_code, t]))
export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

export function getTeamName(id: string | undefined, lang: Language): string {
  if (!id) return ''
  return (lang === 'he' ? TEAM_NAMES_HE : TEAM_NAMES_EN)[id] ?? id
}
