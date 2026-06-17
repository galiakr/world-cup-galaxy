'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { submitBugReport } from '@/lib/supabase'
import { BugReport } from '@/types'

const RULES = [
  { emoji: '👥', titleKey: 'rule_players_title' as const, textKey: 'rule_players_text' as const },
  { emoji: '⏱️', titleKey: 'rule_time_title'    as const, textKey: 'rule_time_text'    as const },
  { emoji: '🟨', titleKey: 'rule_cards_title'   as const, textKey: 'rule_cards_text'   as const },
  { emoji: '🚩', titleKey: 'rule_offside_title' as const, textKey: 'rule_offside_text' as const },
  { emoji: '🎯', titleKey: 'rule_penalty_title' as const, textKey: 'rule_penalty_text' as const },
  { emoji: '🔄', titleKey: 'rule_subs_title'    as const, textKey: 'rule_subs_text'    as const },
  { emoji: '🏆', titleKey: 'rule_win_title'     as const, textKey: 'rule_win_text'     as const },
]

const FACTS = ['fact_1', 'fact_2', 'fact_3'] as const

export default function RulesPage() {
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
      <h1 className="font-fredoka text-2xl text-gray-800 mb-4" style={{ fontFamily: 'Fredoka One, cursive' }}>
        📖 {t(lang, 'rules_title')}
      </h1>

      {/* Rules */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-4">
        {RULES.map(({ emoji, titleKey, textKey }, i) => (
          <div key={i} className={`flex gap-3 py-3 ${i < RULES.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="text-3xl w-10 text-center flex-shrink-0">{emoji}</div>
            <div>
              <div className="font-bold text-sm mb-1">{t(lang, titleKey)}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{t(lang, textKey)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fun facts */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-4 mb-4">
        <h2 className="font-fredoka text-lg text-gray-800 mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
          🌟 {t(lang, 'rules_facts')}
        </h2>
        {FACTS.map(key => (
          <div key={key} className="flex gap-2 mb-2 text-sm text-gray-700">
            <span>{t(lang, key)}</span>
          </div>
        ))}
      </div>

      {/* Bug report */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="font-fredoka text-lg text-gray-800 mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
          🐛 {t(lang, 'bug_title')}
        </h2>

        {sent ? (
          <div className="text-center text-green-600 font-bold py-4">{t(lang, 'bug_thanks')} 🎁</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {BUG_TYPES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setBugType(k => k === key ? null : key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors
                    ${bugType === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
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
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400 mb-3"
            />
            <button
              onClick={handleBugSubmit}
              className="w-full bg-blue-600 text-white font-bold rounded-2xl py-3 text-sm active:scale-97"
            >
              {t(lang, 'bug_submit')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
