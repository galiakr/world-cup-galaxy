'use client'
import { useState, useEffect } from 'react'
import { AppUser } from '@/types'
import { useAppStore, wasProfileActivated } from '@/store'
import {
  createProfile, getUserByUsername, getMyLinkedProfiles, recoverProfile,
  awardSticker, ensureAnonSession, claimOrphanProfile,
} from '@/lib/supabase'
import { t } from '@/lib/i18n'

const AVATARS = ['🦁', '🦊', '🐯', '🦅', '🐉', '🦄', '🐬', '🦋', '🐺', '🦉']

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const { user, setUser, lang, setLang, addSticker, activateProfile } = useAppStore()
  const [mode, setMode] = useState<'signup' | 'recover'>('signup')
  const [selectedEmoji, setSelectedEmoji] = useState('🦁')
  const [name, setName] = useState('')
  const [recoverName, setRecoverName] = useState('')
  const [recoverCode, setRecoverCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Set once a new profile is created — shown once so the code can be
  // saved before the user is actually logged in.
  const [pendingUser, setPendingUser] = useState<AppUser | null>(null)
  const [pendingCode, setPendingCode] = useState<string | null>(null)

  // Runs on every app load when a session is already cached — not just
  // fresh logins. Without this, a returning user whose `user` was already
  // set from a previous visit would skip handleSignup/handleRecover (and
  // therefore the streak/daily-claim refresh) entirely, so the streak
  // shown in the header/stickers page would never advance past whatever
  // it was on day one. Also self-heals sessions cached from before
  // user_auth_links existed (no link → every write silently fails RLS).
  //
  // Skips activateProfile if this id was already activated this session
  // (e.g. by handleSignup/handleRecover/ProfileSwitcher just now, which
  // each call it explicitly) — otherwise this effect re-fires the moment
  // `user.id` changes and races claimDailySticker against itself, which
  // can award two different random stickers instead of one.
  useEffect(() => {
    if (!user) return
    ;(async () => {
      const authId = await ensureAnonSession()
      if (!authId) return
      const linked = await getMyLinkedProfiles()
      if (!linked.some(p => p.id === user.id)) await claimOrphanProfile(user.id)
      if (!wasProfileActivated(user.id)) await activateProfile(user)
    })()
  }, [user?.id])

  // Clears stale form state left over from a previous profile.
  useEffect(() => {
    if (user) return
    setMode('signup')
    setName('')
    setSelectedEmoji('🦁')
    setRecoverName('')
    setRecoverCode('')
    setError('')
  }, [user])

  if (user) return <>{children}</>

  async function handleSignup() {
    const trimmed = name.trim()
    if (!trimmed) { setError(t(lang, 'login_name_required')); return }
    setLoading(true)
    setError('')

    try {
      const authId = await ensureAnonSession()
      if (!authId) throw new Error('Failed to start session')

      const existing = await getUserByUsername(trimmed)
      if (existing) {
        const linked = await getMyLinkedProfiles()
        if (linked.some(p => p.id === existing.id)) {
          // Already one of this device's profiles — just continue.
          await activateProfile(existing)
        } else {
          setError(t(lang, 'login_name_taken'))
        }
        setLoading(false)
        return
      }

      const created = await createProfile(trimmed, selectedEmoji, lang)
      if (created === 'limit_reached') { setError(t(lang, 'switcher_limit_reached')); setLoading(false); return }
      if (!created) throw new Error('Failed to create profile')
      await awardSticker(created.user.id, 'a_welcome')
      addSticker('a_welcome')

      // Show the recovery code before actually logging in.
      setPendingUser(created.user)
      setPendingCode(created.recoveryCode)
    } catch (e) {
      console.error(e)
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  async function handleRecover() {
    const trimmedName = recoverName.trim()
    const trimmedCode = recoverCode.trim()
    if (!trimmedName || !trimmedCode) { setError(t(lang, 'login_name_required')); return }
    setLoading(true)
    setError('')

    try {
      const authId = await ensureAnonSession()
      if (!authId) throw new Error('Failed to start session')

      const recovered = await recoverProfile(trimmedName, trimmedCode)
      if (recovered === 'limit_reached') { setError(t(lang, 'switcher_limit_reached')); setLoading(false); return }
      if (!recovered) { setError(t(lang, 'login_recover_invalid')); setLoading(false); return }

      await activateProfile(recovered)
    } catch (e) {
      console.error(e)
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  const Stars = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-12 right-6 text-7xl opacity-90 animate-drift">🪐</div>
      <div className="absolute top-1/3 left-6 text-base text-gold animate-twinkle">✦</div>
      <div className="absolute bottom-1/3 right-10 text-sm text-teal animate-twinkle" style={{ animationDelay: '0.8s' }}>✧</div>
      <div className="absolute bottom-24 left-10 text-base text-violet animate-twinkle" style={{ animationDelay: '1.4s' }}>✦</div>
      <div className="absolute top-20 left-1/3 text-xs text-starlight animate-twinkle" style={{ animationDelay: '0.4s' }}>✧</div>
    </div>
  )

  // ── Recovery code interstitial — shown once, right after signup ──
  if (pendingUser && pendingCode) {
    return (
      <div className="fixed inset-0 bg-galaxy flex flex-col items-center justify-center px-6 py-8 z-50">
        {Stars}
        <div className="text-6xl mb-4 relative z-10">🔑</div>
        <div className="font-display text-gold text-2xl mb-2 text-center relative z-10">
          {t(lang, 'login_code_title')}
        </div>
        <p className="text-teal text-sm mb-6 text-center max-w-xs relative z-10">
          {t(lang, 'login_code_subtitle')}
        </p>
        <div className="font-readout text-3xl text-starlight bg-spacelight border-2 border-gold rounded-2xl px-6 py-4 mb-8 tracking-widest relative z-10">
          {pendingCode}
        </div>
        <button
          onClick={() => { const u = pendingUser!; setPendingUser(null); setPendingCode(null); activateProfile(u) }}
          className="w-full max-w-xs bg-gold text-starlight font-black text-xl rounded-2xl py-4
            active:scale-97 transition-transform relative z-10"
        >
          {t(lang, 'login_code_continue')}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-galaxy flex flex-col items-center justify-center px-6 py-8 z-50">
      {Stars}

      {/* Logo */}
      <div className="font-display text-gold text-4xl mb-2 text-center relative z-10">
        {t(lang, 'login_title')}
      </div>
      <div className="text-teal text-sm mb-8 text-center relative z-10">{t(lang, 'login_subtitle')}</div>

      {/* Lang toggle */}
      <div className="flex rounded-full border border-ink/20 overflow-hidden text-sm font-bold mb-8 relative z-10">
        <button onClick={() => setLang('he')} className={`px-5 py-2 transition-colors ${lang === 'he' ? 'bg-gold text-starlight' : 'text-starlight/50'}`}>
          עברית
        </button>
        <button onClick={() => setLang('en')} className={`px-5 py-2 transition-colors ${lang === 'en' ? 'bg-gold text-starlight' : 'text-starlight/50'}`}>
          English
        </button>
      </div>

      {mode === 'signup' ? (
        <>
          {/* Avatar picker */}
          <div className="flex flex-wrap gap-3 justify-center mb-6 max-w-xs relative z-10">
            {AVATARS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-14 h-14 rounded-2xl text-3xl transition-all
                  ${selectedEmoji === emoji
                    ? 'bg-gold/20 border-2 border-gold scale-110'
                    : 'bg-ink/5 border-2 border-transparent hover:border-ink/20'
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
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
            placeholder={t(lang, 'login_name_placeholder')}
            maxLength={16}
            className="w-full max-w-xs text-center text-xl font-bold bg-ink/5 border-2 border-ink/15
              text-starlight placeholder-starlight/30 rounded-2xl px-4 py-4 mb-3 focus:outline-none focus:border-gold
              transition-colors relative z-10"
            dir="auto"
          />

          {error && <p className="text-coral text-sm mb-3 text-center relative z-10">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full max-w-xs bg-gold text-starlight font-black text-xl rounded-2xl py-4
              disabled:opacity-60 active:scale-97 transition-transform mb-4 relative z-10"
          >
            {loading ? '...' : t(lang, 'login_btn')}
          </button>

          <p className="text-starlight/40 text-xs text-center max-w-xs mb-3 relative z-10">
            {t(lang, 'login_hint')}
          </p>

          <button
            onClick={() => { setMode('recover'); setError('') }}
            className="text-teal text-xs font-bold underline relative z-10"
          >
            {t(lang, 'login_recover_link')}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={recoverName}
            onChange={e => setRecoverName(e.target.value)}
            placeholder={t(lang, 'login_name_placeholder')}
            maxLength={16}
            className="w-full max-w-xs text-center text-xl font-bold bg-ink/5 border-2 border-ink/15
              text-starlight placeholder-starlight/30 rounded-2xl px-4 py-4 mb-3 focus:outline-none focus:border-gold
              transition-colors relative z-10"
            dir="auto"
          />
          <input
            type="text"
            value={recoverCode}
            onChange={e => setRecoverCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRecover()}
            placeholder={t(lang, 'login_recover_code_placeholder')}
            className="w-full max-w-xs text-center text-xl font-bold bg-ink/5 border-2 border-ink/15
              text-starlight placeholder-starlight/30 rounded-2xl px-4 py-4 mb-3 focus:outline-none focus:border-gold
              transition-colors relative z-10 font-readout tracking-widest"
            dir="ltr"
          />

          {error && <p className="text-coral text-sm mb-3 text-center relative z-10">{error}</p>}

          <button
            onClick={handleRecover}
            disabled={loading}
            className="w-full max-w-xs bg-gold text-starlight font-black text-xl rounded-2xl py-4
              disabled:opacity-60 active:scale-97 transition-transform mb-4 relative z-10"
          >
            {loading ? '...' : t(lang, 'login_recover_btn')}
          </button>

          <button
            onClick={() => { setMode('signup'); setError('') }}
            className="text-teal text-xs font-bold underline relative z-10"
          >
            {t(lang, 'login_recover_back')}
          </button>
        </>
      )}
    </div>
  )
}
