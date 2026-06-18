import { fetchMatches, getUpcomingMatches } from '@/lib/api'
import PredictClient from '@/components/pages/PredictClient'

export default async function PredictPage() {
  const matches = await fetchMatches()
  const upcoming = getUpcomingMatches(matches, 5)
  return <PredictClient upcomingMatches={upcoming} allMatches={matches} />
}
