'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { getDailyQuestions, getQuizText } from '@/data/quiz'
import { saveQuizAnswer } from '@/lib/supabase'
import { STICKERS } from '@/data/stickers'

// Picks a random sticker the player doesn't already own, for questions
// that don't name a specific reward — so every correct answer earns
// something, not just the few questions with an explicit sticker_reward_id.
function pickFallbackReward(owned: string[]): string | undefined {
  const available = STICKERS.filter(s => s.rarity === 'common' && !owned.includes(s.id))
  if (available.length === 0) return undefined
  return available[Math.floor(Math.random() * available.length)].id
}

export default function QuizPage() {
  const { lang, user, answeredToday, addAnswered, addSticker, ownedStickers } = useAppStore()
  // Freeze the session's question list on mount — addAnswered() updates
  // answeredToday as soon as a question is answered (not on "Next"), so
  // re-deriving this from answeredToday on every render would shrink the
  // list out from under currentIdx mid-session and eventually index past
  // the end.
  const [unanswered] = useState(() => getDailyQuestions().filter(q => !answeredToday.includes(q.id)))

  const [currentIdx, setCurrentIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [awardedSticker, setAwardedSticker] = useState<string | null>(null)

  const current = unanswered[currentIdx]

  if (!current) {
    return (
      <div className="px-4 pt-8 flex flex-col items-center text-center">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="font-display text-2xl text-starlight mb-3">
          {t(lang, 'quiz_done_today')}
        </h1>
        <div className="text-starlight/40 text-sm">
          {t(lang, 'quiz_score')}: {score} / {unanswered.length}
        </div>
      </div>
    )
  }

  const currentText = getQuizText(current.id, lang)
  const opts = currentText.options
  const question = currentText.question
  const isCorrect = chosen === current.correct_index

  async function handleAnswer(idx: number) {
    if (chosen !== null) return
    setChosen(idx)
    setShowResult(true)
    const correct = idx === current.correct_index
    if (correct) setScore(s => s + 1)

    const rewardId = correct ? (current.sticker_reward_id ?? pickFallbackReward(ownedStickers)) : undefined
    if (rewardId) {
      // Award immediately (optimistic) so the toast shows right away,
      // not after the round-trip to save the answer.
      setAwardedSticker(rewardId)
      addSticker(rewardId)
    }

    if (user) {
      await saveQuizAnswer(user.id, current.id, idx, correct, rewardId)
    }
    addAnswered(current.id)
  }

  function next() {
    setChosen(null)
    setShowResult(false)
    setAwardedSticker(null)
    setCurrentIdx(i => i + 1)
  }

  const difficultyEmoji = current.difficulty === 'easy' ? '🟢' : current.difficulty === 'medium' ? '🟡' : '🔴'
  const progress = (currentIdx / unanswered.length) * 100

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl text-starlight mb-2">
        🧠 {t(lang, 'quiz_title')}
      </h1>
      <p className="text-sm text-starlight/40 mb-3">{t(lang, 'quiz_subtitle')}</p>

      {/* Difficulty legend — explains the colored dot shown on each question */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-starlight/50 font-bold">
        <span>🟢 {t(lang, 'quiz_difficulty_easy')}</span>
        <span>🟡 {t(lang, 'quiz_difficulty_medium')}</span>
        <span>🔴 {t(lang, 'quiz_difficulty_hard')}</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-ink/10 rounded-full overflow-hidden">
          <div className="h-full bg-violet rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-teal font-bold whitespace-nowrap">✅ {score}</span>
        <span className="text-xs text-starlight/40 font-bold">{currentIdx + 1}/{unanswered.length}</span>
      </div>

      {/* Question card */}
      <div className="bg-spacelight rounded-3xl p-5 mb-4 text-starlight border border-ink/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">{difficultyEmoji}</span>
          <span className="text-xs text-starlight/40 font-bold uppercase tracking-wide">{current.category}</span>
        </div>
        <p className="font-bold text-lg leading-snug">{question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-4">
        {opts.map((opt, i) => {
          let style = 'bg-spacelight border-2 border-ink/10 text-starlight hover:border-ink/30'
          if (chosen !== null) {
            if (i === current.correct_index) style = 'bg-teal border-teal text-starlight'
            else if (i === chosen && !isCorrect) style = 'bg-coral border-coral text-white'
            else style = 'bg-ink/5 border-ink/10 text-starlight/30'
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full text-start px-5 py-4 rounded-2xl font-bold text-base transition-all active:scale-98 ${style}`}
              dir="auto"
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Result */}
      {showResult && (
        <div className={`rounded-2xl p-4 mb-4 text-center font-display text-xl ${isCorrect ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'}`}>
          {isCorrect ? (
            <>
              {t(lang, 'quiz_correct')}
              {awardedSticker && <div className="text-sm font-bold text-gold mt-1">🎁 {t(lang, 'toast_new_sticker')}</div>}
            </>
          ) : (
            <>
              {t(lang, 'quiz_wrong')} <span className="text-teal">{opts[current.correct_index]}</span>
            </>
          )}
        </div>
      )}

      {chosen !== null && (
        <button
          onClick={next}
          className="w-full bg-violet text-white font-display text-lg rounded-2xl py-4 active:scale-97"
        >
          {currentIdx + 1 < unanswered.length ? t(lang, 'quiz_next') : t(lang, 'quiz_finish')}
        </button>
      )}

      <div className="text-center text-xs text-starlight/40 mt-4">
        {t(lang, 'quiz_earn')}
      </div>
    </div>
  )
}
