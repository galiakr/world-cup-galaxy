import { fetchMatches, fetchTopScorers, getTodayMatches, getYesterdayMatches, getTomorrowMatches } from '@/lib/api'
import { Match } from '@/types'
import HomeClient from '@/components/pages/HomeClient'

export default async function HomePage() {
  const [matchesResult, scorers] = await Promise.all([
    fetchMatches().then(matches => ({ matches, error: false })).catch(() => ({ matches: [] as Match[], error: true })),
    fetchTopScorers(),
  ])

  const { matches, error } = matchesResult
  const todayMatches = getTodayMatches(matches)
  const yesterdayMatches = getYesterdayMatches(matches)
  const tomorrowMatches = getTomorrowMatches(matches)

  return (
    <HomeClient
      todayMatches={todayMatches}
      yesterdayMatches={yesterdayMatches}
      tomorrowMatches={tomorrowMatches}
      topScorers={scorers.slice(0, 5)}
      matchesError={error}
    />
  )
}
