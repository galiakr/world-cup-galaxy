import { fetchMatches, getPastMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import { countRefereeMatches } from '@/lib/standings'
import MatchesClient from '@/components/pages/MatchesClient'

// fetchMatches retries against a slow/flaky upstream with a generous
// per-attempt timeout — give Vercel enough function budget for that.
export const maxDuration = 30

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

  return (
    <MatchesClient
      pastMatches={getPastMatches(matches)}
      upcomingMatches={getUpcomingMatches(matches, 10)}
      knockoutMatches={matches.filter(m => m.round !== 'group')}
      matchesError={error}
      matchesStale={stale}
      matchesUpdatedAt={updatedAt}
      matchesAttemptedAt={attemptedAt}
      refereeCounts={countRefereeMatches(matches)}
    />
  )
}
