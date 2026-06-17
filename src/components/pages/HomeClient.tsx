'use client'
import { Match, TopScorer } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import MatchCard from '@/components/ui/MatchCard'
import { claimDailySticker, awardSticker } from '@/lib/supabase'

interface HomeClientProps {
  todayMatches: Match[]
  yesterdayMatches: Match[]
  tomorrowMatches: Match[]
  topScorers: TopScorer[]
}

export default function HomeClient({ todayMatches, yesterdayMatches, tomorrowMatches, topScorers }: HomeClientProps) {
  const { lang, user, dailyClaimedDate, setDailyClaimedDate, addSticker } = useAppStore()
  const isHe = lang === 'he'

  const today = new Date().toISOString().split('T')[0]
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
      {/* Hero */}
      <div className="relative bg-gray-900 rounded-3xl p-5 mb-4 overflow-hidden">
        <div className="absolute right-0 bottom-0 text-8xl opacity-10 pointer-events-none">⚽</div>
        <div className="font-fredoka text-yellow-400 text-2xl mb-1" style={{ fontFamily: 'Fredoka One, cursive' }}>
          🏆 {t(lang, 'app_name')}
        </div>
        <div className="text-blue-300 text-xs mb-4">{t(lang, 'tagline')}</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: '48', label: t(lang, 'home_teams') },
            { num: '104', label: t(lang, 'home_matches') },
            { num: String(daysLeft), label: t(lang, 'home_days_left') },
          ].map(({ num, label }) => (
            <div key={label} className="bg-white/10 rounded-2xl py-3 text-center">
              <div className="font-fredoka text-yellow-400 text-2xl" style={{ fontFamily: 'Fredoka One, cursive' }}>{num}</div>
              <div className="text-blue-200 text-[10px] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily sticker banner */}
      <button
        onClick={handleClaimDaily}
        disabled={dailyClaimed}
        className={`w-full flex items-center gap-4 rounded-2xl p-4 mb-4 text-left transition-all
          ${dailyClaimed
            ? 'bg-gray-200 opacity-60 cursor-default'
            : 'bg-gradient-to-r from-yellow-400 to-orange-400 active:scale-98 hover-lift'
          }`}
      >
        <div className="text-5xl">{dailyClaimed ? '✅' : '🎁'}</div>
        <div>
          <div className="font-fredoka text-gray-900 text-lg" style={{ fontFamily: 'Fredoka One, cursive' }}>
            {t(lang, 'home_daily_sticker')}
          </div>
          <div className="text-gray-700 text-xs mt-0.5">
            {dailyClaimed ? t(lang, 'home_daily_claimed') : t(lang, 'home_daily_sub')}
          </div>
        </div>
      </button>

      {/* Today's matches */}
      <Section title={t(lang, 'home_today')} emoji="📅">
        {todayMatches.length > 0
          ? todayMatches.map(m => <MatchCard key={m.id} match={m} compact />)
          : <EmptyMsg text={t(lang, 'home_no_matches')} />
        }
      </Section>

      {/* Yesterday's results */}
      {yesterdayMatches.length > 0 && (
        <Section title={t(lang, 'home_yesterday')} emoji="📊">
          {yesterdayMatches.map(m => <MatchCard key={m.id} match={m} compact />)}
        </Section>
      )}

      {/* Tomorrow */}
      {tomorrowMatches.length > 0 && (
        <Section title={t(lang, 'home_tomorrow')} emoji="🔮">
          {tomorrowMatches.map(m => <MatchCard key={m.id} match={m} compact />)}
        </Section>
      )}

      {/* Top scorers */}
      {topScorers.length > 0 && (
        <Section title={t(lang, 'home_top_scorers')} emoji="⚽">
          {topScorers.map((s, i) => (
            <div key={s.player_name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="font-fredoka text-gray-400 text-lg w-6 text-center" style={{ fontFamily: 'Fredoka One, cursive' }}>
                {i + 1}
              </div>
              <img
                src={s.team?.flag_url || ''}
                alt=""
                className="w-7 h-5 object-cover rounded shadow-sm"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <div className="flex-1">
                <div className="font-bold text-sm">{s.player_name}</div>
                <div className="text-xs text-gray-400">{isHe ? s.team?.name_he : s.team?.name_en}</div>
              </div>
              <div className="font-fredoka text-green-600 text-xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                {s.goals} ⚽
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-fredoka text-gray-800 text-lg mb-2 flex items-center gap-2" style={{ fontFamily: 'Fredoka One, cursive' }}>
        {emoji} {title}
      </h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
        {children}
      </div>
    </div>
  )
}

function EmptyMsg({ text }: { text: string }) {
  return <p className="text-gray-400 text-sm text-center py-3">{text}</p>
}
