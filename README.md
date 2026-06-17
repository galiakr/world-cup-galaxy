# ⚽ World Cup Kids App — Setup Guide

## You only need to give me 3 things

| # | What | Where to get it | Free? |
|---|------|-----------------|-------|
| 1 | Supabase URL + Key | supabase.com (2 values) | ✅ Free |
| 2 | football-data.org Key | football-data.org (1 value) | ✅ Free forever |
| 3 | — | Match data needs no key at all | ✅ No key |

---

## STEP 1 — Supabase (your database)

1. Go to **https://supabase.com** → click **Start for Free**
2. Sign up (GitHub or email)
3. Click **New Project**
   - Name: `worldcup-kids`
   - Region: Frankfurt or London (closest to Israel)
   - Set any database password
4. Wait ~2 min for it to spin up
5. Go to **Settings → API**, copy:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public** key — long string starting with `eyJ...`
6. Go to **SQL Editor** → paste the entire `supabase-schema.sql` file → click **Run**

**Send me:** the Project URL and the anon key

---

## STEP 2 — football-data.org (squad rosters + top scorers)

1. Go to **https://www.football-data.org/client/register**
2. Fill in: name, email, describe as "Kids World Cup app"
3. Verify your email
4. Log in → profile page → copy your **API Token**

**Send me:** the API token

---

## STEP 3 — Put it all together locally

```bash
# Clone / download the project, then:
cp .env.local.example .env.local

# Edit .env.local and fill in your 3 values:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# FOOTBALL_DATA_KEY=...

npm install
npm run dev
# Open http://localhost:3000
```

---

## STEP 4 — Deploy to Vercel (free hosting)

1. Push this folder to a GitHub repo
2. Go to **https://vercel.com** → New Project → import your repo
3. Add the 3 environment variables (same as `.env.local`)
4. Click Deploy — done!

---

## What's built — no action needed

| Feature | Done |
|---|---|
| Hebrew / English toggle | ✅ |
| Child login (name + avatar, no password) | ✅ |
| Home: yesterday results + today + tomorrow matches | ✅ |
| Match history page (all 104 matches) | ✅ |
| Teams page with search, flags, squad detail | ✅ |
| Photos from Wikipedia (free, no key) | ✅ |
| 40+ sticker album with rarity system | ✅ |
| Daily sticker on login | ✅ |
| Streak tracking | ✅ |
| Daily quiz (Hebrew + English) | ✅ |
| Sticker rewards for quiz answers | ✅ |
| Score predictions with +/− buttons | ✅ |
| Soccer rules page | ✅ |
| Bug report form (earns a sticker) | ✅ |
| Mobile-first, RTL Hebrew | ✅ |
| Fully free — no paid APIs | ✅ |
