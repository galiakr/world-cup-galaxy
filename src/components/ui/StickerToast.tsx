'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { STICKERS_BY_ID } from '@/data/stickers'
import { t } from '@/lib/i18n'

export default function StickerToast() {
  const { newStickerQueue, clearNewSticker, lang } = useAppStore()
  const stickerId = newStickerQueue[0]
  const sticker = stickerId ? STICKERS_BY_ID[stickerId] : null

  useEffect(() => {
    if (!sticker) return
    const timer = setTimeout(clearNewSticker, 3000)
    return () => clearTimeout(timer)
  }, [sticker, clearNewSticker])

  if (!sticker) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="flex flex-col items-center gap-3 p-6 rounded-3xl shadow-2xl animate-stickerPop pointer-events-auto"
        style={{
          background: `linear-gradient(145deg, ${sticker.color_from}, ${sticker.color_to})`,
          border: `3px solid rgba(255,255,255,0.6)`,
          minWidth: '200px',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-white/10 pointer-events-none" />

        <div className="text-6xl animate-bounce relative z-10">{sticker.emoji}</div>
        <div className="relative z-10 text-center">
          <div className="text-white font-black text-lg drop-shadow" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            {t(lang, 'toast_new_sticker')} 🎉
          </div>
          <div className="text-white/90 font-bold text-sm mt-1">
            {lang === 'he' ? sticker.name_he : sticker.name_en}
          </div>
          <div className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-black/20 text-white/80">
            {sticker.rarity === 'legend' ? '⭐ LEGEND' : sticker.rarity === 'epic' ? '💜 EPIC' : sticker.rarity === 'rare' ? '💙 RARE' : '📗 COMMON'}
          </div>
        </div>
      </div>
    </div>
  )
}
