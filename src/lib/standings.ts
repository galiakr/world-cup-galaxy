import { Match, GroupTeamRow } from '@/types'
import { TEAMS_BY_ID } from '@/data/teams'

export type TeamStage =
  | 'group' | 'round_of_32' | 'round_of_16' | 'quarter' | 'semi'
  | 'third_place' | 'final' | 'champion' | 'runner_up' | 'fourth_place' | 'eliminated'

export interface GroupPosition {
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  points: number
}

const ROUND_ORDER: Match['round'][] = ['group', 'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final']

function ensureRow(group: Record<string, GroupTeamRow>, teamId: string) {
  if (!teamId || teamId === '0' || group[teamId]) return
  group[teamId] = {
    team_id: teamId,
    team: TEAMS_BY_ID[teamId],
    played: 0, won: 0, drawn: 0, lost: 0,
    goals_for: 0, goals_against: 0, goal_diff: 0, points: 0,
  }
}

// Standard group table: 3 pts/win, 1/draw, ranked by points then goal
// difference then goals scored. Head-to-head tiebreaks are skipped —
// a rare-enough edge case not worth the complexity for this app.
export function computeGroupStandings(matches: Match[]): Record<string, GroupTeamRow[]> {
  const groups: Record<string, Record<string, GroupTeamRow>> = {}

  for (const m of matches) {
    if (m.round !== 'group' || !m.group_name) continue
    const group = m.group_name
    if (!groups[group]) groups[group] = {}
    ensureRow(groups[group], m.home_team_id)
    ensureRow(groups[group], m.away_team_id)

    if (m.status !== 'finished' || m.home_score == null || m.away_score == null) continue
    const home = groups[group][m.home_team_id]
    const away = groups[group][m.away_team_id]
    if (!home || !away) continue

    home.played++; away.played++
    home.goals_for += m.home_score; home.goals_against += m.away_score
    away.goals_for += m.away_score; away.goals_against += m.home_score
    if (m.home_score > m.away_score) { home.won++; home.points += 3; away.lost++ }
    else if (m.home_score < m.away_score) { away.won++; away.points += 3; home.lost++ }
    else { home.drawn++; away.drawn++; home.points++; away.points++ }
  }

  const result: Record<string, GroupTeamRow[]> = {}
  for (const [group, rows] of Object.entries(groups)) {
    const list = Object.values(rows).map(r => ({ ...r, goal_diff: r.goals_for - r.goals_against }))
    list.sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for)
    result[group] = list
  }
  return result
}

// Top 2 of each of the 12 groups (24) + the 8 best third-placed teams
// across all groups (8) = 32 advance — the real 48-team World Cup format.
export function computeKnockoutQualifiers(standings: Record<string, GroupTeamRow[]>): Set<string> {
  const qualified = new Set<string>()
  const thirdPlaceTeams: GroupTeamRow[] = []

  for (const rows of Object.values(standings)) {
    if (rows[0]) qualified.add(rows[0].team_id)
    if (rows[1]) qualified.add(rows[1].team_id)
    if (rows[2]) thirdPlaceTeams.push(rows[2])
  }

  thirdPlaceTeams
    .sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for)
    .slice(0, 8)
    .forEach(r => qualified.add(r.team_id))

  return qualified
}

function nextRound(round: Match['round']): TeamStage {
  const idx = ROUND_ORDER.indexOf(round)
  return (ROUND_ORDER[idx + 1] ?? 'final') as TeamStage
}

// The knockout bracket's team slots are placeholders (team_id "0") in the
// upstream feed until the group stage actually concludes, so for as long
// as that's true we determine advancement ourselves from the standings
// above instead of waiting on the feed to catch up.
export function computeTeamStage(
  teamId: string,
  matches: Match[],
  standings: Record<string, GroupTeamRow[]>,
  qualifiers: Set<string>
): TeamStage {
  const knockout = matches.filter(m =>
    m.round !== 'group' &&
    (m.home_team_id === teamId || m.away_team_id === teamId) &&
    m.home_team_id !== '0' && m.away_team_id !== '0'
  )

  if (knockout.length > 0) {
    const furthest = knockout.reduce((best, m) =>
      ROUND_ORDER.indexOf(m.round) > ROUND_ORDER.indexOf(best.round) ? m : best
    )
    if (furthest.status === 'finished' && furthest.home_score != null && furthest.away_score != null) {
      const isHome = furthest.home_team_id === teamId
      const myScore = isHome ? furthest.home_score : furthest.away_score
      const oppScore = isHome ? furthest.away_score : furthest.home_score
      const won = myScore > oppScore
      if (furthest.round === 'final') return won ? 'champion' : 'runner_up'
      if (furthest.round === 'third_place') return won ? 'third_place' : 'fourth_place'
      return won ? nextRound(furthest.round) : 'eliminated'
    }
    return furthest.round as TeamStage
  }

  const groupMatches = matches.filter(m =>
    m.round === 'group' && (m.home_team_id === teamId || m.away_team_id === teamId)
  )
  const allFinished = groupMatches.length === 3 && groupMatches.every(m => m.status === 'finished')
  if (!allFinished) return 'group'
  return qualifiers.has(teamId) ? 'round_of_32' : 'eliminated'
}

export function getGroupPosition(teamId: string, group: string, standings: Record<string, GroupTeamRow[]>): GroupPosition | null {
  const rows = standings[group] ?? []
  const idx = rows.findIndex(r => r.team_id === teamId)
  if (idx === -1) return null
  const r = rows[idx]
  return { position: idx + 1, played: r.played, won: r.won, drawn: r.drawn, lost: r.lost, points: r.points }
}
