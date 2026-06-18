'use client'
import { StickerDefinition, StickerRarity } from '@/types'
import { RARITY_COLORS } from '@/data/stickers'
import { t } from '@/lib/i18n'
import { useAppStore } from '@/store'
import { useState } from 'react'

interface StickerCardProps {
  sticker: StickerDefinition
  owned: boolean
  isNew?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function StickerCard({ sticker, owned, isNew, size = 'md', onClick }: StickerCardProps) {
  const lang = useAppStore(s => s.lang)
  const [showTooltip, setShowTooltip] = useState(false)
  const rarity = RARITY_COLORS[sticker.rarity]

  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-28 h-28 text-4xl',
  }

  const labelSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-xs',
  }

  if (!owned) {
    return (
      <div
        className={`relative ${sizes[size]} rounded-full flex flex-col items-center justify-center cursor-pointer select-none
          bg-ink/[0.03] border border-dashed border-ink/15`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-lg text-starlight/15">✦</span>
        <span className={`${labelSizes[size]} text-starlight/20 font-bold mt-1 text-center leading-tight px-1`}>
          {t(lang, 'stickers_locked')}
        </span>
        {showTooltip && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-space border border-ink/10 text-starlight text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50 max-w-48 text-center leading-tight">
            {lang === 'he' ? sticker.unlock_condition_he : sticker.unlock_condition}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`relative ${sizes[size]} rounded-full flex flex-col items-center justify-center cursor-pointer select-none
        overflow-hidden transition-transform active:scale-95 hover:scale-105
        ${isNew ? 'animate-stickerPop' : ''}`}
      style={{
        background: `linear-gradient(145deg, ${sticker.color_from}, ${sticker.color_to})`,
        border: `2px solid ${rarity.border}`,
        boxShadow: `0 0 14px ${rarity.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
      }}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink/40 via-transparent to-ink/10 pointer-events-none" />
      {/* Shine streak */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-ink/20 to-transparent pointer-events-none" />
      {/* Inner border */}
      <div className="absolute inset-0 rounded-full border border-ink/40 pointer-events-none" />

      {/* Rarity badge */}
      <div
        className="absolute top-1 right-1 text-sm leading-none font-black px-1.5 py-1 rounded-full"
        style={{ background: 'rgba(0,0,0,0.35)', color: '#fff', letterSpacing: '0.3px' }}
      >
        {sticker.rarity === 'common' ? '🤍' : sticker.rarity === 'rare' ? '💙' : sticker.rarity === 'epic' ? '💜' : '⭐'}
      </div>

      {/* NEW badge */}
      {isNew && (
        <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[7px] font-black px-1 rounded animate-pulse">
          NEW!
        </div>
      )}

      {/* Content */}
      <span className={`${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl'} relative z-10`}>
        {sticker.emoji}
      </span>
      <span
        className={`${labelSizes[size]} font-extrabold mt-1 text-center leading-tight px-1 relative z-10`}
        style={{ color: sticker.text_color, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
      >
        {lang === 'he' ? sticker.name_he : sticker.name_en}
      </span>

      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-space border border-ink/10 text-starlight text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50 text-center">
          {lang === 'he' ? sticker.name_he : sticker.name_en}
        </div>
      )}
    </div>
  )
}
