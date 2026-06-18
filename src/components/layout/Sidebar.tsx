'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { NAV_ITEMS } from './navItems'

// Desktop/tablet companion to BottomNav — a fixed left rail with icon +
// label rows instead of the phone-style bottom bar.
export default function Sidebar() {
  const pathname = usePathname()
  const lang = useAppStore(s => s.lang)

  return (
    <nav className="hidden lg:flex lg:flex-col w-56 flex-shrink-0 h-screen sticky top-0 bg-spacelight border-ink/10 ltr:border-r rtl:border-l py-6 px-3 gap-1">
      <Link href="/" className="font-display text-gold text-lg px-3 mb-4 flex items-center gap-2">
        <span className="text-xl">🪐</span> {t(lang, 'app_name')}
      </Link>
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-sm transition-colors"
            style={isActive ? { background: `${item.color}1A`, color: item.color } : undefined}
          >
            <span className={`text-xl leading-none ${isActive ? '' : 'opacity-60'}`}>{item.icon}</span>
            <span className={isActive ? '' : 'text-starlight/60'}>{t(lang, item.key)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
