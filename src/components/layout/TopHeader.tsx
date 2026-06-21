'use client';
import { useAppStore } from '@/store';
import { t } from '@/lib/i18n';
import ProfileSwitcher from './ProfileSwitcher';
import Link from 'next/link';

export default function TopHeader() {
  const { lang, setLang, user } = useAppStore();

  return (
    <header className="sticky top-0 z-40 bg-space/90 backdrop-blur-sm text-starlight px-4 py-3 relative">
      <div className="max-w-lg lg:max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex flex-col justify-center items-center">
          <Link
            href="/"
            className="font-display text-gold text-base leading-tight flex items-center gap-1.5"
          >
            <span className="text-lg">🪐</span> {t(lang, 'app_name')}{' '}
            <span className="text-lg">🪐</span>
          </Link>
          <a
            href="https://www.linkedin.com/in/galiakr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-starlight/30 hover:text-teal transition-colors mt-0.5"
          >
            {t(lang, 'credit_by')} Galia Kropach
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex rounded-full border border-ink/15 overflow-hidden text-xs font-bold">
            <button
              onClick={() => setLang('he')}
              className={`px-3 py-1 transition-colors ${lang === 'he' ? 'bg-gold text-starlight' : 'text-starlight/50 hover:text-starlight'}`}
            >
              עב
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 transition-colors ${lang === 'en' ? 'bg-gold text-starlight' : 'text-starlight/50 hover:text-starlight'}`}
            >
              EN
            </button>
          </div>

          {/* User chip */}
          {user && (
            <Link
              href="/stickers"
              className="flex items-center gap-2 bg-ink/5 border border-ink/10 rounded-full px-3 py-1"
            >
              <span className="text-lg">{user.avatar_emoji}</span>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-starlight leading-none">
                  {user.username}
                </div>
                <div className="text-[10px] text-gold font-bold leading-none mt-0.5">
                  🔥 {user.streak_days} {t(lang, 'home_streak')}
                </div>
              </div>
            </Link>
          )}

          <ProfileSwitcher />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </header>
  );
}
