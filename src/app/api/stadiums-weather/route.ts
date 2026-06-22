import { NextResponse } from 'next/server'
import { STADIUMS } from '@/data/stadiums'
import { fetchCurrentWeather, WeatherInfo } from '@/lib/weather'

export async function GET() {
  const entries = await Promise.all(
    STADIUMS.map(async (s): Promise<[string, WeatherInfo | null]> => [
      s.id,
      await fetchCurrentWeather(s.lat, s.lng),
    ]),
  )
  const result: Record<string, WeatherInfo | null> = {}
  for (const [id, weather] of entries) result[id] = weather
  return NextResponse.json(result)
}
