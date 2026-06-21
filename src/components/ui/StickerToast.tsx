'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { STICKERS_BY_ID, RARITY_COLORS, getStickerText } from '@/data/stickers'
import { t, TranslationKey } from '@/lib/i18n'

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

  const rarity = RARITY_COLORS[sticker.rarity]

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
      <div className="flex flex-col items-center pointer-events-auto animate-stickerPop" style={{ minWidth: 240 }}>
        {/* Colorful sticker face — kept big and bold, no text relies on it for contrast */}
        <div
          className="w-44 h-44 rounded-[2rem] shadow-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${sticker.color_from}, ${sticker.color_to})`,
            border: '4px solid rgba(255,255,255,0.7)',
            boxShadow: `0 0 24px ${rarity.glow}, 0 12px 28px rgba(0,0,0,0.35)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/15 pointer-events-none" />
          <div className="text-8xl relative z-10 animate-bounce">{sticker.emoji}</div>
        </div>

        {/* Text card — always light/dark-ink, so it reads clearly no matter
            how light or dark this particular sticker's own colors are */}
        <div className="bg-spacelight rounded-2xl shadow-xl border border-ink/10 px-6 py-4 -mt-5 text-center min-w-[230px] relative z-10">
          <div className="text-gold font-display text-base">🌟 {t(lang, 'toast_new_sticker')}</div>
          <div className="text-starlight font-bold text-xl mt-1">
            {getStickerText(sticker.id, lang).name}
          </div>
          <div
            className="mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `${rarity.border}26`, color: rarity.border }}
          >
            {t(lang, `rarity_${sticker.rarity}` as TranslationKey)}
          </div>
        </div>
      </div>
    </div>
  )
}
