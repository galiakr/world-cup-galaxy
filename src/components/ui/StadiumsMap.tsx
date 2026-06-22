'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { STADIUMS, getStadiumText } from '@/data/stadiums'
import { useAppStore } from '@/store'
import type { WeatherInfo } from '@/lib/weather'
import { weatherEmoji } from '@/lib/weatherDisplay'

const REFRESH_MS = 5 * 60 * 1000

// A weather-badge marker reads better for kids than a generic map pin —
// shows the current condition + temp right on the map, no click needed.
function buildWeatherIcon(weather: WeatherInfo | null): DivIcon {
  const emoji = weather ? weatherEmoji(weather.icon) : '📍'
  const temp = weather ? `${weather.tempC}°` : ''
  return new DivIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="font-size:18px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.4));">${emoji}</div>
      ${temp ? `<div style="font-size:10px;font-weight:800;color:#0f172a;background:#fff;border-radius:6px;padding:0 4px;margin-top:1px;line-height:1.4;">${temp}</div>` : ''}
    </div>`,
    className: '',
    iconSize: [32, 38],
    iconAnchor: [16, 19],
    popupAnchor: [0, -16],
  })
}

export default function StadiumsMap() {
  const lang = useAppStore(s => s.lang)
  const [weather, setWeather] = useState<Record<string, WeatherInfo | null>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/stadiums-weather')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setWeather(data)
      } catch {
        // Weather is a nice-to-have on the map — silently skip on failure.
      }
    }
    load()
    const interval = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden border border-ink/10 h-80">
      <MapContainer
        center={[39, -98]}
        zoom={3}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {STADIUMS.map(s => {
          const text = getStadiumText(s.id, lang)
          const w = weather[s.id] ?? null
          return (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={buildWeatherIcon(w)}>
              <Popup>
                <div className="text-sm">
                  <div className="font-bold">{text.name}</div>
                  <div className="text-starlight/60">{text.city}</div>
                  <div className="text-starlight/60">{s.capacity.toLocaleString()} 🎟️</div>
                  {w && (
                    <div className="text-starlight/60 mt-1">
                      {weatherEmoji(w.icon)} {w.tempC}°C — {w.description}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
