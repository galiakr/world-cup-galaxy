import { fetchMatches, getPastMatches, getUpcomingMatches } from '@/lib/api'
import MatchesClient from '@/components/pages/MatchesClient'

export default async function MatchesPage() {
  const matches = await fetchMatches()
  return (
    <MatchesClient
      pastMatches={getPastMatches(matches)}
      upcomingMatches={getUpcomingMatches(matches, 10)}
    />
  )
}
