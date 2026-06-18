import type { Metadata } from 'next'
import './globals.css'
import TopHeader from '@/components/layout/TopHeader'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'
import LangSync from '@/components/layout/LangSync'
import StickerToast from '@/components/ui/StickerToast'
import LoginGate from '@/components/pages/LoginGate'

export const metadata: Metadata = {
  title: 'World Cup Galaxy 🌌⚽',
  description: 'World Cup 2026 app for kids — stickers, quizzes, predictions in Hebrew & English',
  manifest: '/manifest.json',
  themeColor: '#FFF8EC',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Varela+Round&family=Nunito:wght@400;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-galaxy min-h-screen">
        <LangSync />
        <LoginGate>
          <div className="lg:flex">
            <Sidebar />
            <div className="flex-1 lg:min-w-0">
              <TopHeader />
              <main className="max-w-lg lg:max-w-4xl mx-auto pb-24 lg:pb-10 min-h-screen">
                {children}
              </main>
            </div>
          </div>
          <BottomNav />
          <StickerToast />
        </LoginGate>
      </body>
    </html>
  )
}
