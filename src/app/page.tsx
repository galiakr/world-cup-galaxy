import { fetchMatches, fetchTopScorers, getTodayMatches, getYesterdayMatches, getTomorrowMatches, isArchiveMode } from '@/lib/api'
import { Match } from '@/types'
import { countRefereeMatches } from '@/lib/standings'
import HomeClient from '@/components/pages/HomeClient'

// fetchMatches retries against a slow/flaky upstream with a generous
// per-attempt timeout — give Vercel enough function budget for that.
export const maxDuration = 30

// See predict/page.tsx for why this matters: without it, this page is
// its own separately-cached ISR route on top of fetchMatches' fetch
// cache, and can go stale independently of how often other pages get hit.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [matchesResult, scorers] = await Promise.all([
    fetchMatches()
      .then(r => ({ matches: r.matches, error: false, stale: r.stale, updatedAt: r.updatedAt, attemptedAt: r.attemptedAt }))
      .catch(() => ({ matches: [] as Match[], error: true, stale: false, updatedAt: null as string | null, attemptedAt: new Date().toISOString() })),
    fetchTopScorers(),
  ])

  const { matches, error, stale, updatedAt, attemptedAt } = matchesResult
  const todayMatches = getTodayMatches(matches)
  const yesterdayMatches = getYesterdayMatches(matches)
  const tomorrowMatches = getTomorrowMatches(matches)
  const refereeCounts = countRefereeMatches(matches)

  return (
    <HomeClient
      todayMatches={todayMatches}
      yesterdayMatches={yesterdayMatches}
      tomorrowMatches={tomorrowMatches}
      topScorers={scorers.slice(0, 5)}
      matchesError={error}
      matchesStale={stale}
      matchesUpdatedAt={updatedAt}
      matchesAttemptedAt={attemptedAt}
      refereeCounts={refereeCounts}
      archiveMode={isArchiveMode()}
    />
  )
}
