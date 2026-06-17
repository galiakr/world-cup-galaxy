'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'

const NAV_ITEMS = [
  { href: '/',        icon: '🏠', key: 'nav_home'     as const },
  { href: '/matches', icon: '📅', key: 'nav_matches'  as const },
  { href: '/teams',   icon: '🌍', key: 'nav_teams'    as const },
  { href: '/quiz',    icon: '🧠', key: 'nav_quiz'     as const },
  { href: '/stickers',icon: '⭐', key: 'nav_stickers' as const },
  { href: '/predict', icon: '🔮', key: 'nav_predict'  as const },
  { href: '/rules',   icon: '📖', key: 'nav_rules'    as const },
]

export default function BottomNav() {
  const pathname = usePathname()
  const lang = useAppStore(s => s.lang)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40">
      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors
                ${isActive
                  ? 'text-yellow-400 border-t-2 border-yellow-400'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[9px] font-bold leading-none mt-0.5">
                {t(lang, item.key)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
