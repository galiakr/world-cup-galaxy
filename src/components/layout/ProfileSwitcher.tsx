'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AppUser } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { getMyLinkedProfiles, createProfile, awardSticker, DEVICE_PROFILE_LIMIT } from '@/lib/supabase'

const AVATARS = ['🦁', '🦊', '🐯', '🦅', '🐉', '🦄', '🐬', '🦋', '🐺', '🦉']

// Lets siblings sharing a device switch between their own profiles
// instantly (no recovery code — the device is already linked to each
// profile it's switched to before), and add a new one from the same panel.
export default function ProfileSwitcher() {
  const { user, lang, activateProfile } = useAppStore()
  const [open, setOpen] = useState(false)
  const [profiles, setProfiles] = useState<AppUser[]>([])
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🦁')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingProfile, setPendingProfile] = useState<AppUser | null>(null)
  const [pendingCode, setPendingCode] = useState<string | null>(null)

  useEffect(() => {
    if (open) getMyLinkedProfiles().then(setProfiles)
  }, [open])

  if (!user) return null

  function closeAndReset() {
    setOpen(false)
    setAdding(false)
    setName('')
    setAvatar('🦁')
    setError('')
    setPendingProfile(null)
    setPendingCode(null)
  }

  async function switchTo(profile: AppUser) {
    if (profile.id === user!.id) { closeAndReset(); return }
    closeAndReset()
    await activateProfile(profile)
  }

  async function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) { setError(t(lang, 'login_name_required')); return }
    setLoading(true)
    setError('')

    const created = await createProfile(trimmed, avatar, lang)
    if (created === 'limit_reached') { setError(t(lang, 'switcher_limit_reached')); setLoading(false); return }
    if (!created) { setError(t(lang, 'switcher_add_error')); setLoading(false); return }
    await awardSticker(created.user.id, 'a_welcome')

    setPendingProfile(created.user)
    setPendingCode(created.recoveryCode)
    setLoading(false)
  }

  async function confirmNewProfile() {
    if (!pendingProfile) return
    const profile = pendingProfile
    closeAndReset()
    await activateProfile(profile)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={t(lang, 'switcher_open')}
        aria-label={t(lang, 'switcher_open')}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-ink/5 border border-ink/10 text-sm hover:bg-ink/10 transition-colors"
      >
        👥
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 bg-ink/40 z-50 flex items-end justify-center"
          onClick={closeAndReset}
        >
          <div
            className="bg-spacelight rounded-t-3xl w-full max-w-lg p-5 pb-8 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 bg-ink/15 rounded-full" />
            </div>

            {pendingProfile && pendingCode ? (
              <div className="text-center">
                <div className="text-5xl mb-3">🔑</div>
                <div className="font-display text-gold text-xl mb-2">{t(lang, 'login_code_title')}</div>
                <p className="text-starlight/60 text-sm mb-4">{t(lang, 'login_code_subtitle')}</p>
                <div className="font-readout text-2xl bg-space border-2 border-gold rounded-2xl px-4 py-3 mb-4 tracking-widest">
                  {pendingCode}
                </div>
                <button
                  onClick={confirmNewProfile}
                  className="w-full bg-gold text-starlight font-black rounded-2xl py-3 active:scale-97"
                >
                  {t(lang, 'login_code_continue')}
                </button>
              </div>
            ) : adding ? (
              <>
                <h2 className="font-display text-lg text-starlight mb-3">{t(lang, 'switcher_add_title')}</h2>
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {AVATARS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`w-12 h-12 rounded-xl text-2xl transition-all
                        ${avatar === emoji ? 'bg-gold/20 border-2 border-gold scale-110' : 'bg-ink/5 border-2 border-transparent'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder={t(lang, 'login_name_placeholder')}
                  maxLength={16}
                  dir="auto"
                  className="w-full text-center text-lg font-bold bg-ink/5 border-2 border-ink/15 text-starlight placeholder-starlight/30 rounded-2xl px-4 py-3 mb-3 focus:outline-none focus:border-gold"
                />
                {error && <p className="text-coral text-sm mb-2 text-center">{error}</p>}
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="w-full bg-gold text-starlight font-black rounded-2xl py-3 mb-2 disabled:opacity-60 active:scale-97"
                >
                  {loading ? '...' : t(lang, 'switcher_add_confirm')}
                </button>
                <button onClick={() => setAdding(false)} className="w-full text-starlight/50 text-xs py-1">
                  {t(lang, 'login_recover_back')}
                </button>
              </>
            ) : (
              <>
                <h2 className="font-display text-lg text-starlight mb-3">{t(lang, 'switcher_title')}</h2>
                <div className="flex flex-col gap-2 mb-4">
                  {profiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => switchTo(p)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors text-left
                        ${p.id === user!.id ? 'border-gold bg-gold/10' : 'border-ink/10 bg-ink/5 hover:border-ink/20'}`}
                    >
                      <span className="text-2xl">{p.avatar_emoji}</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-starlight">{p.username}</div>
                        <div className="text-xs text-starlight/40">🔥 {p.streak_days} {t(lang, 'home_streak')}</div>
                      </div>
                      {p.id === user!.id && (
                        <span className="text-gold text-[10px] font-bold uppercase">{t(lang, 'switcher_active')}</span>
                      )}
                    </button>
                  ))}
                </div>
                {profiles.length >= DEVICE_PROFILE_LIMIT ? (
                  <p className="text-starlight/40 text-xs text-center">{t(lang, 'switcher_limit_reached')}</p>
                ) : (
                  <button
                    onClick={() => setAdding(true)}
                    className="w-full bg-teal text-starlight font-bold rounded-2xl py-3 active:scale-97"
                  >
                    ➕ {t(lang, 'switcher_add_title')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
