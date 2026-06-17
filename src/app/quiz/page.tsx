'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { getDailyQuestions } from '@/data/quiz'
import { saveQuizAnswer } from '@/lib/supabase'

export default function QuizPage() {
  const { lang, user, answeredToday, addAnswered, addSticker } = useAppStore()
  const questions = getDailyQuestions()
  const unanswered = questions.filter(q => !answeredToday.includes(q.id))

  const [currentIdx, setCurrentIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const current = unanswered[currentIdx]

  if (unanswered.length === 0) {
    return (
      <div className="px-4 pt-8 flex flex-col items-center text-center">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="font-fredoka text-2xl text-gray-800 mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
          {t(lang, 'quiz_done_today')}
        </h1>
        <div className="text-gray-400 text-sm">
          {t(lang, 'quiz_score')}: {score} / {questions.length}
        </div>
      </div>
    )
  }

  const opts = lang === 'he' ? current.options_he : current.options_en
  const question = lang === 'he' ? current.question_he : current.question_en
  const isCorrect = chosen === current.correct_index

  async function handleAnswer(idx: number) {
    if (chosen !== null) return
    setChosen(idx)
    setShowResult(true)
    const correct = idx === current.correct_index
    if (correct) setScore(s => s + 1)

    if (user) {
      await saveQuizAnswer(user.id, current.id, idx, correct, current.sticker_reward_id)
      if (correct && current.sticker_reward_id) {
        addSticker(current.sticker_reward_id)
      }
    }
    addAnswered(current.id)
  }

  function next() {
    setChosen(null)
    setShowResult(false)
    setCurrentIdx(i => i + 1)
  }

  const difficultyEmoji = current.difficulty === 'easy' ? '🟢' : current.difficulty === 'medium' ? '🟡' : '🔴'
  const progress = (currentIdx / unanswered.length) * 100

  return (
    <div className="px-4 pt-4">
      <h1 className="font-fredoka text-2xl text-gray-800 mb-2" style={{ fontFamily: 'Fredoka One, cursive' }}>
        🧠 {t(lang, 'quiz_title')}
      </h1>
      <p className="text-sm text-gray-400 mb-4">{t(lang, 'quiz_subtitle')}</p>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-gray-400 font-bold">{currentIdx + 1}/{unanswered.length}</span>
      </div>

      {/* Question card */}
      <div className="bg-gray-900 rounded-3xl p-5 mb-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">{difficultyEmoji}</span>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">{current.category}</span>
          {current.sticker_reward_id && (
            <span className="text-xs bg-yellow-400/20 text-yellow-400 font-bold px-2 py-0.5 rounded-full">
              🎁 {t(lang, 'stickers_count')}
            </span>
          )}
        </div>
        <p className="font-bold text-lg leading-snug">{question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-4">
        {opts.map((opt, i) => {
          let style = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-gray-400'
          if (chosen !== null) {
            if (i === current.correct_index) style = 'bg-green-500 border-green-500 text-white'
            else if (i === chosen && !isCorrect) style = 'bg-red-400 border-red-400 text-white'
            else style = 'bg-gray-100 border-gray-200 text-gray-400'
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
        <div className={`rounded-2xl p-4 mb-4 text-center font-fredoka text-xl ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}
          style={{ fontFamily: 'Fredoka One, cursive' }}>
          {isCorrect ? (
            <>
              {t(lang, 'quiz_correct')}
              {current.sticker_reward_id && <div className="text-sm font-bold text-yellow-600 mt-1">🎁 {t(lang, 'toast_new_sticker')}</div>}
            </>
          ) : (
            <>
              {t(lang, 'quiz_wrong')} <span className="text-green-600">{opts[current.correct_index]}</span>
            </>
          )}
        </div>
      )}

      {chosen !== null && (
        <button
          onClick={next}
          className="w-full bg-gray-900 text-yellow-400 font-fredoka text-lg rounded-2xl py-4 active:scale-97"
          style={{ fontFamily: 'Fredoka One, cursive' }}
        >
          {currentIdx + 1 < unanswered.length ? t(lang, 'quiz_next') : '🏆 Finish!'}
        </button>
      )}

      <div className="text-center text-xs text-gray-400 mt-4">
        {t(lang, 'quiz_earn')}
      </div>
    </div>
  )
}
