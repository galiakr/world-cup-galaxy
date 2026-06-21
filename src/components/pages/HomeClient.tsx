'use client'
import { useState } from 'react'
import { Match, TopScorer } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import MatchCard from '@/components/ui/MatchCard'
import StaleDataBanner from '@/components/ui/StaleDataBanner'
import UpdateAttemptTab from '@/components/ui/UpdateAttemptTab'
import { claimDailySticker, awardSticker } from '@/lib/supabase'
import { israelDateString } from '@/lib/date'
import { TEAMS_BY_FIFA_CODE, getTeamName } from '@/data/teams'

interface HomeClientProps {
  todayMatches: Match[]
  yesterdayMatches: Match[]
  tomorrowMatches: Match[]
  topScorers: TopScorer[]
  matchesError?: boolean
  matchesStale?: boolean
  matchesUpdatedAt?: string | null
  matchesAttemptedAt?: string
  refereeCounts?: Record<string, number>
}

export default function HomeClient({ todayMatches, yesterdayMatches, tomorrowMatches, topScorers, matchesError, matchesStale, matchesUpdatedAt, matchesAttemptedAt, refereeCounts }: HomeClientProps) {
  const { lang, user, dailyClaimedDate, setDailyClaimedDate, addSticker } = useAppStore()
  const [expandedFact, setExpandedFact] = useState<string | null>(null)

  const today = israelDateString()
  const dailyClaimed = dailyClaimedDate === today

  // Tournament countdown to July 19 2026 final
  const finalDate = new Date('2026-07-19')
  const daysLeft = Math.max(0, Math.ceil((finalDate.getTime() - Date.now()) / 86400000))

  async function handleClaimDaily() {
    if (!user || dailyClaimed) return
    const { claimed, stickerId } = await claimDailySticker(user.id)
    if (claimed && stickerId) {
      addSticker(stickerId)
      setDailyClaimedDate(today)
    }
  }

  return (
    <div className="px-4 pt-4">
      {/* Hero — mission control */}
      <div className="relative bg-spacelight rounded-[2rem] p-5 pb-6 mb-4 overflow-hidden border border-ink/10">
        {/* Ambient sparkles */}
        <span className="absolute top-5 left-8 w-1.5 h-1.5 rounded-full bg-gold animate-twinkle pointer-events-none" />
        <span className="absolute top-12 right-12 w-1.5 h-1.5 rounded-full bg-violet animate-twinkle pointer-events-none" style={{ animationDelay: '0.8s' }} />
        <span className="absolute bottom-16 left-14 w-2 h-2 rounded-full bg-teal animate-twinkle pointer-events-none" style={{ animationDelay: '1.4s' }} />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-teal text-[10px] font-bold tracking-[0.15em]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            {t(lang, 'home_eyebrow')}
          </div>
          <div className="text-xs text-starlight/40">{t(lang, 'tagline')}</div>
        </div>

        <div className="font-display text-gold text-xl mb-4 flex items-center justify-center gap-2">
          {t(lang, 'app_name')}
        </div>

        {/* Passport stamp — signature element: the countdown stamped like
            an entry visa, slightly askew like a real hand-stamped mark */}
        <div className="relative w-32 h-32 mx-auto -rotate-6">
          <div className="absolute inset-0 rounded-full border-[3px] border-double border-coral" />
          <div className="absolute inset-[6px] rounded-full border border-dashed border-coral/50 bg-space flex flex-col items-center justify-center px-2 text-center">
            <div className="text-coral text-[8px] font-bold tracking-[0.15em] uppercase leading-tight">{t(lang, 'app_name')}</div>
            <div className="font-display text-coral text-3xl leading-none my-1">{daysLeft}</div>
            <div className="text-ink/50 text-[8px] font-bold tracking-[0.2em] uppercase">{t(lang, 'home_days_left')}</div>
          </div>
        </div>

        {/* Telemetry strip */}
        <div className="flex items-center justify-center gap-2.5 mt-4 font-readout text-[11px] text-starlight/70">
          <span><span className="text-teal">48</span> {t(lang, 'home_teams')}</span>
          <span className="w-1 h-1 rounded-full bg-ink/20" />
          <span><span className="text-teal">104</span> {t(lang, 'home_matches')}</span>
        </div>
      </div>

      {/* Daily sticker banner */}
      <button
        onClick={handleClaimDaily}
        disabled={dailyClaimed}
        className={`w-full flex items-center gap-4 rounded-2xl p-4 mb-4 text-left transition-all
          ${dailyClaimed
            ? 'bg-ink/5 border border-ink/10 opacity-60 cursor-default'
            : 'bg-gradient-to-r from-gold to-coral active:scale-98 hover-lift'
          }`}
      >
        <div className="text-5xl">{dailyClaimed ? '✅' : '🌟'}</div>
        <div>
          <div className={`font-display text-lg ${dailyClaimed ? 'text-starlight' : 'text-starlight'}`}>
            {t(lang, 'home_daily_sticker')}
          </div>
          <div className={`text-xs mt-0.5 ${dailyClaimed ? 'text-starlight/60' : 'text-starlight/70'}`}>
            {dailyClaimed ? t(lang, 'home_daily_claimed') : t(lang, 'home_daily_sub')}
          </div>
        </div>
      </button>

      {matchesStale && <StaleDataBanner updatedAt={matchesUpdatedAt ?? null} />}

      {/* Today's matches */}
      <Section title={t(lang, 'home_today')} emoji="" accent="gold">
        {matchesError
          ? <EmptyMsg text={t(lang, 'matches_load_error')} />
          : todayMatches.length > 0
            ? todayMatches.map(m => <MatchCard key={m.id} match={m} refereeMatchCount={m.referee ? refereeCounts?.[m.referee] : undefined} />)
            : <EmptyMsg text={t(lang, 'home_no_matches')} />
        }
      </Section>

      {/* Yesterday's results */}
      {yesterdayMatches.length > 0 && (
        <Section title={t(lang, 'home_yesterday')} emoji="" accent="violet">
          {yesterdayMatches.map(m => <MatchCard key={m.id} match={m} compact refereeMatchCount={m.referee ? refereeCounts?.[m.referee] : undefined} />)}
        </Section>
      )}

      {/* Tomorrow */}
      {tomorrowMatches.length > 0 && (
        <Section title={t(lang, 'home_tomorrow')} emoji="" accent="coral">
          {tomorrowMatches.map(m => <MatchCard key={m.id} match={m} refereeMatchCount={m.referee ? refereeCounts?.[m.referee] : undefined} />)}
        </Section>
      )}

      {/* Top scorers */}
      {topScorers.length > 0 && (
        <Section title={t(lang, 'home_top_scorers')} emoji="⚽" accent="teal">
          {topScorers.map((s, i) => {
            const scorerTeam = TEAMS_BY_FIFA_CODE[s.team_id]
            const isExpanded = expandedFact === s.player_name
            // Prefer a native Hebrew article when reading in Hebrew, but
            // fall back to the English one rather than showing nothing.
            const fact = (lang === 'he' ? s.fact_he : s.fact_en) ?? s.fact_en ?? s.fact_he
            return (
            <div key={s.player_name} className="py-2 border-b border-ink/10 last:border-0">
              <button
                onClick={() => fact && setExpandedFact(isExpanded ? null : s.player_name)}
                className="w-full flex items-center gap-3 text-start"
              >
                <div
                  className={`font-readout text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    MEDAL_STYLE[i] ?? 'text-starlight/40'
                  }`}
                >
                  {i + 1}
                </div>
                {s.photo_url && (
                  <img
                    src={s.photo_url}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-ink/10 flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
                <img
                  src={scorerTeam?.flag_url || ''}
                  alt=""
                  className="w-7 h-5 object-cover rounded shadow-sm flex-shrink-0"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{s.player_name}</div>
                  <div className="text-xs text-starlight/40">{getTeamName(scorerTeam?.id, lang)}</div>
                </div>
                <div className="font-readout text-teal text-lg flex-shrink-0">
                  {s.goals} ⚽
                </div>
                {fact && (
                  <span className="text-starlight/30 text-xs flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
                )}
              </button>
              {isExpanded && fact && (
                <p
                  dir={lang === 'he' && s.fact_he ? 'rtl' : 'ltr'}
                  className="text-xs text-starlight/60 leading-relaxed mt-2 pl-9"
                >
                  💡 {fact}
                </p>
              )}
            </div>
            )
          })}
        </Section>
      )}
      {matchesAttemptedAt && <UpdateAttemptTab attemptedAt={matchesAttemptedAt} />}
    </div>
  )
}

const MEDAL_STYLE: Record<number, string> = {
  0: 'bg-gold/20 text-gold',
  1: 'bg-starlight/15 text-starlight/80',
  2: 'bg-coral/20 text-coral',
}

const ACCENT_DOT: Record<string, string> = {
  gold: 'bg-gold',
  teal: 'bg-teal',
  violet: 'bg-violet',
  coral: 'bg-coral',
}

function Section({ title, emoji, accent, children }: { title: string; emoji: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-starlight text-base mb-2 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${ACCENT_DOT[accent]}`} />
        {emoji} {title}
      </h2>
      <div className="bg-spacelight rounded-2xl border border-ink/10 p-3">
        {children}
      </div>
    </div>
  )
}

function EmptyMsg({ text }: { text: string }) {
  return <p className="text-starlight/40 text-sm text-center py-3">{text}</p>
}
