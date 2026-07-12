# PWA fix for World Cup Galaxy

Why the install prompt never showed up: the repo had no `public/` folder
at all, so `/manifest.json` and `/favicon.ico` (both referenced in
`layout.tsx`) were 404ing on the live site, and there was no service
worker anywhere. Chrome on Android requires both a *reachable* manifest
with icons and a registered service worker before it will offer the
install prompt — this repo had neither actually working.

## What's in this folder

Copy these into the matching paths in your repo (create the `public/`
folder — it doesn't exist yet):

```
public/manifest.json              new
public/sw.js                      new
public/icon-192.png               new — placeholder icon, swap for real art
public/icon-512.png               new — placeholder icon, swap for real art
public/icon-maskable-512.png      new — placeholder icon, swap for real art
public/favicon.ico                new — placeholder icon, swap for real art
public/apple-touch-icon.png       new — placeholder icon, swap for real art
src/components/layout/ServiceWorkerRegister.tsx   new
src/app/layout.tsx                REPLACES the existing file
```

## Install steps

1. `mkdir public` at the repo root (it currently doesn't exist).
2. Copy every file under this folder's `public/` into your repo's new
   `public/`.
3. Copy `src/components/layout/ServiceWorkerRegister.tsx` into your repo
   at that same path.
4. Replace your repo's `src/app/layout.tsx` with the one in this folder.
   The only changes from your current file: an `icons` block was added
   to `metadata`, and `<ServiceWorkerRegister />` was added inside
   `<body>`, right after `<LangSync />`. Everything else is untouched —
   diff it before committing if you want to double check.
5. Commit, push, and redeploy to Vercel (service workers and manifests
   only take effect over HTTPS, so this won't do anything on plain
   `http://localhost` — use `next dev` over `https` or just test against
   the deployed Vercel URL).
6. On Android Chrome, open the deployed URL, browse for a few seconds
   (Chrome's install heuristics want a little engagement first), then
   check the **⋮ menu → "Install app"**. The automatic banner can take a
   visit or two to appear the first time a page becomes installable.

## About the icons

The five PNG/ICO files are placeholders — a simple soccer ball drawn in
your existing "Mission Passport" palette (paper `#F6EFE2`, ink
`#221F1B`, gold `#D69E2E`, teal accent stars), not final artwork. They
exist so the manifest points at real files instead of 404s. Swap them
for a proper logo whenever you have one — keep the same filenames and
sizes (192×192, 512×512, and a 512×512 "maskable" version with content
inside the inner ~72% of the canvas so OS icon masks don't clip it) and
everything else keeps working unchanged.

## About the service worker

`public/sw.js` is intentionally minimal: network-first for same-origin
GET requests, falling back to a small precached shell only when the
network is unavailable. It does **not** cache your Supabase,
football-data.org, worldcup26.ir, Wikipedia, or OpenWeatherMap calls —
those go straight to the network exactly as before, so this doesn't
introduce any of its own staleness beyond what your existing two-layer
cache in `src/lib/api.ts` already handles. Its only job is to satisfy
Chrome's "has a fetch handler" installability requirement and give you a
basic offline fallback for the app shell.

If you'd rather not hand-roll this, `next-pwa` (a Workbox wrapper) is a
drop-in alternative — but for an app of this size, this ~50-line worker
is easier to reason about and audit.
