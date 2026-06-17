'use client'
import { useState } from 'react'
import { Match } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import MatchCard from '@/components/ui/MatchCard'
import { format } from 'date-fns'

interface MatchesClientProps {
  pastMatches: Match[]
  upcomingMatches: Match[]
}

type Tab = 'upcoming' | 'results' | 'all'

export default function MatchesClient({ pastMatches, upcomingMatches }: MatchesClientProps) {
  const lang = useAppStore(s => s.lang)
  const [tab, setTab] = useState<Tab>('upcoming')

  const allMatches = [...upcomingMatches, ...pastMatches].sort((a, b) =>
    a.match_date.localeCompare(b.match_date)
  )

  const displayed = tab === 'upcoming' ? upcomingMatches
    : tab === 'results' ? pastMatches
    : allMatches

  // Group by date
  const grouped = displayed.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.match_date
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  function dateLabel(dateStr: string) {
    if (dateStr === today) return t(lang, 'today')
    if (dateStr === yesterday) return t(lang, 'yesterday')
    if (dateStr === tomorrow) return t(lang, 'tomorrow')
    try { return format(new Date(dateStr), 'dd MMM yyyy') } catch { return dateStr }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: t(lang, 'matches_upcoming') },
    { key: 'results', label: t(lang, 'matches_results') },
    { key: 'all', label: t(lang, 'matches_all') },
  ]

  return (
    <div className="px-4 pt-4">
      <h1 className="font-fredoka text-2xl text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One, cursive' }}>
        📅 {t(lang, 'matches_title')}
      </h1>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white shadow-sm border border-gray-100 p-1 mb-4 gap-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors
              ${tab === key ? 'bg-gray-900 text-yellow-400' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grouped matches */}
      {Object.keys(grouped).sort().map(dateStr => (
        <div key={dateStr} className="mb-4">
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 px-1">
            {dateLabel(dateStr)}
          </div>
          {grouped[dateStr].map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      ))}

      {displayed.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <div className="text-4xl mb-3">⚽</div>
          <div>{t(lang, 'home_no_matches')}</div>
        </div>
      )}
    </div>
  )
}
