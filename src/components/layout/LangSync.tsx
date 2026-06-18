'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/store'

// Keeps <html lang>/<html dir> in sync with the store's language —
// including on first load, once zustand's persist middleware rehydrates
// the saved language from localStorage (the static markup in layout.tsx
// always starts as he/rtl, since that's only known on the client).
export default function LangSync() {
  const lang = useAppStore(s => s.lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
  }, [lang])

  return null
}
