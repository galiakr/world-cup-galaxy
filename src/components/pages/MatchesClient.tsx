'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Match } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import MatchCard from '@/components/ui/MatchCard'
import StaleDataBanner from '@/components/ui/StaleDataBanner'
import { format } from 'date-fns'
import { israelDateString } from '@/lib/date'

// Leaflet touches `window` on import, so it can't render on the server.
const StadiumsMap = dynamic(() => import('@/components/ui/StadiumsMap'), { ssr: false })

interface MatchesClientProps {
  pastMatches: Match[]
  upcomingMatches: Match[]
  matchesError?: boolean
  matchesStale?: boolean
  matchesUpdatedAt?: string | null
}

type Tab = 'upcoming' | 'results'

export default function MatchesClient({ pastMatches, upcomingMatches, matchesError, matchesStale, matchesUpdatedAt }: MatchesClientProps) {
  const lang = useAppStore(s => s.lang)
  const [tab, setTab] = useState<Tab>('upcoming')
  const [showMap, setShowMap] = useState(false)

  const displayed = tab === 'upcoming' ? upcomingMatches : pastMatches

  // Group by date
  const grouped = displayed.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.match_date
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  const today = israelDateString()
  const yesterday = israelDateString(-1)
  const tomorrow = israelDateString(1)

  function dateLabel(dateStr: string) {
    if (dateStr === today) return t(lang, 'today')
    if (dateStr === yesterday) return t(lang, 'yesterday')
    if (dateStr === tomorrow) return t(lang, 'tomorrow')
    try { return format(new Date(dateStr), 'dd MMM yyyy') } catch { return dateStr }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: t(lang, 'matches_upcoming') },
    { key: 'results', label: t(lang, 'matches_results') },
  ]

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl text-starlight mb-4">
        🛰️ {t(lang, 'matches_title')}
      </h1>

      {matchesStale && <StaleDataBanner updatedAt={matchesUpdatedAt ?? null} />}

      {/* Stadium map */}
      <button
        onClick={() => setShowMap(s => !s)}
        className="w-full flex items-center justify-center gap-2 bg-spacelight border border-ink/10 rounded-2xl py-2.5 mb-4 text-sm font-bold text-starlight/70 hover:text-starlight transition-colors"
      >
        🗺️ {t(lang, 'matches_map_toggle')} {showMap ? '▲' : '▼'}
      </button>
      {showMap && (
        <div className="mb-4">
          <StadiumsMap />
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-2xl bg-spacelight border border-ink/10 p-1 mb-4 gap-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors
              ${tab === key ? 'bg-teal text-starlight' : 'text-starlight/50 hover:text-starlight'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grouped matches */}
      {Object.keys(grouped).sort().map(dateStr => (
        <div key={dateStr} className="mb-4">
          <div className="text-xs font-black text-teal uppercase tracking-wider mb-2 px-1">
            {dateLabel(dateStr)}
          </div>
          {grouped[dateStr].map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      ))}

      {displayed.length === 0 && (
        <div className="text-center text-starlight/40 py-12">
          <div className="text-4xl mb-3">🛰️</div>
          <div>{t(lang, matchesError ? 'matches_load_error' : 'home_no_matches')}</div>
        </div>
      )}
    </div>
  )
}
