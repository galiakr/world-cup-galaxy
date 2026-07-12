# ⚽ World Cup Galaxy

A bilingual (Hebrew/English) kids' app for the 2026 FIFA World Cup with stickers, quizzes, match data, and predictions, built for children aged 6–12 to enjoy with or without their parents.

🔗 **Live app:** [_world-cup-galaxy.vercel.app_](https://world-cup-galaxy.vercel.app/)

---

## Screenshots

<img width="322" height="557" alt="Screenshot 2026-07-05 at 14 15 31" src="https://github.com/user-attachments/assets/eb16ea5e-00eb-4881-85af-e56bdbfcf3d8" />

<img width="322" height="557" alt="Screenshot 2026-07-05 at 14 16 10" src="https://github.com/user-attachments/assets/e402dc02-6ddb-4ce8-bac3-a29fad37856b" />

<img width="322" height="557" alt="Screenshot 2026-07-05 at 14 16 49" src="https://github.com/user-attachments/assets/e4d98b0d-fdc9-4399-8760-6cc6d39ebf64" />

<img width="322" height="557" alt="Screenshot 2026-07-05 at 14 17 11" src="https://github.com/user-attachments/assets/faf3774a-49dc-4e43-afb7-9f4e6ca8a3a4" />

<img width="322" height="557" alt="Screenshot 2026-07-05 at 14 18 13" src="https://github.com/user-attachments/assets/1a6a9182-ec8d-4921-a474-9863355e5b48" />

---

## Why I built this

I wanted a World Cup app my kids could actually use, in Hebrew, without passwords, without accounts, and without ads. Everything that exists is either adult-oriented or requires an email. So I built one.

It's also a technical playground: I used it to explore anonymous device-based auth, bilingual RTL without an i18n library, a two-layer caching strategy that survives Vercel Lambda cold starts, and hand-rolled data visualization: animated top-scorer bars and bar-in-cell group standings built with Tailwind and framer-motion instead of a chart library, with a colorblind-validated palette and bars that mirror correctly in RTL via CSS logical properties.

---

## Tech stack

### Frontend

- **Next.js 14**: App Router with a mix of server and client components
- **TypeScript**
- **Tailwind CSS v3.4**
- **Zustand**: client state and persistence via localStorage

### Backend / Data

- **Supabase**: PostgreSQL with Row Level Security, anonymous auth, and RPCs
- **Next.js server components** as the primary data-fetching layer
- **Next.js API routes** for client-side fetches (`/api/squad/[code]`, `/api/stadiums-weather`)

### External APIs

- **worldcup26.ir**: live match data (scores, kickoff times, penalties)
- **football-data.org**: squads, top scorers, referees
- **Wikipedia REST API + MediaWiki API**: player photos, bios, Hebrew articles
- **OpenWeatherMap API**: current weather at match stadiums

### Hosting

- **Vercel**: with `maxDuration` exports and Next.js Data Cache

---

## Notable architecture decisions

**Two-layer cache for live data**
Live match data is cached in-memory (a `Map` with TTL) as the first layer. Supabase tables (`matches_cache`, `scorers_cache`) serve as a fallback that survives Lambda cold starts. This avoids hammering external APIs on every cold request while keeping data reasonably fresh.

**Device-based anonymous auth**
No passwords, no emails. Children log in by picking an avatar and typing a name. Device trust is handled via Supabase anonymous auth, up to 4 profiles can share one device, with a one-time recovery code to migrate a profile to a new device.

**Manual Hebrew/RTL i18n**
No i18n library. A `LangSync` component patches `<html dir>` on the client when the language switches between Hebrew and English. All content is stored in bilingual objects and rendered based on the active language state.

**PWA: installable, with a hand-rolled service worker**
The app installs to a mobile home screen like a native app (on Android Chrome: ⋮ menu → "Install app"). `public/manifest.json` declares the name, theme color, and icons — 192, 512, and a "maskable" 512 whose content sits inside the safe zone so OS icon masks don't clip it. A minimal ~50-line service worker (`public/sw.js`, registered by the `ServiceWorkerRegister` client component) satisfies Chrome's installability requirement: network-first for same-origin requests, falling back to a small precached app shell when offline. It deliberately does **not** cache Supabase or external API calls, so live-data freshness stays governed by the two-layer cache alone rather than a second caching layer with its own staleness.

**Archive mode: life after the final**
The live-data APIs won't outlive the tournament: worldcup26.ir is a hobby project, and football-data.org rotates out past seasons. So the app can freeze the whole tournament into the repo: `npm run snapshot-archive` captures every match (scores, scorers, penalties, referees, half-time), the top scorers (with their Wikipedia facts already resolved), and all 48 squads into `src/data/archive/*.json`. After a cutoff date one week past the final (or with `WC_ARCHIVE_MODE=1`), the fetchers serve those files directly, no flaky-API retries, no Supabase dependency, and the app keeps working as a self-contained memento of the 2026 World Cup. The snapshot script is safe to run any time as a dry run; the one that counts is run right after the final, while the APIs still have the data.

---

## Running locally

```bash
git clone https://github.com/galiakr/world-cup-galaxy.git
cd world-cup-galaxy
npm install
cp .env.example .env.local   # fill in your Supabase and API keys
npm run dev
```

Open [_http://localhost:3000_](http://localhost:3000).

### Required environment variables

See `.env.example` for the full list. You'll need:

- Supabase project URL and anon key
- football-data.org API key (free tier works)
- worldcup26.ir does not require a key
- openweathermap.org API key (free tier works)

---

## What's built

| Feature                                           |
| ------------------------------------------------- |
| Hebrew / English toggle with manual RTL handling  |
| Child login: name + avatar, no password           |
| Switch between up to 4 players on a shared device |
| Home: yesterday's results + today + tomorrow      |
| Match history: all 104 matches                    |
| Teams page with search, flags, and squad detail   |
| Player photos and bios from Wikipedia             |
| 80+ sticker album with rarity system              |
| Daily sticker on login                            |
| Streak tracking                                   |
| Daily quiz (Hebrew + English)                     |
| Sticker rewards for quiz answers                  |
| Score predictions with +/− buttons                |
| Soccer rules page                                 |
| Bug report form                                   |
| Fully responsive                                  |
| PWA: installable on mobile                        |
| Fully free, no paid APIs                          |

---

## For parents: how login works

There are no passwords and no emails. Your child just picks an avatar and types a name to play. A few things worth knowing:

- **Each device remembers them.** Once they've logged in on a phone or tablet, that device stays signed in. No need to log in again next time.
- **Up to 4 kids can share one device.** Tap the 👥 button at the top to switch between players already added on that device, instantly, no code needed. The same button lets you add a new player.
- **A recovery code is only needed to add a profile from a _different_ device.** The first time a profile is created, the app shows a one-time code (e.g. `XJ4M-7QPR`). To bring that player to another device, enter that code there. **Write it down somewhere safe**,it's shown only once.
- **No code, no recovery.** If a browser's data is cleared or you try a different device without the code, that profile can't be recovered, but nothing personal is lost since no personal data is collected.
- **What's stored:** a chosen name, an avatar emoji, and in-app activity (stickers, quiz answers, predictions) per player. No email, no real name, no payment info.
