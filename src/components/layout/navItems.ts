import type { TranslationKey } from '@/lib/i18n'

export const NAV_ITEMS: { href: string; icon: string; key: TranslationKey; color: string }[] = [
  { href: '/',         icon: '🛰️', key: 'nav_home',     color: '#FFB703' },
  { href: '/matches',  icon: '📅', key: 'nav_matches',  color: '#2BB673' },
  { href: '/teams',    icon: '🌍', key: 'nav_teams',    color: '#2BB673' },
  { href: '/quiz',     icon: '🧠', key: 'nav_quiz',     color: '#8C6BFF' },
  { href: '/stickers', icon: '⭐', key: 'nav_stickers', color: '#FFB703' },
  { href: '/predict',  icon: '🔮', key: 'nav_predict',  color: '#FF6F59' },
  { href: '/rules',    icon: '📖', key: 'nav_rules',    color: '#8C6BFF' },
  { href: '/report',   icon: '🐛', key: 'nav_report',   color: '#2BB673' },
]
