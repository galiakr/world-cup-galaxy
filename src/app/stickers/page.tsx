'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { STICKERS } from '@/data/stickers'
import { StickerCategory } from '@/types'
import StickerCard from '@/components/ui/StickerCard'

type Filter = StickerCategory | 'all'

export default function StickersPage() {
  const { lang, user, ownedStickers } = useAppStore()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? STICKERS : STICKERS.filter(s => s.category === filter)
  const totalOwned = ownedStickers.length
  const pct = Math.round((totalOwned / STICKERS.length) * 100)

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',         label: t(lang, 'stickers_categories') },
    { key: 'country',     label: t(lang, 'stickers_country') },
    { key: 'player',      label: t(lang, 'stickers_player') },
    { key: 'moment',      label: t(lang, 'stickers_moment') },
    { key: 'achievement', label: t(lang, 'stickers_achievement') },
  ]

  return (
    <div className="px-4 pt-4">
      <h1 className="font-fredoka text-2xl text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One, cursive' }}>
        ⭐ {t(lang, 'stickers_title')}
      </h1>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-5xl">{user?.avatar_emoji ?? '🦁'}</div>
          <div>
            <div className="font-fredoka text-xl text-gray-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
              {user?.username}
            </div>
            <div className="text-sm text-gray-500">
              {totalOwned} / {STICKERS.length} {t(lang, 'stickers_count')}
            </div>
            <div className="text-xs text-green-600 font-bold mt-0.5">
              🔥 {user?.streak_days ?? 1} {t(lang, 'home_streak')}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-3 bg-white rounded-full overflow-hidden border border-yellow-200">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">
          {pct}% — {STICKERS.length - totalOwned} {t(lang, 'stickers_progress')}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors border
              ${filter === key
                ? 'bg-gray-900 text-yellow-400 border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sticker grid */}
      <div className="grid grid-cols-4 gap-3 pb-4">
        {filtered.map(sticker => (
          <div key={sticker.id} className="flex flex-col items-center">
            <StickerCard
              sticker={sticker}
              owned={ownedStickers.includes(sticker.id)}
              size="md"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
