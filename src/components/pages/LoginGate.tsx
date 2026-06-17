'use client'
import { useState } from 'react'
import { useAppStore } from '@/store'
import { createUser, getUserByUsername, updateStreak, awardSticker, claimDailySticker } from '@/lib/supabase'
import { t } from '@/lib/i18n'

const AVATARS = ['🦁', '🦊', '🐯', '🦅', '🐉', '🦄', '🐬', '🦋', '🐺', '🦉']

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const { user, setUser, lang, setLang, addSticker, setOwnedStickers, setDailyClaimedDate } = useAppStore()
  const [selectedEmoji, setSelectedEmoji] = useState('🦁')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <>{children}</>

  async function handleLogin() {
    const trimmed = name.trim()
    if (!trimmed) { setError(t(lang, 'login_name_required')); return }
    setLoading(true)
    setError('')

    try {
      // Try find existing user
      let appUser = await getUserByUsername(trimmed)

      if (!appUser) {
        // Create new user
        appUser = await createUser(trimmed, selectedEmoji, lang)
        if (!appUser) throw new Error('Failed to create user')
        // Welcome sticker
        await awardSticker(appUser.id, 'a_welcome')
        addSticker('a_welcome')
      } else {
        // Update avatar/lang if changed
      }

      // Update streak
      const { streak, isNew } = await updateStreak(appUser.id)
      appUser.streak_days = streak

      // Check streak stickers
      if (isNew) {
        if (streak >= 3) { await awardSticker(appUser.id, 'a_streak3'); addSticker('a_streak3') }
        if (streak >= 7) { await awardSticker(appUser.id, 'a_streak7'); addSticker('a_streak7') }
      }

      // Daily sticker
      const { claimed, stickerId } = await claimDailySticker(appUser.id)
      if (claimed && stickerId) {
        addSticker(stickerId)
        setDailyClaimedDate(new Date().toISOString().split('T')[0])
      }

      setUser(appUser)
    } catch (e) {
      console.error(e)
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center px-6 py-8 z-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 text-6xl opacity-10">⚽</div>
        <div className="absolute top-1/4 right-4 text-4xl opacity-10">🏆</div>
        <div className="absolute bottom-20 left-8 text-5xl opacity-10">🌍</div>
        <div className="absolute bottom-10 right-6 text-3xl opacity-10">🎯</div>
      </div>

      {/* Logo */}
      <div className="font-fredoka text-yellow-400 text-4xl mb-2 text-center" style={{ fontFamily: 'Fredoka One, cursive' }}>
        {t(lang, 'login_title')}
      </div>
      <div className="text-blue-300 text-sm mb-8 text-center">{t(lang, 'login_subtitle')}</div>

      {/* Lang toggle */}
      <div className="flex rounded-full border border-white/20 overflow-hidden text-sm font-bold mb-8">
        <button onClick={() => setLang('he')} className={`px-5 py-2 transition-colors ${lang === 'he' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300'}`}>
          עברית
        </button>
        <button onClick={() => setLang('en')} className={`px-5 py-2 transition-colors ${lang === 'en' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300'}`}>
          English
        </button>
      </div>

      {/* Avatar picker */}
      <div className="flex flex-wrap gap-3 justify-center mb-6 max-w-xs">
        {AVATARS.map(emoji => (
          <button
            key={emoji}
            onClick={() => setSelectedEmoji(emoji)}
            className={`w-14 h-14 rounded-2xl text-3xl transition-all
              ${selectedEmoji === emoji
                ? 'bg-yellow-400/30 border-2 border-yellow-400 scale-110'
                : 'bg-white/10 border-2 border-transparent hover:border-white/30'
              }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Name input */}
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
        placeholder={t(lang, 'login_name_placeholder')}
        maxLength={16}
        className="w-full max-w-xs text-center text-xl font-bold bg-white/10 border-2 border-white/20
          text-white placeholder-blue-300 rounded-2xl px-4 py-4 mb-3 focus:outline-none focus:border-yellow-400
          transition-colors"
        style={{ fontFamily: 'Fredoka One, cursive' }}
        dir="auto"
      />

      {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

      {/* Login button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full max-w-xs bg-yellow-400 text-gray-900 font-black text-xl rounded-2xl py-4
          disabled:opacity-60 active:scale-97 transition-transform mb-4"
        style={{ fontFamily: 'Fredoka One, cursive' }}
      >
        {loading ? '...' : t(lang, 'login_btn')}
      </button>

      <p className="text-blue-300/70 text-xs text-center max-w-xs">
        {t(lang, 'login_hint')}
      </p>
    </div>
  )
}
