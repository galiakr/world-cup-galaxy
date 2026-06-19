import { fetchMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import PredictClient from '@/components/pages/PredictClient'

export default async function PredictPage() {
  let matches: Match[] = []
  let error = false
  try {
    matches = await fetchMatches()
  } catch {
    error = true
  }

  const upcoming = getUpcomingMatches(matches, 5)
  return <PredictClient upcomingMatches={upcoming} allMatches={matches} matchesError={error} />
}
