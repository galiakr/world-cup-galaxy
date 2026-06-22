// Server-only OpenWeatherMap fetchers. The free tier's forecast endpoint
// only covers ~5 days ahead in 3-hour steps, which happens to line up
// with "upcoming matches" anyway — anything further out has no forecast.
const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY

export interface WeatherInfo {
  tempC: number
  main: string
  description: string
  icon: string
}

interface OpenWeatherEntry {
  dt: number
  main?: { temp?: number }
  weather?: { main: string; description: string; icon: string }[]
}

function parseWeather(json: OpenWeatherEntry): WeatherInfo | null {
  const w = json.weather?.[0]
  if (!w || typeof json.main?.temp !== 'number') return null
  return {
    tempC: Math.round(json.main.temp),
    main: w.main,
    description: w.description,
    icon: w.icon,
  }
}

export async function fetchCurrentWeather(lat: number, lng: number): Promise<WeatherInfo | null> {
  if (!OPENWEATHER_KEY) return null
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_KEY}`,
      { next: { revalidate: 600 } },
    )
    if (!res.ok) return null
    return parseWeather(await res.json())
  } catch {
    return null
  }
}

export interface ForecastWeather extends WeatherInfo {
  forecastTime: string
}

export async function fetchForecastAtKickoff(
  lat: number,
  lng: number,
  kickoffIso: string,
): Promise<ForecastWeather | null> {
  if (!OPENWEATHER_KEY) return null
  const kickoff = new Date(kickoffIso).getTime()
  if (Number.isNaN(kickoff)) return null

  const now = Date.now()
  const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000
  if (kickoff < now || kickoff > now + FIVE_DAYS_MS) return null

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_KEY}`,
      { next: { revalidate: 1800 } },
    )
    if (!res.ok) return null
    const json = await res.json()
    const list: OpenWeatherEntry[] = json?.list ?? []
    if (list.length === 0) return null

    let closest = list[0]
    let closestDiff = Math.abs(closest.dt * 1000 - kickoff)
    for (const entry of list) {
      const diff = Math.abs(entry.dt * 1000 - kickoff)
      if (diff < closestDiff) {
        closest = entry
        closestDiff = diff
      }
    }

    const parsed = parseWeather(closest)
    if (!parsed) return null
    return { ...parsed, forecastTime: new Date(closest.dt * 1000).toISOString() }
  } catch {
    return null
  }
}
