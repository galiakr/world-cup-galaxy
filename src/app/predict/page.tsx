import { fetchMatches, getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import PredictClient from '@/components/pages/PredictClient'

export default async function PredictPage() {
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

  const upcoming = getUpcomingMatches(matches, 5)
  return (
    <PredictClient
      upcomingMatches={upcoming}
      allMatches={matches}
      matchesError={error}
      matchesStale={stale}
      matchesUpdatedAt={updatedAt}
    />
  )
}
