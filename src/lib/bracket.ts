import { Match } from '@/types'

// The upstream feed's own match_number field turned out to be a bug —
// it's the same placeholder value on every knockout match — so rounds
// are ordered by kickoff time instead, which is reliably populated for
// every match (including ones whose teams aren't determined yet).
export const BRACKET_ROUNDS: Match['round'][] = [
  'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final',
]

export function buildBracket(matches: Match[]): Record<string, Match[]> {
  const result: Record<string, Match[]> = {}
  for (const round of BRACKET_ROUNDS) {
    result[round] = matches
      .filter(m => m.round === round)
      .sort((a, b) => new Date(a.kick_off_utc).getTime() - new Date(b.kick_off_utc).getTime())
  }
  return result
}

// The round to expand by default — the earliest round (in bracket order)
// that still has at least one unfinished match, i.e. "where the action
// currently is." Advances automatically as each round wraps up, with no
// need to track this anywhere persistent.
export function getCurrentRound(bracket: Record<string, Match[]>): Match['round'] {
  for (const round of BRACKET_ROUNDS) {
    const matches = bracket[round]
    if (matches?.length && matches.some(m => m.status !== 'finished')) {
      return round
    }
  }
  return 'final'
}
