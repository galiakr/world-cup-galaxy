import { fetchMatches, fetchTopScorers, getTodayMatches, getYesterdayMatches, getTomorrowMatches } from '@/lib/api'
import { Match } from '@/types'
import HomeClient from '@/components/pages/HomeClient'

// fetchMatches retries against a slow/flaky upstream with a generous
// per-attempt timeout — give Vercel enough function budget for that.
export const maxDuration = 30

export default async function HomePage() {
  const [matchesResult, scorers] = await Promise.all([
    fetchMatches()
      .then(r => ({ matches: r.matches, error: false, stale: r.stale, updatedAt: r.updatedAt }))
      .catch(() => ({ matches: [] as Match[], error: true, stale: false, updatedAt: null as string | null })),
    fetchTopScorers(),
  ])

  const { matches, error, stale, updatedAt } = matchesResult
  const todayMatches = getTodayMatches(matches)
  const yesterdayMatches = getYesterdayMatches(matches)
  const tomorrowMatches = getTomorrowMatches(matches)

  return (
    <HomeClient
      todayMatches={todayMatches}
      yesterdayMatches={yesterdayMatches}
      tomorrowMatches={tomorrowMatches}
      topScorers={scorers.slice(0, 5)}
      matchesError={error}
      matchesStale={stale}
      matchesUpdatedAt={updatedAt}
    />
  )
}
