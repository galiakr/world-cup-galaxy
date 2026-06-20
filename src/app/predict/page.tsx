import { fetchMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import PredictClient from '@/components/pages/PredictClient'

// fetchMatches retries against a slow/flaky upstream with a generous
// per-attempt timeout — give Vercel enough function budget for that.
export const maxDuration = 30

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
