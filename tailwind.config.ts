import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // Bungee: a bold stadium-marquee/rubber-stamp display face — the
        // "Mission Passport" identity is built around things getting
        // officially stamped (countdown, finished matches, streaks), so
        // headings should look stamped/printed, not soft and rounded.
        display: ['Bungee', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // "Mission Passport" palette: a kid's World Cup passport/sticker
        // album that gets stamped as the tournament goes — paper, ink,
        // and a small set of stamp-ink colors, each with one job, rather
        // than four interchangeable pastel accents. Token names stay the
        // same as earlier passes so every existing class still resolves —
        // only the hex values (and in three cases, the role) change.
        space: '#F6EFE2',        // aged paper — page background
        spacelight: '#FFFDF8',   // paper card — barely-warm white
        starlight: '#221F1B',    // ink — warm near-black text
        ink: '#221F1B',
        gold: '#D69E2E',         // foil/stamp gold — rewards only (stickers, streak)
        coral: '#C0392B',        // stamp red — the one bold action color
        teal: '#2F6B4F',         // stamp green — finished/success states
        violet: '#5B7DA6',       // passport-cover denim — secondary accent
        sky: '#9DBFD9',          // pale denim wash — ambient/decorative only
      },
      keyframes: {
        stickerPop: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateX(-50%) translateY(20px)', opacity: '0' },
          to: { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        drift: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        stickerPop: 'stickerPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        slideUp: 'slideUp 0.3s ease forwards',
        twinkle: 'twinkle 2.4s ease-in-out infinite',
        drift: 'drift 3.6s ease-in-out infinite alternate',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      scale: {
        '97': '0.97',
        '98': '0.98',
      },
    },
  },
  plugins: [],
}

export default config
