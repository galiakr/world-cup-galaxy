import { Match, TopScorer } from '@/types'
import { TEAMS_BY_FIFA_CODE } from '@/data/teams'

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
      const homeCode = String(r.home_team_code ?? r.home ?? '').toUpperCase()
      const awayCode = String(r.away_team_code ?? r.away ?? '').toUpperCase()
      const dateStr  = String(r.date ?? r.match_date ?? r.kickoff ?? '').split('T')[0]
      const kickoff  = String(r.kickoff_utc ?? r.date ?? r.kickoff ?? '')
      const scoreHome = r.home_score != null ? Number(r.home_score) : null
      const scoreAway = r.away_score != null ? Number(r.away_score) : null
      const status: Match['status'] =
        r.status === 'finished' || r.finished === true ? 'finished' :
        r.status === 'live'                            ? 'live'      : 'scheduled'

      return {
        id:           String(r.id ?? r._id ?? Math.random()),
        match_number: Number(r.match_number ?? r.num ?? 0),
        home_team_id: homeCode,
        away_team_id: awayCode,
        home_team:    TEAMS_BY_FIFA_CODE[homeCode] ?? { name_en: homeCode, name_he: homeCode, flag_emoji: '🏳️', flag_url: '' },
        away_team:    TEAMS_BY_FIFA_CODE[awayCode] ?? { name_en: awayCode, name_he: awayCode, flag_emoji: '🏳️', flag_url: '' },
        home_score:   scoreHome,
        away_score:   scoreAway,
        status,
        round:        mapRound(String(r.round ?? r.stage ?? 'group')),
        group_name:   r.group ? String(r.group) : undefined,
        match_date:   dateStr,
        kick_off_utc: kickoff,
        stadium_id:   String(r.stadium ?? r.venue ?? ''),
      }
    })

    setCache(cacheKey, matches, 15 * 60 * 1000)
    return matches
  } catch (e) {
    console.error('fetchMatches error:', e)
    return []
  }
}

function mapRound(r: string): Match['round'] {
  const s = r.toLowerCase()
  if (s.includes('group'))  return 'group'
  if (s.includes('32'))     return 'round_of_32'
  if (s.includes('16'))     return 'round_of_16'
  if (s.includes('quarter'))return 'quarter'
  if (s.includes('semi'))   return 'semi'
  if (s.includes('third'))  return 'third_place'
  if (s.includes('final'))  return 'final'
  return 'group'
}

// ─── football-data.org ─────────────────────────────────────────────────────

export async function fetchSquad(teamCode: string): Promise<{ name: string; position: string; jersey: number }[]> {
  const cacheKey = `squad_${teamCode}`
  const cached = getCache<{ name: string; position: string; jersey: number }[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(`${FDORG_BASE}/competitions/WC/teams`, {
      headers: { 'X-Auth-Token': FDORG_KEY },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return []
    const json = await res.json()
    const team = (json.teams ?? []).find(
      (t: Record<string, unknown>) => String(t.tla ?? '').toUpperCase() === teamCode.toUpperCase()
    )
    if (!team) return []
    const players = (team.squad ?? []).map((p: Record<string, unknown>) => ({
      name:     String(p.name),
      position: String(p.position ?? 'Midfielder'),
      jersey:   Number(p.shirtNumber ?? 0),
    }))
    setCache(cacheKey, players, 86400000)
    return players
  } catch { return [] }
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
    const scorers: TopScorer[] = (json.scorers ?? []).map((s: Record<string, unknown>) => {
      const pl = s.player as Record<string, unknown>
      const tm = s.team   as Record<string, unknown>
      const code = String(tm?.tla ?? '').toUpperCase()
      return {
        player_name: String(pl?.name ?? ''),
        team_id:     code,
        team:        TEAMS_BY_FIFA_CODE[code] ?? {},
        goals:       Number(s.goals  ?? 0),
        assists:     Number(s.assists ?? 0),
      }
    })
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

export function getMatchesByDate(matches: Match[], dateStr: string): Match[] {
  return matches.filter(m => m.match_date === dateStr)
}

export function getYesterdayMatches(matches: Match[]): Match[] {
  const d = new Date(); d.setDate(d.getDate() - 1)
  return getMatchesByDate(matches, d.toISOString().split('T')[0])
}

export function getTodayMatches(matches: Match[]): Match[] {
  return getMatchesByDate(matches, new Date().toISOString().split('T')[0])
}

export function getTomorrowMatches(matches: Match[]): Match[] {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return getMatchesByDate(matches, d.toISOString().split('T')[0])
}

export function getUpcomingMatches(matches: Match[], limit = 20): Match[] {
  const today = new Date().toISOString().split('T')[0]
  return matches
    .filter(m => m.match_date >= today && m.status !== 'finished')
    .sort((a, b) => a.match_date.localeCompare(b.match_date))
    .slice(0, limit)
}

export function getPastMatches(matches: Match[]): Match[] {
  const today = new Date().toISOString().split('T')[0]
  return matches
    .filter(m => m.match_date < today || m.status === 'finished')
    .sort((a, b) => b.match_date.localeCompare(a.match_date))
}
