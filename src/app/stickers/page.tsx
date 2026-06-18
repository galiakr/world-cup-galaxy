'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { STICKERS, RARITY_COLORS } from '@/data/stickers'
import { StickerCategory } from '@/types'
import StickerCard from '@/components/ui/StickerCard'

type Filter = StickerCategory | 'all'

const RARITIES = ['common', 'rare', 'epic', 'legend'] as const

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
      <h1 className="font-display text-2xl text-starlight mb-4">
        🌌 {t(lang, 'stickers_title')}
      </h1>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-gold/15 to-violet/10 border-2 border-gold/40 rounded-3xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-5xl">{user?.avatar_emoji ?? '🦁'}</div>
          <div>
            <div className="font-display text-xl text-starlight">
              {user?.username}
            </div>
            <div className="text-sm text-starlight/60">
              {totalOwned} / {STICKERS.length} {t(lang, 'stickers_count')}
            </div>
            <div className="text-xs text-teal font-bold mt-0.5">
              🔥 {user?.streak_days ?? 1} {t(lang, 'home_streak')}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-3 bg-ink/10 rounded-full overflow-hidden border border-ink/10">
          <div
            className="h-full bg-gradient-to-r from-teal to-gold rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-xs text-starlight/40 text-center mt-1">
          {pct}% — {STICKERS.length - totalOwned} {t(lang, 'stickers_progress')}
        </div>
      </div>

      {/* Rarity guide */}
      <div className="bg-spacelight rounded-3xl border border-ink/10 p-4 mb-4">
        <h2 className="font-display text-base text-starlight mb-1">
          ✨ {t(lang, 'stickers_guide_title')}
        </h2>
        <p className="text-xs text-starlight/40 mb-3">{t(lang, 'stickers_guide_text')}</p>
        <div className="flex flex-col gap-2">
          {RARITIES.map(rarity => (
            <div key={rarity} className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ background: RARITY_COLORS[rarity].border, boxShadow: `0 0 8px ${RARITY_COLORS[rarity].glow}` }}
              />
              <div>
                <div className="text-xs font-bold text-starlight">{t(lang, `rarity_${rarity}`)}</div>
                <div className="text-[11px] text-starlight/40">{t(lang, `rarity_${rarity}_desc`)}</div>
              </div>
            </div>
          ))}
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
                ? 'bg-gold text-starlight border-gold'
                : 'bg-ink/5 text-starlight/50 border-ink/10 hover:border-ink/30'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Star chart grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3 pb-4">
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
