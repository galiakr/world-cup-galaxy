'use client'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { format } from 'date-fns'

export default function StaleDataBanner({ updatedAt }: { updatedAt: string | null }) {
  const lang = useAppStore(s => s.lang)
  const time = updatedAt ? format(new Date(updatedAt), 'HH:mm') : null

  return (
    <div className="flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-2xl px-4 py-2.5 mb-4 text-xs text-starlight/70">
      <span>⚠️</span>
      <span>
        {t(lang, 'matches_stale_notice')}
        {time && <> · {t(lang, 'matches_stale_time')} {time}</>}
      </span>
    </div>
  )
}
