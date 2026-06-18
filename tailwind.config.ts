import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Varela Round', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Daytime "cartoon space meets soccer pitch" palette. Token names
        // stay the same as the old dark theme (space/spacelight/starlight)
        // so every existing bg-space/text-starlight class still resolves
        // correctly — only their roles flip: space/spacelight go from dark
        // backgrounds to light ones, starlight goes from light text to ink.
        space: '#FFF8EC',
        spacelight: '#FFFFFF',
        starlight: '#241F4D',
        ink: '#241F4D',
        gold: '#FFB703',
        coral: '#FF6F59',
        violet: '#8C6BFF',
        teal: '#2BB673',
        sky: '#4CC9F0',
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
