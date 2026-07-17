import { GoalEvent, Match, TopScorer } from '@/types'
import { TEAMS_BY_ID, TEAMS_BY_FIFA_CODE, getTeamName } from '@/data/teams'
import { israelDateString } from '@/lib/date'
import { supabase } from '@/lib/supabase'

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

// worldcup26.ir is a free hobby API that's frequently flaky (hangs or
// 500s) — each Vercel route is its own serverless function with its own
// cold in-memory cache, so every page independently rolls the dice
// against it. Retry several times with a per-attempt timeout so one bad
// attempt doesn't sink the whole page.
//
// The timeout needs to be generous: Vercel's build/runtime network path
// to this host (observed from iad1) is noticeably slower than a typical
// local connection, and a build log once showed every attempt failing
// with AbortError — our own timeout firing before the request even got
// a response, not the API actually being down. 2s was too tight; 5s
// gives real responses time to land while still bailing on a truly dead
// connection well under Vercel's function duration limit.
async function fetchWithRetry(url: string, init: RequestInit, attempts = 3, timeoutMs = 5000): Promise<Response> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { ...init, signal: controller.signal })
      if (res.ok) return res
      lastErr = new Error(`status ${res.status}`)
    } catch (e) {
      lastErr = e
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr
}

// ─── Archive mode ──────────────────────────────────────────────────────────
// After the tournament, the upstream APIs will die or archive their data
// (worldcup26.ir is a hobby project; football-data.org rotates seasons).
// `npm run snapshot-archive` freezes the final state of everything into
// src/data/archive/*.json, and past the cutoff date the fetchers serve
// those files directly — no flaky-API retries, no Supabase dependency.
// WC_ARCHIVE_MODE=1 forces it on (for testing), =0 forces it off.

const ARCHIVE_CUTOFF_DATE = '2026-07-26' // a week after the July 19 final

export function isArchiveMode(): boolean {
  if (process.env.WC_ARCHIVE_MODE === '1') return true
  if (process.env.WC_ARCHIVE_MODE === '0') return false
  return israelDateString() >= ARCHIVE_CUTOFF_DATE
}

// Dynamic imports so the archive JSON is code-split out of pages that
// never enter archive mode (and out of the client bundle entirely).
// Each loader returns null when the snapshot hasn't been generated yet,
// letting callers fall through to the live path.
async function loadArchivedMatches(): Promise<{ updatedAt: string; matches: Match[] } | null> {
  try {
    const mod = await import('@/data/archive/matches.json')
    return (mod.default ?? mod) as unknown as { updatedAt: string; matches: Match[] }
  } catch { return null }
}

async function loadArchivedScorers(): Promise<TopScorer[] | null> {
  try {
    const mod = await import('@/data/archive/scorers.json')
    return ((mod.default ?? mod) as unknown as { scorers: TopScorer[] }).scorers
  } catch { return null }
}

async function loadArchivedSquads(): Promise<Record<string, SquadResult> | null> {
  try {
    const mod = await import('@/data/archive/squads.json')
    return ((mod.default ?? mod) as unknown as { squads: Record<string, SquadResult> }).squads
  } catch { return null }
}

// ─── Matches ───────────────────────────────────────────────────────────────

export interface MatchesResult {
  matches: Match[]
  stale: boolean        // true when served from the Supabase fallback snapshot
  updatedAt: string | null    // when the data itself was last successfully refreshed
  attemptedAt: string         // when this fetch was last actually attempted (success or fail)
}

export async function fetchMatches(): Promise<MatchesResult> {
  const cacheKey = 'wc_matches'
  const cached = getCache<MatchesResult>(cacheKey)
  if (cached) return cached

  const attemptedAt = new Date().toISOString()

  if (isArchiveMode()) {
    const archive = await loadArchivedMatches()
    if (archive) {
      const result: MatchesResult = { matches: archive.matches, stale: false, updatedAt: archive.updatedAt, attemptedAt }
      setCache(cacheKey, result, 24 * 60 * 60 * 1000)
      return result
    }
    // No snapshot generated yet — fall through to the live path.
  }

  try {
    const res = await fetchWithRetry(`${WC_BASE}/get/games`, {
      next: { revalidate: 120 }, // 2-min cache — short enough for live scores to feel current
    })
    const json = await res.json()

    const raw: unknown[] = Array.isArray(json) ? json : (json.data ?? json.games ?? [])
    const detailsMap = await fetchMatchDetailsMap()

    const matches: Match[] = raw.map((m: unknown) => {
      const r = m as Record<string, unknown>
      const homeId = String(r.home_team_id ?? r.home ?? '')
      const awayId = String(r.away_team_id ?? r.away ?? '')
      const stadiumId = String(r.stadium_id ?? r.stadium ?? r.venue ?? '')
      const { date: dateStr, iso: kickoff } = parseLocalDate(String(r.local_date ?? r.date ?? r.match_date ?? r.kickoff ?? ''), stadiumId)
      const scoreHome = parseScore(r.home_score)
      const scoreAway = parseScore(r.away_score)
      const finished = String(r.finished ?? '').toUpperCase() === 'TRUE' || r.finished === true || r.status === 'finished'
      const timeElapsed = String(r.time_elapsed ?? '').toLowerCase()
      // The feed's live flag can flip early (hours before kickoff, seen on
      // 2026-07-11) as well as lag behind — accept 'live' only once our own
      // kickoff timestamp has passed. An unparseable kickoff falls back to
      // trusting the feed rather than pinning the match to 'scheduled'.
      const feedSaysLive = r.status === 'live' || (!!timeElapsed && timeElapsed !== 'notstarted')
      const kickoffMs = new Date(kickoff).getTime()
      const kickedOff = Number.isNaN(kickoffMs) || kickoffMs <= Date.now()
      const status: Match['status'] =
        finished                  ? 'finished' :
        feedSaysLive && kickedOff ? 'live' : 'scheduled'

      return {
        id:           String(r.id ?? r._id ?? Math.random()),
        match_number: Number(r.match_number ?? r.matchday ?? r.num ?? 0),
        home_team_id: homeId,
        away_team_id: awayId,
        home_score:   scoreHome,
        away_score:   scoreAway,
        status,
        round:        mapRound(String(r.type ?? r.round ?? r.stage ?? 'group')),
        group_name:   r.group ? String(r.group) : undefined,
        match_date:   dateStr,
        kick_off_utc: kickoff,
        stadium_id:   stadiumId,
        home_scorers: parseScorers(r.home_scorers),
        away_scorers: parseScorers(r.away_scorers),
        home_penalty_score: parsePenaltyScore(r.home_penalty_score),
        away_penalty_score: parsePenaltyScore(r.away_penalty_score),
      }
    })

    fillBracketFromSemis(matches)

    // Attach football-data.org details after the bracket fill, so a
    // final/third-place match whose teams we just derived can still be
    // joined by its FIFA-code pair.
    for (const m of matches) {
      const homeTeam = TEAMS_BY_ID[m.home_team_id]
      const awayTeam = TEAMS_BY_ID[m.away_team_id]
      const details = homeTeam?.fifa_code && awayTeam?.fifa_code
        ? detailsMap[`${homeTeam.fifa_code.toUpperCase()}|${awayTeam.fifa_code.toUpperCase()}`]
        : undefined
      if (!details) continue
      m.referee = details.referee
      m.duration = details.duration
      m.half_time_home = details.half_time_home
      m.half_time_away = details.half_time_away
    }

    // If football-data.org failed outright (empty details map), the
    // matches built above are missing referees / half-time / duration.
    // Re-attach those from the previous snapshot before overwriting it,
    // so one bad football-data.org fetch can't degrade the archive.
    if (Object.keys(detailsMap).length === 0) {
      const prev = await loadMatchesFallback()
      if (prev) {
        const prevById = new Map(prev.matches.map(m => [m.id, m]))
        for (const m of matches) {
          const old = prevById.get(m.id)
          if (!old) continue
          m.referee ??= old.referee
          m.duration ??= old.duration
          m.half_time_home ??= old.half_time_home
          m.half_time_away ??= old.half_time_away
        }
      }
    }

    const updatedAt = new Date().toISOString()
    const result: MatchesResult = { matches, stale: false, updatedAt, attemptedAt }
    setCache(cacheKey, result, 2 * 60 * 1000)
    await saveMatchesFallback(matches, updatedAt)
    return result
  } catch (e) {
    console.error('fetchMatches error:', e)
    const fallback = await loadMatchesFallback()
    if (fallback) return { matches: fallback.matches, stale: true, updatedAt: fallback.updatedAt, attemptedAt }
    throw e
  }
}

// The feed lags on bracket progression: both semifinals finished on
// 2026-07-15, yet on 2026-07-17 the final and third-place rows still had
// team ids of 0 ("None"). Those pairings are deterministic — the final is
// the two semifinal winners, third place the two losers — so fill any
// slot the feed left empty from our own finished semifinal results. Each
// slot keeps the feed's convention of home = first semifinal's team.
function matchWinnerId(m: Match): string | null {
  if (m.status !== 'finished') return null
  if (m.home_penalty_score != null && m.away_penalty_score != null && m.home_penalty_score !== m.away_penalty_score) {
    return m.home_penalty_score > m.away_penalty_score ? m.home_team_id : m.away_team_id
  }
  if (m.home_score == null || m.away_score == null || m.home_score === m.away_score) return null
  return m.home_score > m.away_score ? m.home_team_id : m.away_team_id
}

function matchLoserId(m: Match): string | null {
  const winner = matchWinnerId(m)
  if (winner === null) return null
  return winner === m.home_team_id ? m.away_team_id : m.home_team_id
}

function fillBracketFromSemis(matches: Match[]) {
  const semis = matches.filter(m => m.round === 'semi').sort(byKickoffAsc)
  if (semis.length !== 2) return
  for (const m of matches) {
    const pick = m.round === 'final' ? matchWinnerId : m.round === 'third_place' ? matchLoserId : null
    if (!pick) continue
    if (!TEAMS_BY_ID[m.home_team_id]) m.home_team_id = pick(semis[0]) ?? m.home_team_id
    if (!TEAMS_BY_ID[m.away_team_id]) m.away_team_id = pick(semis[1]) ?? m.away_team_id
  }
}

// Last-known-good snapshot, used only when the live feed is unreachable
// after retries — real (if slightly stale) data instead of nothing.
async function saveMatchesFallback(matches: Match[], updatedAt: string) {
  try {
    await supabase.from('matches_cache').upsert({ id: 'latest', data: matches, updated_at: updatedAt })
  } catch {
    // best-effort only — losing this write just means the next outage
    // falls back to an older snapshot (or none), not a user-facing error
  }
}

async function loadMatchesFallback(): Promise<{ matches: Match[]; updatedAt: string } | null> {
  try {
    const { data, error } = await supabase.from('matches_cache').select('data, updated_at').eq('id', 'latest').single()
    if (error || !data) return null
    return { matches: data.data as Match[], updatedAt: data.updated_at as string }
  } catch {
    return null
  }
}

// Same persistence pattern as matches_cache — survives restarts/cache
// expiry, and saves re-doing the (slow, multi-request) Wikipedia
// lookups every time the in-memory cache turns over.
async function saveScorersFallback(scorers: TopScorer[]) {
  try {
    await supabase.from('scorers_cache').upsert({ id: 'latest', data: scorers, updated_at: new Date().toISOString() })
  } catch {
    // best-effort only
  }
}

async function loadScorersFallback(): Promise<TopScorer[]> {
  try {
    const { data, error } = await supabase.from('scorers_cache').select('data').eq('id', 'latest').single()
    if (error || !data) return []
    return data.data as TopScorer[]
  } catch {
    return []
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

// Penalty scores are only present when a shootout happened — absent means
// no penalties were taken, which is different from "0 scored".
function parsePenaltyScore(v: unknown): number | null {
  if (v == null) return null
  const s = String(v)
  if (s === 'null' || s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

// worldcup26.ir sends goal scorers as a Postgres-array-literal string, e.g.
// {"J. Quiñones 9'","R. Jiménez 67'"} — some entries use curly “smart quotes”
// instead of escaped straight quotes, so we match either quote style.
function parseScorers(v: unknown): GoalEvent[] {
  if (typeof v !== 'string' || v === 'null') return []
  // Quote direction is inconsistent upstream (some entries use a closing
  // curly quote “”/”” on both sides), so accept any quote char as either
  // delimiter rather than requiring a matched open/close pair.
  const entries = v.match(/["“”]([^"“”]+)["“”]/g) ?? []
  return entries.map(raw => {
    const text = raw.slice(1, -1)
    const own_goal = /\(OG\)/i.test(text)
    const clean = text.replace(/\(OG\)/i, '').trim()
    const m = clean.match(/^(.*?)\s+(\d+(?:\+\d+)?)'$/)
    return m
      ? { scorer: m[1].trim(), minute: m[2], own_goal }
      : { scorer: clean, minute: '', own_goal }
  })
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
  crest: string | null        // federation emblem (SVG/PNG URL)
  clubColors: string | null   // e.g. "Sky Blue / White / Black"
  founded: number | null      // federation founding year
  players: {
    name: string
    position: string
    jersey: number
    photo_url?: string
    date_of_birth?: string    // ISO date
    nationality?: string      // only when it differs from the team's country
  }[]
}

// Country names differ in form across sources ("Bosnia-Herzegovina" vs
// "Bosnia and Herzegovina", "Czech Republic" vs "Czechia") — compare as
// word sets, ignoring punctuation and "and", so those still count as
// the same country.
function sameCountry(a: string, b: string): boolean {
  const words = (s: string) =>
    new Set(s.toLowerCase().split(/[^a-z]+/).filter(w => w && w !== 'and'))
  const wa = words(a)
  const wb = words(b)
  return wa.size === wb.size && [...wa].every(w => wb.has(w))
}

export async function fetchSquad(teamCode: string): Promise<SquadResult> {
  const cacheKey = `squad_${teamCode}`
  const cached = getCache<SquadResult>(cacheKey)
  if (cached) return cached

  const empty: SquadResult = { coachName: null, crest: null, clubColors: null, founded: null, players: [] }

  if (isArchiveMode()) {
    const squads = await loadArchivedSquads()
    const archived = squads?.[teamCode.toUpperCase()]
    if (archived) {
      setCache(cacheKey, archived, 24 * 60 * 60 * 1000)
      return archived
    }
  }

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

    // Nationality is only interesting when it differs from the team's
    // country (naturalized players) — a whole squad repeating its own
    // country is noise. The sources spell countries differently, so a
    // nationality is "the team's own" if it matches any of: the
    // football-data.org team name, the FIFA code, or our English name.
    const ownCountryNames = [
      String(team.name ?? ''),
      teamCode,
      getTeamName(TEAMS_BY_FIFA_CODE[teamCode.toUpperCase()]?.id, 'en'),
    ].filter(Boolean)

    const players = await Promise.all((team.squad ?? []).map(async (p: Record<string, unknown>) => {
      const name = String(p.name)
      const nationality = p.nationality ? String(p.nationality) : undefined
      return {
        name,
        position:  normalizePosition(String(p.position ?? 'Midfielder')),
        jersey:    Number(p.shirtNumber ?? 0),
        photo_url: (await fetchWikipediaPhoto(name)) ?? undefined,
        date_of_birth: p.dateOfBirth ? String(p.dateOfBirth) : undefined,
        nationality: nationality && !ownCountryNames.some(c => sameCountry(nationality, c))
          ? nationality
          : undefined,
      }
    }))
    const coach = team.coach as Record<string, unknown> | undefined
    const result: SquadResult = {
      coachName:  coach?.name ? String(coach.name) : null,
      crest:      team.crest ? String(team.crest) : null,
      clubColors: team.clubColors ? String(team.clubColors) : null,
      founded:    Number(team.founded) || null,
      players,
    }
    setCache(cacheKey, result, 86400000)
    return result
  } catch { return empty }
}

// football-data.org only assigns referees once a match is played/imminent
// (roughly a quarter of matches at any given time), and doesn't share match
// IDs with the worldcup26.ir feed — so matches are joined by FIFA team-code
// pair instead (team *names* differ between the two sources, e.g. "Czechia"
// vs "Czech Republic", but the 3-letter codes match).
interface MatchDetails {
  referee?: string
  duration?: Match['duration']
  half_time_home?: number
  half_time_away?: number
}

const DURATION_MAP: Record<string, Match['duration']> = {
  REGULAR: 'regular',
  EXTRA_TIME: 'extra_time',
  PENALTY_SHOOTOUT: 'penalty_shootout',
}

async function fetchMatchDetailsMap(): Promise<Record<string, MatchDetails>> {
  const cacheKey = 'wc_match_details'
  const cached = getCache<Record<string, MatchDetails>>(cacheKey)
  if (cached) return cached

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const res = await fetch(`${FDORG_BASE}/competitions/WC/matches`, {
      headers: { 'X-Auth-Token': FDORG_KEY },
      next: { revalidate: 3600 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timer))
    if (!res.ok) return {}
    const json = await res.json()
    const map: Record<string, MatchDetails> = {}
    for (const m of (json.matches ?? []) as Record<string, unknown>[]) {
      const homeTla = (m.homeTeam as Record<string, unknown>)?.tla
      const awayTla = (m.awayTeam as Record<string, unknown>)?.tla
      if (!homeTla || !awayTla) continue

      const details: MatchDetails = {}
      const referees = (m.referees ?? []) as Record<string, unknown>[]
      const referee = referees.find(r => r.type === 'REFEREE')
      if (referee) details.referee = String(referee.name)

      const score = m.score as Record<string, unknown> | undefined
      if (m.status === 'FINISHED' && score) {
        details.duration = DURATION_MAP[String(score.duration)]
        const ht = score.halfTime as Record<string, unknown> | undefined
        if (typeof ht?.home === 'number' && typeof ht?.away === 'number') {
          details.half_time_home = ht.home
          details.half_time_away = ht.away
        }
      }

      if (Object.keys(details).length === 0) continue
      map[`${String(homeTla).toUpperCase()}|${String(awayTla).toUpperCase()}`] = details
    }
    setCache(cacheKey, map, 3600000)
    return map
  } catch { return {} }
}

export async function fetchTopScorers(): Promise<TopScorer[]> {
  const cacheKey = 'scorers'
  const cached = getCache<TopScorer[]>(cacheKey)
  if (cached) return cached

  if (isArchiveMode()) {
    const archived = await loadArchivedScorers()
    if (archived) {
      setCache(cacheKey, archived, 24 * 60 * 60 * 1000)
      return archived
    }
  }

  // Every scorer the API knows (~170 once the group stage is done), but
  // Wikipedia enrichment (photo + facts, ~3 requests per player) only for
  // the top of the list — enriching a hundred one-goal scorers would mean
  // 500+ Wikipedia calls per cache refresh for rows almost nobody expands.
  const WIKI_ENRICH_LIMIT = 20

  try {
    const res = await fetch(`${FDORG_BASE}/competitions/WC/scorers?limit=200`, {
      headers: { 'X-Auth-Token': FDORG_KEY },
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`scorers fetch: ${res.status}`)
    const json = await res.json()
    const scorers: TopScorer[] = (json.scorers ?? []).map((s: Record<string, unknown>) => {
      const pl = s.player as Record<string, unknown>
      const tm = s.team   as Record<string, unknown>
      return {
        player_name:  String(pl?.name ?? ''),
        team_id:      String(tm?.tla ?? '').toUpperCase(),
        goals:        Number(s.goals  ?? 0),
        assists:      Number(s.assists ?? 0),
        played_matches: Number(s.playedMatches) || undefined,
      }
    })

    // Enrich in small batches, not one burst — ~3 Wikipedia requests per
    // player, and firing them all at once gets throttled, which used to
    // silently drop photos and Hebrew names.
    const BATCH = 5
    const toEnrich = scorers.filter(s => s.player_name).slice(0, WIKI_ENRICH_LIMIT)
    for (let start = 0; start < toEnrich.length; start += BATCH) {
      await Promise.all(toEnrich.slice(start, start + BATCH).map(async (scorer) => {
        const [summary, heResult] = await Promise.all([
          fetchWikipediaSummary(scorer.player_name),
          fetchHebrewFact(scorer.player_name),
        ])
        scorer.photo_url   = summary.photo_url ?? undefined
        scorer.fact_en     = summary.fact ?? undefined
        scorer.wiki_url    = summary.page_url ?? undefined
        scorer.fact_he     = heResult.fact ?? undefined
        scorer.wiki_url_he = heResult.url ?? undefined
        scorer.name_he     = heResult.name ?? undefined
      }))
    }
    setCache(cacheKey, scorers, 3600000)
    await saveScorersFallback(scorers)
    return scorers
  } catch (e) {
    console.error('fetchTopScorers error:', e)
    return await loadScorersFallback()
  }
}

// ─── Wikipedia Commons ─────────────────────────────────────────────────────

interface WikiSummary {
  photo_url: string | null
  fact: string | null   // first ~2 sentences of the page extract, as a quick "fun fact"
  page_url: string | null
}

function firstSentences(text: string, count: number): string {
  const parts = text.split(/(?<=[.!?])\s+/).slice(0, count)
  return parts.join(' ').trim()
}

async function fetchWikipediaSummary(slug: string): Promise<WikiSummary> {
  const cacheKey = `wikisum_${slug}`
  const cached = getCache<WikiSummary>(cacheKey)
  if (cached) return cached

  const empty: WikiSummary = { photo_url: null, fact: null, page_url: null }
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      { next: { revalidate: 86400 } }
    )
    // Only a 404 ("no such article") is worth remembering for 24h — a
    // 429/5xx is transient, and caching it would blank photos and facts
    // until the cache turns over.
    if (res.status === 404) { setCache(cacheKey, empty, 86400000); return empty }
    if (!res.ok) return empty
    const json = await res.json()
    // Common names (e.g. "Ma Ning") often resolve to a disambiguation page
    // listing unrelated people instead of a real bio — that's worse than
    // having no fact at all, so treat it the same as "not found".
    const isDisambiguation = json.type === 'disambiguation'
    const result: WikiSummary = {
      photo_url: !isDisambiguation ? (json.thumbnail?.source ?? json.originalimage?.source ?? null) : null,
      fact: !isDisambiguation && typeof json.extract === 'string' && json.extract ? firstSentences(json.extract, 2) : null,
      page_url: !isDisambiguation ? (json.content_urls?.desktop?.page ?? null) : null,
    }
    setCache(cacheKey, result, 86400000)
    return result
  } catch { return empty }
}

export async function fetchWikipediaPhoto(slug: string): Promise<string | null> {
  return (await fetchWikipediaSummary(slug)).photo_url
}

// Wikipedia doesn't auto-translate — but most well-known players have a
// real, natively-written Hebrew article. langlinks finds that article's
// actual title (which is rarely a direct translation of the English
// slug), then we fetch ITS summary from he.wikipedia.org. Returns null
// when no Hebrew article exists, rather than falling back to a machine
// translation of the English text.
// getCache() returns null for both "cache miss" and "cached null value" — we
// can't use null in the cache to mean "no Hebrew article exists". Use a sentinel
// string so the two cases are distinguishable, avoiding repeated Wikipedia calls.
// The cache stores a JSON string: either the sentinel or { fact, url }.
const HE_CACHE_MISS = '__no_he__'
async function fetchHebrewFact(enSlug: string): Promise<{ fact: string | null; url: string | null; name: string | null }> {
  const cacheKey = `wikihe_${enSlug}`
  const cached = getCache<string>(cacheKey)
  if (cached === HE_CACHE_MISS) return { fact: null, url: null, name: null }
  if (cached !== null) {
    try { return JSON.parse(cached) as { fact: string; url: string; name: string } } catch { /* re-fetch */ }
  }

  try {
    const linkRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(enSlug)}&prop=langlinks&lllang=he&format=json&origin=*&redirects=1`,
      { next: { revalidate: 86400 } }
    )
    // Transient failure (rate limit, outage) — don't cache the miss
    // sentinel, or one throttled burst hides Hebrew names for 24 hours.
    if (!linkRes.ok) return { fact: null, url: null, name: null }
    const linkJson = await linkRes.json()
    const pages = Object.values(linkJson.query?.pages ?? {}) as Record<string, unknown>[]
    const heTitle = (pages[0]?.langlinks as Record<string, unknown>[] | undefined)?.[0]?.['*']
    if (typeof heTitle !== 'string') { setCache(cacheKey, HE_CACHE_MISS, 86400000); return { fact: null, url: null, name: null } }

    const heUrl = `https://he.wikipedia.org/wiki/${encodeURIComponent(heTitle)}`
    const sumRes = await fetch(
      `https://he.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(heTitle)}`,
      { next: { revalidate: 86400 } }
    )
    if (sumRes.status === 404) { setCache(cacheKey, HE_CACHE_MISS, 86400000); return { fact: null, url: null, name: null } }
    if (!sumRes.ok) return { fact: null, url: null, name: null }
    const sumJson = await sumRes.json()
    if (sumJson.type === 'disambiguation' || typeof sumJson.extract !== 'string' || !sumJson.extract) {
      setCache(cacheKey, HE_CACHE_MISS, 86400000)
      return { fact: null, url: null, name: null }
    }
    const fact = firstSentences(sumJson.extract, 2)
    setCache(cacheKey, JSON.stringify({ fact, url: heUrl, name: heTitle }), 86400000)
    return { fact, url: heUrl, name: heTitle }
  } catch { return { fact: null, url: null, name: null } }
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
