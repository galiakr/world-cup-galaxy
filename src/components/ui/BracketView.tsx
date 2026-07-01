'use client'
import { useState } from 'react'
import { Match } from '@/types'
import { useAppStore } from '@/store'
import { t, TranslationKey } from '@/lib/i18n'
import { TEAMS_BY_ID, getTeamName } from '@/data/teams'
import { getStadiumText } from '@/data/stadiums'
import { BRACKET_ROUNDS, buildBracket, getCurrentRound } from '@/lib/bracket'
import { format } from 'date-fns'

const ROUND_LABEL_KEY: Record<string, TranslationKey> = {
  round_of_32: 'stage_round_of_32',
  round_of_16: 'stage_round_of_16',
  quarter: 'stage_quarter',
  semi: 'stage_semi',
  third_place: 'stage_third_place',
  final: 'stage_final',
}

export default function BracketView({ matches }: { matches: Match[] }) {
  const lang = useAppStore(s => s.lang)
  const bracket = buildBracket(matches)
  const hasAnyKnockout = BRACKET_ROUNDS.some(r => bracket[r]?.length > 0)

  // Only one round expanded at a time — keeps the whole bracket within
  // the screen width instead of needing to scroll sideways. Starts on
  // whichever round currently has unfinished matches, and the user can
  // tap any collapsed round to switch to it.
  const [expanded, setExpanded] = useState<Match['round'] | null>(null)
  const [showAll, setShowAll] = useState(false)
  const activeRound = expanded ?? getCurrentRound(bracket)

  if (!hasAnyKnockout) return null

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-lg text-starlight">
          🏆 {t(lang, 'bracket_title')}
        </h2>
        <button
          onClick={() => setShowAll(s => !s)}
          className="text-xs font-bold text-teal hover:text-teal/80 transition-colors"
        >
          {t(lang, showAll ? 'bracket_collapse' : 'bracket_expand_all')}
        </button>
      </div>
      <div className={`flex gap-1.5 items-stretch ${showAll ? 'overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0' : 'justify-center'}`}>
        {BRACKET_ROUNDS.map(round => {
          const roundMatches = bracket[round]
          if (!roundMatches || roundMatches.length === 0) return null
          const isActive = showAll || round === activeRound

          // Same wrapper for both states — only flex-grow/basis change,
          // so the browser slides the width smoothly between collapsed
          // strip and expanded column instead of swapping instantly.
          return (
            <div
              key={round}
              style={{
                flexGrow: isActive ? 1 : 0,
                flexBasis: isActive ? (showAll ? '160px' : '0%') : '32px',
                maxWidth: isActive ? (showAll ? '160px' : '320px') : '32px',
              }}
              className="transition-[flex-grow,flex-basis,max-width] duration-300 ease-in-out min-w-0 flex-shrink-0 overflow-hidden"
            >
              {isActive ? (
                <>
                  <button
                    onClick={() => !showAll && setExpanded(round)}
                    className="w-full text-[10px] font-black text-teal uppercase tracking-wider mb-2 text-center"
                  >
                    {t(lang, ROUND_LABEL_KEY[round])}
                  </button>
                  <div className="flex flex-col gap-2">
                    {roundMatches.map(m => (
                      <BracketSlot key={m.id} match={m} />
                    ))}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setExpanded(round)}
                  className="w-8 h-full bg-spacelight border border-ink/10 rounded-xl flex items-center justify-center hover:border-teal/50 transition-colors"
                >
                  <span
                    className="text-[10px] font-black text-teal/70 uppercase tracking-wider whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {t(lang, ROUND_LABEL_KEY[round])}
                  </span>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BracketSlot({ match }: { match: Match }) {
  const lang = useAppStore(s => s.lang)
  const isHe = lang === 'he'
  const homeTeam = TEAMS_BY_ID[match.home_team_id]
  const awayTeam = TEAMS_BY_ID[match.away_team_id]
  const homeKnown = match.home_team_id !== '0' && !!homeTeam
  const awayKnown = match.away_team_id !== '0' && !!awayTeam

  const isFinished = match.status === 'finished'
  const hasPenalties =
    isFinished &&
    match.home_penalty_score != null &&
    match.away_penalty_score != null
  const homeWon =
    (isFinished && match.home_score != null && match.away_score != null && match.home_score > match.away_score) ||
    (hasPenalties && match.home_penalty_score! > match.away_penalty_score!)
  const awayWon =
    (isFinished && match.home_score != null && match.away_score != null && match.away_score > match.home_score) ||
    (hasPenalties && match.away_penalty_score! > match.home_penalty_score!)
  const stadiumText = getStadiumText(match.stadium_id, lang)

  return (
    <div dir="ltr" className="bg-spacelight border border-ink/10 rounded-xl px-2 py-1.5 text-xs">
      <Side
        name={homeKnown ? getTeamName(match.home_team_id, lang) : t(lang, 'bracket_tbd')}
        flag={homeTeam?.flag_url}
        score={isFinished ? match.home_score : null}
        won={homeWon}
        known={homeKnown}
        isHe={isHe}
      />
      <div className="h-px bg-ink/10 my-1" />
      <Side
        name={awayKnown ? getTeamName(match.away_team_id, lang) : t(lang, 'bracket_tbd')}
        flag={awayTeam?.flag_url}
        score={isFinished ? match.away_score : null}
        won={awayWon}
        known={awayKnown}
        isHe={isHe}
      />
      {hasPenalties && (
        <div dir="ltr" className="text-[10px] font-bold text-starlight/90 text-center mt-1 font-readout tracking-wide">
          {isHe
            ? `${match.home_penalty_score}–${match.away_penalty_score} ${t(lang, 'match_pens')}`
            : `${t(lang, 'match_pens')} ${match.home_penalty_score}–${match.away_penalty_score}`}
        </div>
      )}
      {!isFinished && match.kick_off_utc && (
        <div className="text-[9px] text-starlight/60 text-center mt-1 font-readout">
          {format(new Date(match.kick_off_utc), 'dd/MM HH:mm')}
        </div>
      )}
      {stadiumText.name && (
        <div className="text-[9px] text-starlight/60 text-center mt-0.5 truncate">
          {stadiumText.name}, {stadiumText.city}
        </div>
      )}
    </div>
  )
}

function Side({ name, flag, score, won, known, isHe }: {
  name: string; flag?: string; score?: number | null; won: boolean; known: boolean; isHe: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      {flag ? (
        <img src={flag} alt="" className="w-4 h-3 object-cover rounded-sm flex-shrink-0" />
      ) : (
        <span className="w-4 h-3 flex-shrink-0 flex items-center justify-center text-[8px]">🏳️</span>
      )}
      <span
        dir={isHe ? 'rtl' : 'ltr'}
        className={`flex-1 min-w-0 truncate ${
          known ? (won ? 'font-extrabold text-gold' : 'font-bold text-starlight') : 'text-starlight/30 italic'
        }`}
      >
        {name}
      </span>
      {score != null && (
        <span className={`font-readout flex-shrink-0 ${won ? 'text-gold font-black' : 'text-gold/70'}`}>
          {score}
        </span>
      )}
    </div>
  )
}
