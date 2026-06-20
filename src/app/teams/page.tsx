import TeamsClient from '@/components/pages/TeamsClient'
import { TEAMS } from '@/data/teams'
import { fetchMatches } from '@/lib/api'
import { Match } from '@/types'
import {
  computeGroupStandings, computeKnockoutQualifiers, computeTeamStage,
  getGroupPosition, TeamStage, GroupPosition,
} from '@/lib/standings'

// fetchMatches retries against a slow/flaky upstream with a generous
// per-attempt timeout — give Vercel enough function budget for that.
export const maxDuration = 30

export default async function TeamsPage() {
  let matches: Match[] = []
  let attemptedAt: string = new Date().toISOString()
  try {
    const result = await fetchMatches()
    matches = result.matches
    attemptedAt = result.attemptedAt
  } catch {
    // Stage badges just won't show if match data is unavailable — the
    // teams list itself doesn't depend on it.
  }

  const standings = computeGroupStandings(matches)
  const qualifiers = computeKnockoutQualifiers(standings)

  const stageById: Record<string, TeamStage> = {}
  const standingById: Record<string, GroupPosition> = {}

  for (const team of TEAMS) {
    stageById[team.id] = computeTeamStage(team.id, matches, standings, qualifiers)
    const position = getGroupPosition(team.id, team.group, standings)
    if (position) standingById[team.id] = position
  }

  return (
    <TeamsClient
      teams={TEAMS}
      stageById={stageById}
      standingById={standingById}
      matchesAttemptedAt={attemptedAt}
    />
  )
}
