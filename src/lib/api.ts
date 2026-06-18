import { Match, TopScorer } from '@/types'
import { TEAMS_BY_ID, TEAMS_BY_FIFA_CODE } from '@/data/teams'
import { STADIUMS_BY_ID } from '@/data/stadiums'
import { israelDateString } from '@/lib/date'

// ─── rezarahiminia/worldcup2026 (NO API KEY — completely free) ────────────
// https://worldcup26.ir  — all 48 teams, 104 fixtures, live-updated scores
// Used for: all match data

const WC_BASE = 'https://worldcup26.ir'

// ─── football-data.org (free forever, 10 req/min) ─────────────────────────
// Used for: squad rosters, top scorers
const FDORG_BASE = 'https://api.football-data.org/v4'
const FDORG_KEY = process.env.FOOTBALL_DATA_KEY!

// ─── Wikipedia Commons (free, no key) ─────────────────────────────────────
// Used for: team / coach photos

// Simple server-side in-memory cache
const cache = new Map<string, { data: unknown; expires: number }>()
function getCache<T>(key: string): T | null {
  const e = cache.get(key)
  if (!e || Date.now() > e.expires) { cache.delete(key); return null }
  return e.data as T
}
function setCache<T>(key: string, data: T, ttlMs: number) {
  cache.set(key, { data, expires: Date.now() + ttlMs })
}

// ─── Matches ───────────────────────────────────────────────────────────────

export async function fetchMatches(): Promise<Match[]> {
  const cacheKey = 'wc_matches'
  const cached = getCache<Match[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(`${WC_BASE}/get/games`, {
      next: { revalidate: 900 }, // 15-min cache
    })
    if (!res.ok) throw new Error(`fetch games: ${res.status}`)
    const json = await res.json()

    const raw: unknown[] = Array.isArray(json) ? json : (json.data ?? json.games ?? [])

    const matches: Match[] = raw.map((m: unknown) => {
      const r = m as Record<string, unknown>
      const homeId = String(r.home_team_id ?? r.home ?? '')
      const awayId = String(r.away_team_id ?? r.away ?? '')
      const homeNameEn = String(r.home_team_name_en ?? '')
      const awayNameEn = String(r.away_team_name_en ?? '')
      const stadiumId = String(r.stadium_id ?? r.stadium ?? r.venue ?? '')
      const { date: dateStr, iso: kickoff } = parseLocalDate(String(r.local_date ?? r.date ?? r.match_date ?? r.kickoff ?? ''), stadiumId)
      const scoreHome = parseScore(r.home_score)
      const scoreAway = parseScore(r.away_score)
      const finished = String(r.finished ?? '').toUpperCase() === 'TRUE' || r.finished === true || r.status === 'finished'
      const timeElapsed = String(r.time_elapsed ?? '').toLowerCase()
      const status: Match['status'] =
        finished                                                        ? 'finished' :
        r.status === 'live' || (timeElapsed && timeElapsed !== 'notstarted') ? 'live' : 'scheduled'

      return {
        id:           String(r.id ?? r._id ?? Math.random()),
        match_number: Number(r.match_number ?? r.matchday ?? r.num ?? 0),
        home_team_id: homeId,
        away_team_id: awayId,
        home_team:    TEAMS_BY_ID[homeId] ?? { name_en: homeNameEn, name_he: homeNameEn, flag_emoji: '🏳️', flag_url: '' },
        away_team:    TEAMS_BY_ID[awayId] ?? { name_en: awayNameEn, name_he: awayNameEn, flag_emoji: '🏳️', flag_url: '' },
        home_score:   scoreHome,
        away_score:   scoreAway,
        status,
        round:        mapRound(String(r.type ?? r.round ?? r.stage ?? 'group')),
        group_name:   r.group ? String(r.group) : undefined,
        match_date:   dateStr,
        kick_off_utc: kickoff,
        stadium_id:   stadiumId,
        stadium:      STADIUMS_BY_ID[stadiumId],
      }
    })

    setCache(cacheKey, matches, 15 * 60 * 1000)
    return matches
  } catch (e) {
    console.error('fetchMatches error:', e)
    throw e
  }
}

// worldcup26.ir sends scores as strings, but uses the literal string "null"
// (not JSON null) for some not-yet-played matches — Number("null") is NaN,
// which showed up inconsistently next to matches that used "0" instead.
function parseScore(v: unknown): number {
  if (v == null) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function mapRound(r: string): Match['round'] {
  const s = r.toLowerCase()
  if (s.includes('group'))           return 'group'
  if (s === 'r32' || s.includes('32'))     return 'round_of_32'
  if (s === 'r16' || s.includes('16'))     return 'round_of_16'
  if (s === 'qf'  || s.includes('quarter')) return 'quarter'
  if (s === 'sf'  || s.includes('semi'))    return 'semi'
  if (s.includes('third'))           return 'third_place'
  if (s.includes('final'))           return 'final'
  return 'group'
}

// worldcup26.ir's `local_date` is the kickoff in the *stadium's* local wall-clock
// time with no timezone marker. Map each of the 16 host stadiums (from its
// /get/stadiums endpoint) to its real IANA zone so we can convert to a true
// UTC instant — from which every viewer's browser then renders their own
// local time automatically.
const STADIUM_TZ: Record<string, string> = {
  '1': 'America/Mexico_City', '2': 'America/Mexico_City', '3': 'America/Mexico_City', // Mexico City, Guadalajara, Monterrey
  '4': 'America/Chicago', '5': 'America/Chicago', '6': 'America/Chicago',             // Dallas, Houston, Kansas City
  '7': 'America/New_York', '8': 'America/New_York', '9': 'America/New_York',          // Atlanta, Miami, Boston
  '10': 'America/New_York', '11': 'America/New_York',                                 // Philadelphia, New York/New Jersey
  '12': 'America/Toronto',                                                            // Toronto
  '13': 'America/Vancouver',                                                          // Vancouver
  '14': 'America/Los_Angeles', '15': 'America/Los_Angeles', '16': 'America/Los_Angeles', // Seattle, SF Bay Area, LA
}

// Converts a wall-clock time string ("YYYY-MM-DDTHH:mm:00") that represents
// local time in `timeZone` into the equivalent real UTC Date.
function zonedWallTimeToUtc(wallTime: string, timeZone: string): Date {
  const guess = new Date(`${wallTime}Z`)
  const asInZone = new Date(guess.toLocaleString('en-US', { timeZone }))
  const asUtc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }))
  const offsetMs = asUtc.getTime() - asInZone.getTime()
  return new Date(guess.getTime() + offsetMs)
}

// Parses "MM/DD/YYYY HH:mm" (the worldcup26.ir local_date format) into the
// match's Israel-local calendar date and a real UTC kickoff timestamp.
function parseLocalDate(input: string, stadiumId: string): { date: string; iso: string } {
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/)
  if (!match) {
    const fallback = input.split('T')[0]
    return { date: fallback, iso: input }
  }
  const [, mm, dd, yyyy, hh, min] = match
  const wallTime = `${yyyy}-${mm}-${dd}T${hh}:${min}:00`
  const tz = STADIUM_TZ[stadiumId] ?? 'America/New_York'
  const utcDate = zonedWallTimeToUtc(wallTime, tz)
  const israelDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(utcDate)
  return { date: israelDate, iso: utcDate.toISOString() }
}

// ─── football-data.org ─────────────────────────────────────────────────────

function normalizePosition(position: string): string {
  const p = position.toLowerCase()
  if (p.includes('keep')) return 'Goalkeeper'
  if (p.includes('defen')) return 'Defender'
  if (p.includes('mid'))   return 'Midfielder'
  if (p.includes('attack') || p.includes('offen') || p.includes('forward')) return 'Forward'
  return position
}

interface SquadResult {
  coachName: string | null
  players: { name: string; position: string; jersey: number; photo_url?: string }[]
}

export async function fetchSquad(teamCode: string): Promise<SquadResult> {
  const cacheKey = `squad_${teamCode}`
  const cached = getCache<SquadResult>(cacheKey)
  if (cached) return cached

  const empty: SquadResult = { coachName: null, players: [] }
  try {
    const res = await fetch(`${FDORG_BASE}/competitions/WC/teams`, {
      headers: { 'X-Auth-Token': FDORG_KEY },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return empty
    const json = await res.json()
    const team = (json.teams ?? []).find(
      (t: Record<string, unknown>) => String(t.tla ?? '').toUpperCase() === teamCode.toUpperCase()
    )
    if (!team) return empty
    const players = await Promise.all((team.squad ?? []).map(async (p: Record<string, unknown>) => {
      const name = String(p.name)
      return {
        name,
        position:  normalizePosition(String(p.position ?? 'Midfielder')),
        jersey:    Number(p.shirtNumber ?? 0),
        photo_url: (await fetchWikipediaPhoto(name)) ?? undefined,
      }
    }))
    const coach = team.coach as Record<string, unknown> | undefined
    const result: SquadResult = { coachName: coach?.name ? String(coach.name) : null, players }
    setCache(cacheKey, result, 86400000)
    return result
  } catch { return empty }
}

export async function fetchTopScorers(): Promise<TopScorer[]> {
  const cacheKey = 'scorers'
  const cached = getCache<TopScorer[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(`${FDORG_BASE}/competitions/WC/scorers?limit=20`, {
      headers: { 'X-Auth-Token': FDORG_KEY },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    const scorers: TopScorer[] = await Promise.all((json.scorers ?? []).map(async (s: Record<string, unknown>) => {
      const pl = s.player as Record<string, unknown>
      const tm = s.team   as Record<string, unknown>
      const code = String(tm?.tla ?? '').toUpperCase()
      const playerName = String(pl?.name ?? '')
      return {
        player_name: playerName,
        team_id:     code,
        team:        TEAMS_BY_FIFA_CODE[code] ?? {},
        goals:       Number(s.goals  ?? 0),
        assists:     Number(s.assists ?? 0),
        photo_url:   playerName ? (await fetchWikipediaPhoto(playerName)) ?? undefined : undefined,
      }
    }))
    setCache(cacheKey, scorers, 3600000)
    return scorers
  } catch { return [] }
}

// ─── Wikipedia Commons ─────────────────────────────────────────────────────

export async function fetchWikipediaPhoto(slug: string): Promise<string | null> {
  const cacheKey = `wiki_${slug}`
  const cached = getCache<string | null>(cacheKey)
  if (cached !== null) return cached

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) { setCache(cacheKey, null, 86400000); return null }
    const json = await res.json()
    const url = json.thumbnail?.source ?? json.originalimage?.source ?? null
    setCache(cacheKey, url, 86400000)
    return url
  } catch { return null }
}

// ─── Match helpers ─────────────────────────────────────────────────────────

function byKickoffAsc(a: Match, b: Match): number {
  return new Date(a.kick_off_utc).getTime() - new Date(b.kick_off_utc).getTime()
}

export function getMatchesByDate(matches: Match[], dateStr: string): Match[] {
  return matches.filter(m => m.match_date === dateStr).sort(byKickoffAsc)
}


export function getYesterdayMatches(matches: Match[]): Match[] {
  return getMatchesByDate(matches, israelDateString(-1))
}

export function getTodayMatches(matches: Match[]): Match[] {
  return getMatchesByDate(matches, israelDateString(0))
}

export function getTomorrowMatches(matches: Match[]): Match[] {
  return getMatchesByDate(matches, israelDateString(1))
}

export function getUpcomingMatches(matches: Match[], limit = 20): Match[] {
  const today = israelDateString()
  return matches
    .filter(m => m.match_date >= today && m.status !== 'finished')
    .sort(byKickoffAsc)
    .slice(0, limit)
}

export function getPastMatches(matches: Match[]): Match[] {
  const today = israelDateString()
  return matches
    .filter(m => m.match_date < today || m.status === 'finished')
    .sort((a, b) => byKickoffAsc(b, a))
}
