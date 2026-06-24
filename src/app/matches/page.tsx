import { fetchMatches, getPastMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import { countRefereeMatches } from '@/lib/standings'
import { fetchForecastAtKickoff, fetchCurrentWeather, WeatherInfo } from '@/lib/weather'
import { STADIUMS_BY_ID } from '@/data/stadiums'
import MatchesClient from '@/components/pages/MatchesClient'

// fetchMatches retries against a slow/flaky upstream with a generous
// per-attempt timeout — give Vercel enough function budget for that.
export const maxDuration = 30

// See predict/page.tsx for why this matters: without it, this page is
// its own separately-cached ISR route on top of fetchMatches' fetch
// cache, and can go stale independently of how often other pages get hit.
export const dynamic = 'force-dynamic'

export default async function MatchesPage() {
  let matches: Match[] = []
  let error = false
  let stale = false
  let updatedAt: string | null = null
  let attemptedAt: string = new Date().toISOString()
  try {
    const result = await fetchMatches()
    matches = result.matches
    stale = result.stale
    updatedAt = result.updatedAt
    attemptedAt = result.attemptedAt
  } catch {
    error = true
  }

  const upcomingMatches = getUpcomingMatches(matches, 10)

  // Forecast at kickoff only makes sense for matches not too far out
  // (free tier only covers ~5 days ahead) — fetched here rather than
  // on every match so finished/distant fixtures never trigger a call.
  // A match already underway gets live current weather instead, since
  // its kickoff time is in the past and has no forecast left.
  const matchWeather: Record<string, WeatherInfo | null> = {}
  await Promise.all(
    upcomingMatches.map(async m => {
      const stadium = STADIUMS_BY_ID[m.stadium_id]
      if (!stadium || !m.kick_off_utc) return
      const hasKickedOff = new Date(m.kick_off_utc).getTime() <= Date.now()
      matchWeather[m.id] = hasKickedOff
        ? await fetchCurrentWeather(stadium.lat, stadium.lng)
        : await fetchForecastAtKickoff(stadium.lat, stadium.lng, m.kick_off_utc)
    }),
  )

  return (
    <MatchesClient
      pastMatches={getPastMatches(matches)}
      upcomingMatches={upcomingMatches}
      knockoutMatches={matches.filter(m => m.round !== 'group')}
      matchesError={error}
      matchesStale={stale}
      matchesUpdatedAt={updatedAt}
      matchesAttemptedAt={attemptedAt}
      refereeCounts={countRefereeMatches(matches)}
      matchWeather={matchWeather}
    />
  )
}
