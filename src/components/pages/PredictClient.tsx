'use client'
import { useState, useEffect, useMemo } from 'react'
import { Match, Prediction } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { savePrediction, getUserPredictions, scorePrediction, awardSticker } from '@/lib/supabase'
import StaleDataBanner from '@/components/ui/StaleDataBanner'
import UpdateAttemptTab from '@/components/ui/UpdateAttemptTab'
import { format } from 'date-fns'

interface PredictClientProps {
  upcomingMatches: Match[]
  allMatches: Match[]
  matchesError?: boolean
  matchesStale?: boolean
  matchesUpdatedAt?: string | null
  matchesAttemptedAt?: string
}

export default function PredictClient({ upcomingMatches, allMatches, matchesError, matchesStale, matchesUpdatedAt, matchesAttemptedAt }: PredictClientProps) {
  const { lang, user, addSticker } = useAppStore()
  const isHe = lang === 'he'

  const [matchIdx, setMatchIdx] = useState(0)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null)
  const [myPredictions, setMyPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const matchesById = useMemo(() => new Map(allMatches.map(m => [m.id, m])), [allMatches])
  const current = upcomingMatches[matchIdx]
  const isLocked = (m?: Match) =>
    !!m && (m.status !== 'scheduled' || (!!m.kick_off_utc && new Date(m.kick_off_utc).getTime() <= Date.now()))
  const currentLocked = isLocked(current)
  const existingPrediction = current ? myPredictions.find(p => p.match_id === current.id) : undefined
  const isEditing = !existingPrediction || editingMatchId === current?.id

  useEffect(() => {
    if (!user) return
    getUserPredictions(user.id).then(setMyPredictions)
  }, [user])

  // Score predictions against now-finished matches and award the
  // matching sticker — savePrediction() only ever awards "made a guess",
  // it has no way to know the eventual result.
  useEffect(() => {
    if (!user || myPredictions.length === 0) return

    const unscored = myPredictions.filter(p => {
      if (p.is_exact_score != null) return false
      const m = matchesById.get(p.match_id)
      return m?.status === 'finished' && m.home_score != null && m.away_score != null
    })
    if (unscored.length === 0) return

    let cancelled = false
    ;(async () => {
      for (const p of unscored) {
        const m = matchesById.get(p.match_id)!
        const exact = p.predicted_home === m.home_score && p.predicted_away === m.away_score
        const actualSign = Math.sign(m.home_score! - m.away_score!)
        const predictedSign = Math.sign(p.predicted_home - p.predicted_away)
        const correctWinner = exact || actualSign === predictedSign

        await scorePrediction(p.id, correctWinner, exact)
        if (exact) { await awardSticker(user.id, 'a_exact_score'); addSticker('a_exact_score') }
        else if (correctWinner) { await awardSticker(user.id, 'a_predict_win'); addSticker('a_predict_win') }
      }
      if (!cancelled) {
        const updated = await getUserPredictions(user.id)
        setMyPredictions(updated)
      }
    })()
    return () => { cancelled = true }
  }, [user, myPredictions, matchesById, addSticker])

  // Initialize the steppers to the previously submitted score whenever the
  // selected match changes (so editing starts from what was last saved).
  useEffect(() => {
    const existing = current ? myPredictions.find(p => p.match_id === current.id) : undefined
    setHomeScore(existing?.predicted_home ?? 0)
    setAwayScore(existing?.predicted_away ?? 0)
    setSubmitError(false)
  }, [current?.id, myPredictions])

  function change(side: 'home' | 'away', delta: number) {
    if (current && (!isEditing || currentLocked)) return
    if (side === 'home') setHomeScore(s => Math.max(0, Math.min(9, s + delta)))
    else setAwayScore(s => Math.max(0, Math.min(9, s + delta)))
  }

  async function handleSubmit() {
    if (!user || !current || currentLocked) return
    setLoading(true)
    setSubmitError(false)
    const ok = await savePrediction(user.id, current.id, homeScore, awayScore)
    if (ok) {
      addSticker('a_predict1')
      setEditingMatchId(null)
      // Refresh predictions
      const updated = await getUserPredictions(user.id)
      setMyPredictions(updated)
    } else {
      setSubmitError(true)
    }
    setLoading(false)
  }

  const homeTeam = current?.home_team
  const awayTeam = current?.away_team

  // The "no upcoming matches" empty state used to be an early `return` —
  // which meant the My Predictions history below it never rendered once
  // every match a user had predicted on had finished (or there were
  // simply no upcoming matches left to show). Render it as a branch
  // instead, so past predictions stay visible regardless.
  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl text-starlight mb-1">
        🔮 {t(lang, 'predict_title')}
      </h1>
      <p className="text-sm text-starlight/40 mb-4">{t(lang, 'predict_subtitle')}</p>

      {matchesStale && <StaleDataBanner updatedAt={matchesUpdatedAt ?? null} />}

      {upcomingMatches.length === 0 && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🔮</div>
          <p className="text-gray-400">
            {t(lang, matchesError ? 'matches_load_error' : 'predict_no_upcoming')}
          </p>
        </div>
      )}

      {/* Match selector */}
      {upcomingMatches.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {upcomingMatches.map((m, i) => {
            const h = m.home_team
            const a = m.away_team
            const locked = isLocked(m)
            return (
              <button
                key={m.id}
                onClick={() => setMatchIdx(i)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors
                  ${i === matchIdx ? 'bg-coral text-white border-coral' : 'bg-spacelight text-starlight/50 border-ink/10'}
                  ${locked ? 'opacity-50' : ''}`}
              >
                {locked && <span>🔒</span>}
                <span>{h?.flag_emoji ?? '🏳️'}</span>
                <span>{a?.flag_emoji ?? '🏳️'}</span>
                <span className="ml-1 font-readout">
                  {format(new Date(m.match_date), 'dd/MM')}{m.kick_off_utc && ` · ${format(new Date(m.kick_off_utc), 'HH:mm')}`}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Prediction card */}
      {current && (
      <div className="bg-spacelight rounded-3xl border border-ink/10 p-5 mb-4">
        {/* Match date + local kickoff time */}
        <div className="text-xs text-starlight/40 font-bold text-center mb-4">
          🔮 {current?.match_date ? format(new Date(current.match_date), 'EEEE dd MMM') : ''}
          {current?.kick_off_utc && (
            <span className="font-readout text-teal"> · {format(new Date(current.kick_off_utc), 'HH:mm')}</span>
          )}
          {current?.group_name && ` · ${t(lang, 'match_group')} ${current.group_name}`}
        </div>

        {/* Teams */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 text-center">
            <div className="text-4xl mb-1">{homeTeam?.flag_emoji ?? '🏳️'}</div>
            <div className="font-bold text-sm leading-tight text-starlight">{isHe ? homeTeam?.name_he : homeTeam?.name_en}</div>
          </div>
          <div className="text-coral font-bold text-xl">VS</div>
          <div className="flex-1 text-center">
            <div className="text-4xl mb-1">{awayTeam?.flag_emoji ?? '🏳️'}</div>
            <div className="font-bold text-sm leading-tight text-starlight">{isHe ? awayTeam?.name_he : awayTeam?.name_en}</div>
          </div>
        </div>

        {/* Score steppers */}
        {/* Live indicator — shown whether or not a prediction was already made */}
        {current?.status === 'live' && (
          <div className="bg-coral/10 border border-coral/30 rounded-2xl p-3 text-center text-coral text-sm font-bold mb-4 animate-pulse">
            {t(lang, 'predict_live')}
          </div>
        )}

        {!isEditing ? null : currentLocked ? (
          current?.status !== 'live' && (
            <div className="bg-ink/5 border border-ink/10 rounded-2xl p-4 text-center text-starlight/50 text-sm">
              🔒 {t(lang, 'predict_locked')}
            </div>
          )
        ) : (
          <>
            <div className="flex items-center justify-center gap-6 mb-5">
              <Stepper value={homeScore} onChange={d => change('home', d)} />
              <div className="font-display text-3xl text-starlight/30">:</div>
              <Stepper value={awayScore} onChange={d => change('away', d)} />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-coral text-white font-display text-lg rounded-2xl py-3 active:scale-97 disabled:opacity-60"
            >
              {loading ? '...' : t(lang, 'predict_submit')}
            </button>
            {submitError && (
              <p className="text-coral text-xs font-bold text-center mt-2">
                {t(lang, 'predict_submit_error')}
              </p>
            )}
          </>
        )}
        {!isEditing && existingPrediction && (
          <div className="bg-teal/10 border border-teal/30 rounded-2xl p-4 text-center">
            <div className="font-display text-teal text-xl mb-1">
              ✅ {t(lang, 'predict_submitted')}
            </div>
            <div className="text-teal font-readout text-2xl mb-3">
              {existingPrediction.predicted_home} – {existingPrediction.predicted_away}
            </div>
            {!currentLocked && (
              <button
                onClick={() => setEditingMatchId(current!.id)}
                className="text-teal text-xs font-bold underline"
              >
                {t(lang, 'predict_edit')}
              </button>
            )}
          </div>
        )}
      </div>
      )}

      {/* My predictions history */}
      {myPredictions.length > 0 && (
        <div className="mb-4">
          <h2 className="font-display text-lg text-starlight mb-2">
            📋 {t(lang, 'predict_my')}
          </h2>
          <div className="bg-spacelight rounded-2xl border border-ink/10 p-3">
            {myPredictions.map(p => {
              const m = matchesById.get(p.match_id)
              const h = m?.home_team
              const a = m?.away_team
              return (
                <div key={p.id} className="py-2 border-b border-ink/10 last:border-0">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span>{h?.flag_emoji ?? '🏳️'}</span>
                    <span className="font-bold text-starlight text-xs flex-1">
                      {h ? (isHe ? h.name_he : h.name_en) : '?'} vs {a ? (isHe ? a.name_he : a.name_en) : '?'}
                    </span>
                    <span>{a?.flag_emoji ?? '🏳️'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-starlight/50 text-xs">{t(lang, 'predict_guessed')} {p.predicted_home}–{p.predicted_away}</span>
                    {m?.status === 'finished' && (
                      <span className="text-starlight text-xs font-bold">
                        {t(lang, 'predict_result')} {m.home_score}–{m.away_score}
                      </span>
                    )}
                    {m?.status === 'live' && (
                      <span className="text-coral text-xs font-bold animate-pulse">🔴 {t(lang, 'match_live')}</span>
                    )}
                    {p.is_exact_score && <span className="text-gold text-xs font-bold">💎 {t(lang, 'predict_exact')}</span>}
                    {p.is_correct_winner && !p.is_exact_score && <span className="text-teal text-xs font-bold">🎯 {t(lang, 'predict_winner')}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {matchesAttemptedAt && <UpdateAttemptTab attemptedAt={matchesAttemptedAt} />}
    </div>
  )
}

function Stepper({ value, onChange }: { value: number; onChange: (d: number) => void }) {
  return (
    <div className="flex items-center gap-1 border-2 border-coral rounded-2xl overflow-hidden">
      <button
        onClick={() => onChange(-1)}
        className="w-10 h-12 bg-coral text-white font-black text-2xl active:opacity-80"
      >−</button>
      <span className="w-10 text-center font-readout text-2xl text-starlight">
        {value}
      </span>
      <button
        onClick={() => onChange(1)}
        className="w-10 h-12 bg-coral text-white font-black text-2xl active:opacity-80"
      >+</button>
    </div>
  )
}
