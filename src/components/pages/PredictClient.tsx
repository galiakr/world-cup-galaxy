'use client'
import { useState, useEffect } from 'react'
import { Match, Prediction } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { savePrediction, getUserPredictions } from '@/lib/supabase'
import { format } from 'date-fns'

interface PredictClientProps { upcomingMatches: Match[] }

export default function PredictClient({ upcomingMatches }: PredictClientProps) {
  const { lang, user, addSticker } = useAppStore()
  const isHe = lang === 'he'

  const [matchIdx, setMatchIdx] = useState(0)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [myPredictions, setMyPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)

  const current = upcomingMatches[matchIdx]

  useEffect(() => {
    if (!user) return
    getUserPredictions(user.id).then(setMyPredictions)
  }, [user])

  function change(side: 'home' | 'away', delta: number) {
    if (current && submitted[current.id]) return
    if (side === 'home') setHomeScore(s => Math.max(0, Math.min(9, s + delta)))
    else setAwayScore(s => Math.max(0, Math.min(9, s + delta)))
  }

  async function handleSubmit() {
    if (!user || !current || submitted[current.id]) return
    setLoading(true)
    const ok = await savePrediction(user.id, current.id, homeScore, awayScore)
    if (ok) {
      addSticker('a_predict1')
      setSubmitted(s => ({ ...s, [current.id]: true }))
      // Refresh predictions
      const updated = await getUserPredictions(user.id)
      setMyPredictions(updated)
    }
    setLoading(false)
  }

  if (upcomingMatches.length === 0) {
    return (
      <div className="px-4 pt-8 text-center">
        <div className="text-5xl mb-4">🔮</div>
        <p className="text-gray-400">{t(lang, 'predict_no_upcoming')}</p>
      </div>
    )
  }

  const homeTeam = current?.home_team
  const awayTeam = current?.away_team

  return (
    <div className="px-4 pt-4">
      <h1 className="font-fredoka text-2xl text-gray-800 mb-1" style={{ fontFamily: 'Fredoka One, cursive' }}>
        🔮 {t(lang, 'predict_title')}
      </h1>
      <p className="text-sm text-gray-400 mb-4">{t(lang, 'predict_subtitle')}</p>

      {/* Match selector */}
      {upcomingMatches.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {upcomingMatches.map((m, i) => {
            const h = m.home_team
            const a = m.away_team
            return (
              <button
                key={m.id}
                onClick={() => { setMatchIdx(i); setHomeScore(0); setAwayScore(0) }}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors
                  ${i === matchIdx ? 'bg-gray-900 text-yellow-400 border-gray-900' : 'bg-white text-gray-500 border-gray-200'}`}
              >
                <span>{h?.flag_emoji ?? '🏳️'}</span>
                <span>{a?.flag_emoji ?? '🏳️'}</span>
                <span className="ml-1">{format(new Date(m.match_date), 'dd/MM')}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Prediction card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4">
        {/* Match date */}
        <div className="text-xs text-gray-400 font-bold text-center mb-4">
          📅 {current?.match_date ? format(new Date(current.match_date), 'EEEE dd MMM') : ''}
          {current?.group_name && ` · ${t(lang, 'match_group')} ${current.group_name}`}
        </div>

        {/* Teams */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 text-center">
            <div className="text-4xl mb-1">{homeTeam?.flag_emoji ?? '🏳️'}</div>
            <div className="font-bold text-sm leading-tight">{isHe ? homeTeam?.name_he : homeTeam?.name_en}</div>
          </div>
          <div className="text-gray-300 font-bold text-xl">VS</div>
          <div className="flex-1 text-center">
            <div className="text-4xl mb-1">{awayTeam?.flag_emoji ?? '🏳️'}</div>
            <div className="font-bold text-sm leading-tight">{isHe ? awayTeam?.name_he : awayTeam?.name_en}</div>
          </div>
        </div>

        {/* Score steppers */}
        {!submitted[current?.id] ? (
          <>
            <div className="flex items-center justify-center gap-6 mb-5">
              <Stepper value={homeScore} onChange={d => change('home', d)} />
              <div className="font-fredoka text-3xl text-gray-300" style={{ fontFamily: 'Fredoka One, cursive' }}>:</div>
              <Stepper value={awayScore} onChange={d => change('away', d)} />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-yellow-400 text-gray-900 font-fredoka text-lg rounded-2xl py-3 active:scale-97 disabled:opacity-60"
              style={{ fontFamily: 'Fredoka One, cursive' }}
            >
              {loading ? '...' : t(lang, 'predict_submit')}
            </button>
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <div className="font-fredoka text-green-700 text-xl mb-1" style={{ fontFamily: 'Fredoka One, cursive' }}>
              ✅ {t(lang, 'predict_submitted')}
            </div>
            <div className="text-green-600 font-bold text-2xl">{homeScore} – {awayScore}</div>
          </div>
        )}
      </div>

      {/* My predictions history */}
      {myPredictions.length > 0 && (
        <div className="mb-4">
          <h2 className="font-fredoka text-lg text-gray-800 mb-2" style={{ fontFamily: 'Fredoka One, cursive' }}>
            📋 {t(lang, 'predict_my')}
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
            {myPredictions.map(p => (
              <div key={p.id} className="py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 text-xs">{t(lang, 'predict_guessed')} {p.predicted_home}–{p.predicted_away}</span>
                  {p.is_exact_score && <span className="text-yellow-600 text-xs font-bold">💎 {t(lang, 'predict_exact')}</span>}
                  {p.is_correct_winner && !p.is_exact_score && <span className="text-green-600 text-xs font-bold">🎯 {t(lang, 'predict_winner')}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Stepper({ value, onChange }: { value: number; onChange: (d: number) => void }) {
  return (
    <div className="flex items-center gap-1 border-2 border-green-500 rounded-2xl overflow-hidden">
      <button
        onClick={() => onChange(-1)}
        className="w-10 h-12 bg-green-500 text-white font-black text-2xl active:bg-green-600"
      >−</button>
      <span className="w-10 text-center font-fredoka text-2xl text-gray-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
        {value}
      </span>
      <button
        onClick={() => onChange(1)}
        className="w-10 h-12 bg-green-500 text-white font-black text-2xl active:bg-green-600"
      >+</button>
    </div>
  )
}
