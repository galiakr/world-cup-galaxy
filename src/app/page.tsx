import { fetchMatches, fetchTopScorers, getTodayMatches, getYesterdayMatches, getTomorrowMatches } from '@/lib/api'
import HomeClient from '@/components/pages/HomeClient'

export default async function HomePage() {
  const [matches, scorers] = await Promise.all([
    fetchMatches(),
    fetchTopScorers(),
  ])

  const todayMatches = getTodayMatches(matches)
  const yesterdayMatches = getYesterdayMatches(matches)
  const tomorrowMatches = getTomorrowMatches(matches)

  return (
    <HomeClient
      todayMatches={todayMatches}
      yesterdayMatches={yesterdayMatches}
      tomorrowMatches={tomorrowMatches}
      topScorers={scorers.slice(0, 5)}
    />
  )
}
