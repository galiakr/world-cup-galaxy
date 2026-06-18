import { fetchMatches, getPastMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import MatchesClient from '@/components/pages/MatchesClient'

export default async function MatchesPage() {
  let matches: Match[] = []
  let error = false
  try {
    matches = await fetchMatches()
  } catch {
    error = true
  }

  return (
    <MatchesClient
      pastMatches={getPastMatches(matches)}
      upcomingMatches={getUpcomingMatches(matches, 10)}
      matchesError={error}
    />
  )
}
