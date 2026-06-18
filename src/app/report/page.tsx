'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { submitBugReport } from '@/lib/supabase'
import { BugReport } from '@/types'

export default function ReportPage() {
  const { lang, user, addSticker } = useAppStore()
  const [bugType, setBugType] = useState<BugReport['type'] | null>(null)
  const [description, setDescription] = useState('')
  const [sent, setSent] = useState(false)

  async function handleBugSubmit() {
    if (!description.trim()) { alert(t(lang, 'bug_empty')); return }
    await submitBugReport(user?.id, user?.username, bugType ?? 'other', description)
    if (user) addSticker('a_bug')
    setSent(true)
    setDescription('')
    setBugType(null)
  }

  const BUG_TYPES: { key: BugReport['type']; label: string }[] = [
    { key: 'wrong_info', label: t(lang, 'bug_type_wrong') },
    { key: 'technical',  label: t(lang, 'bug_type_tech') },
    { key: 'missing_info', label: t(lang, 'bug_type_missing') },
    { key: 'other',      label: t(lang, 'bug_type_other') },
  ]

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl text-starlight mb-4">
        🐛 {t(lang, 'bug_title')}
      </h1>

      <div className="bg-spacelight rounded-3xl border border-ink/10 p-4 mb-4">
        {sent ? (
          <div className="text-center text-teal font-bold py-4">{t(lang, 'bug_thanks')} 🎁</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {BUG_TYPES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setBugType(k => k === key ? null : key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors
                    ${bugType === key ? 'bg-teal text-starlight border-teal' : 'bg-ink/5 text-starlight/50 border-ink/10'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t(lang, 'bug_placeholder')}
              rows={3}
              dir="auto"
              className="w-full bg-ink/5 border border-ink/10 text-starlight placeholder-starlight/30 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-teal mb-3"
            />
            <button
              onClick={handleBugSubmit}
              className="w-full bg-teal text-starlight font-bold rounded-2xl py-3 text-sm active:scale-97"
            >
              {t(lang, 'bug_submit')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
