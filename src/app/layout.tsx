import type { Metadata } from 'next'
import './globals.css'
import TopHeader from '@/components/layout/TopHeader'
import BottomNav from '@/components/layout/BottomNav'
import StickerToast from '@/components/ui/StickerToast'
import LoginGate from '@/components/pages/LoginGate'

export const metadata: Metadata = {
  title: 'World Cup 2026 Kids ⚽',
  description: 'World Cup 2026 app for kids — stickers, quizzes, predictions in Hebrew & English',
  manifest: '/manifest.json',
  themeColor: '#0D1B2A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-green-50 min-h-screen">
        <LoginGate>
          <TopHeader />
          <main className="max-w-lg mx-auto pb-24 min-h-screen">
            {children}
          </main>
          <BottomNav />
          <StickerToast />
        </LoginGate>
      </body>
    </html>
  )
}
