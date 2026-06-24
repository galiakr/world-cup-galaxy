import { fetchMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import PredictClient from '@/components/pages/PredictClient'

// fetchMatches retries against a slow/flaky upstream with a generous
// per-attempt timeout — give Vercel enough function budget for that.
export const maxDuration = 30

// Without this, Next treats the page itself as a separately-cached ISR
// route (on top of fetchMatches' own 120s data cache) — a low-traffic
// page like this one then only re-renders whenever it happens to get a
// visit after its own cache expires, so it can lag well behind pages
// that get hit more often. Forcing dynamic rendering means every visit
// re-runs this page fresh, while still reusing the shared fetch cache.
export const dynamic = 'force-dynamic'

export default async function PredictPage() {
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

  const upcoming = getUpcomingMatches(matches, 5)
  return (
    <PredictClient
      upcomingMatches={upcoming}
      allMatches={matches}
      matchesError={error}
      matchesStale={stale}
      matchesUpdatedAt={updatedAt}
      matchesAttemptedAt={attemptedAt}
    />
  )
}
