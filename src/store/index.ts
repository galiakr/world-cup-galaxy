import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppUser, Language } from '@/types'
import { updateStreak, awardSticker, claimDailySticker, getUserStickers, getAnsweredQuestions } from '@/lib/supabase'
import { israelDateString } from '@/lib/date'

// Runtime-only (not persisted) dedupe so activateProfile's network calls
// — especially claimDailySticker — don't run twice for the same profile
// in the same tab session. Without this, a fresh signup/recovery/switch
// (which calls activateProfile explicitly) combined with LoginGate's
// self-heal effect (which also calls it whenever `user.id` changes) could
// race claimDailySticker's check-then-insert and award two different
// random stickers instead of one.
const activatedProfileIds = new Set<string>()
export function wasProfileActivated(id: string): boolean {
  return activatedProfileIds.has(id)
}

interface AppState {
  // Auth
  user: AppUser | null
  setUser: (user: AppUser | null) => void

  // Language
  lang: Language
  setLang: (lang: Language) => void

  // Stickers owned (IDs)
  ownedStickers: string[]
  setOwnedStickers: (ids: string[]) => void
  addSticker: (id: string) => void

  // New sticker animation queue
  newStickerQueue: string[]
  addNewSticker: (id: string) => void
  clearNewSticker: () => void

  // Daily sticker claimed today
  dailyClaimedDate: string | null
  setDailyClaimedDate: (date: string) => void

  // Quiz answers answered today (question IDs)
  answeredToday: string[]
  addAnswered: (id: string) => void

  // Active page (for nav highlight)
  activePage: string
  setActivePage: (page: string) => void

  // The single entry point for "this profile is now the active one on
  // this device" — used for a fresh signup/recovery *and* for instantly
  // switching between profiles already linked to this device. Loads that
  // profile's own stickers/answered-questions/daily-claim state (instead
  // of carrying over whichever profile was active before) and runs the
  // same streak/daily-sticker bookkeeping as a normal day's first visit.
  activateProfile: (profile: AppUser) => Promise<void>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      lang: 'he',
      // document.documentElement.lang/dir are kept in sync by <LangSync>,
      // which reacts to this value on every change — including on initial
      // load, once persisted state rehydrates from localStorage.
      setLang: (lang) => set({ lang }),

      ownedStickers: [],
      setOwnedStickers: (ids) => set({ ownedStickers: ids }),
      addSticker: (id) => {
        const current = get().ownedStickers
        if (!current.includes(id)) {
          set({ ownedStickers: [...current, id] })
          get().addNewSticker(id)
        }
      },

      newStickerQueue: [],
      addNewSticker: (id) => set(s => ({ newStickerQueue: [...s.newStickerQueue, id] })),
      clearNewSticker: () => set(s => ({ newStickerQueue: s.newStickerQueue.slice(1) })),

      dailyClaimedDate: null,
      setDailyClaimedDate: (date) => set({ dailyClaimedDate: date }),

      answeredToday: [],
      addAnswered: (id) => set(s => ({ answeredToday: [...s.answeredToday, id] })),

      activePage: 'home',
      setActivePage: (page) => set({ activePage: page }),

      activateProfile: async (profile) => {
        activatedProfileIds.add(profile.id)
        set({ user: profile, newStickerQueue: [] })

        const [{ streak, isNew }, stickers, answered] = await Promise.all([
          updateStreak(profile.id),
          getUserStickers(profile.id),
          getAnsweredQuestions(profile.id),
        ])
        set({ ownedStickers: stickers, answeredToday: answered })
        if (streak !== profile.streak_days) {
          set(s => ({ user: s.user?.id === profile.id ? { ...s.user, streak_days: streak } : s.user }))
        }

        if (isNew) {
          if (streak >= 3) { await awardSticker(profile.id, 'a_streak3'); get().addSticker('a_streak3') }
          if (streak >= 7) { await awardSticker(profile.id, 'a_streak7'); get().addSticker('a_streak7') }
        }

        const { claimed, stickerId } = await claimDailySticker(profile.id)
        if (claimed && stickerId) get().addSticker(stickerId)
        set({ dailyClaimedDate: israelDateString() })
      },
    }),
    {
      name: 'worldcup-kids-store',
      partialize: (state) => ({
        user: state.user,
        lang: state.lang,
        ownedStickers: state.ownedStickers,
        dailyClaimedDate: state.dailyClaimedDate,
        answeredToday: state.answeredToday,
      }),
    }
  )
)
