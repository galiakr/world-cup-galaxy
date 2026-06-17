import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka One', 'cursive'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        grass: '#2D9E47',
        gold: '#F5C842',
        night: '#0D1B2A',
        sky: '#1A6FBF',
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
      },
      animation: {
        stickerPop: 'stickerPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        slideUp: 'slideUp 0.3s ease forwards',
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
