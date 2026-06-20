'use client'
import { format } from 'date-fns'

// A small, low-key status tab — not a user-facing feature, just a
// quiet "is this actually still trying to refresh" signal. Shows when
// fetchMatches() last attempted a live fetch, whether or not it
// succeeded (a successful fetch and a fallback-to-cache both count as
// an attempt — see attemptedAt vs updatedAt in lib/api.ts).
export default function UpdateAttemptTab({ attemptedAt }: { attemptedAt: string }) {
  return (
    <div
      title="Last update attempt"
      className="fixed bottom-16 lg:bottom-2 right-2 z-30 bg-ink/30 text-starlight/40 text-[9px] px-2 py-1 rounded-full font-readout pointer-events-none select-none"
    >
      🔄 {format(new Date(attemptedAt), 'HH:mm:ss')}
    </div>
  )
}
