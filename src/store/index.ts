import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppUser, Language } from '@/types'

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
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      lang: 'he',
      setLang: (lang) => {
        set({ lang })
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang
          document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
        }
      },

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
