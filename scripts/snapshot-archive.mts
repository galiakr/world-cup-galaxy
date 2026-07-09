// Freezes the current state of every external API into src/data/archive/,
// which the fetchers in src/lib/api.ts serve directly once archive mode
// kicks in (after ARCHIVE_CUTOFF_DATE, or WC_ARCHIVE_MODE=1).
//
// Run with:  npm run snapshot-archive
//
// Safe to run any time as a dry run; run it once more after the final
// (while the APIs still have the data) and commit the refreshed JSON.
// Takes ~6 minutes: football-data.org allows 10 requests/minute and the
// 48 squad fetches are throttled to stay under that.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

process.loadEnvFile(join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local'))

// Imported dynamically so .env.local is loaded before src/lib/supabase.ts
// reads its env vars at module scope.
const { fetchMatches, fetchTopScorers, fetchSquad } = await import('../src/lib/api')
const { TEAMS } = await import('../src/data/teams')

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'archive')
mkdirSync(OUT_DIR, { recursive: true })

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function write(name: string, data: unknown) {
  const path = join(OUT_DIR, name)
  writeFileSync(path, JSON.stringify(data, null, 1))
  console.log(`wrote ${path}`)
}

const updatedAt = new Date().toISOString()

console.log('── matches …')
const { matches, stale } = await fetchMatches()
if (stale) console.warn('⚠ matches came from the Supabase fallback (live API down) — snapshot is as fresh as that fallback')
const finished = matches.filter(m => m.status === 'finished').length
console.log(`   ${matches.length} matches (${finished} finished)`)
write('matches.json', { updatedAt, matches })

console.log('── top scorers …')
const scorers = await fetchTopScorers()
console.log(`   ${scorers.length} scorers`)
write('scorers.json', { updatedAt, scorers })

console.log('── squads (throttled to football-data.org\'s 10 req/min) …')
const squads: Record<string, Awaited<ReturnType<typeof fetchSquad>>> = {}
for (const [i, team] of TEAMS.entries()) {
  const squad = await fetchSquad(team.fifa_code)
  squads[team.fifa_code.toUpperCase()] = squad
  console.log(`   [${i + 1}/${TEAMS.length}] ${team.fifa_code}: ${squad.players.length} players${squad.players.length === 0 ? ' ⚠' : ''}`)
  if (i < TEAMS.length - 1) await sleep(6500)
}
write('squads.json', { updatedAt, squads })

const empty = Object.entries(squads).filter(([, s]) => s.players.length === 0).map(([c]) => c)
if (empty.length > 0) console.warn(`⚠ squads with no players (check before committing): ${empty.join(', ')}`)
console.log('done — review the JSON, then commit src/data/archive/')
