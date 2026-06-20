import { fetchMatches, getPastMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import MatchesClient from '@/components/pages/MatchesClient'

export default async function MatchesPage() {
  let matches: Match[] = []
  let error = false
  let stale = false
  let updatedAt: string | null = null
  try {
    const result = await fetchMatches()
    matches = result.matches
    stale = result.stale
    updatedAt = result.updatedAt
  } catch {
    error = true
  }

  return (
    <MatchesClient
      pastMatches={getPastMatches(matches)}
      upcomingMatches={getUpcomingMatches(matches, 10)}
      matchesError={error}
      matchesStale={stale}
      matchesUpdatedAt={updatedAt}
    />
  )
}
