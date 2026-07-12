'use client'
import { useEffect } from 'react'

// Registers public/sw.js on mount. This — plus a valid, reachable
// manifest.json with icons — is what lets Chrome on Android (and other
// browsers) treat the app as installable and offer the "Add to Home
// Screen" / install prompt.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service worker registration failed:', err)
      })
    }
  }, [])

  return null
}
