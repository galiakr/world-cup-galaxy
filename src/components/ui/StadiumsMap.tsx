'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { STADIUMS } from '@/data/stadiums'
import { useAppStore } from '@/store'

// Leaflet's default marker icon references image files that don't resolve
// through Next's bundler — pulling them from a CDN avoids the broken-icon
// issue without needing to copy assets into /public.
const pinIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function StadiumsMap() {
  const lang = useAppStore(s => s.lang)
  const isHe = lang === 'he'

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
        {STADIUMS.map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={pinIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{isHe ? s.name_he : s.name_en}</div>
                <div className="text-starlight/60">{isHe ? s.city_he : s.city_en}</div>
                <div className="text-starlight/60">{s.capacity.toLocaleString()} 🎟️</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
