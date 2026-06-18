'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { NAV_ITEMS } from './navItems'

export default function BottomNav() {
  const pathname = usePathname()
  const lang = useAppStore(s => s.lang)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-space/95 backdrop-blur-sm border-t border-ink/10 z-40">
      {/* Console rail — a comet trail that docks under the active destination */}
      <div className="relative h-[2px] bg-ink/10">
        <div className="max-w-lg mx-auto h-full flex">
          {NAV_ITEMS.map(item => (
            <div key={item.href} className="flex-1 relative">
              {pathname === item.href && (
                <motion.div
                  layoutId="nav-rail"
                  className="absolute inset-x-2 top-0 h-[2px] rounded-full"
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="flex-1 relative flex flex-col items-center justify-center py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/30"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-label"
                  className="absolute bottom-full mb-1.5 px-2 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap text-starlight pointer-events-none"
                  style={{ background: item.color }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                >
                  {t(lang, item.key)}
                </motion.span>
              )}
              <span
                className="text-xl leading-none transition-all duration-200"
                style={{
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? 'translateY(-2px) scale(1.15)' : 'none',
                }}
              >
                {item.icon}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
