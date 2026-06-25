'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TEAMS, getTeamName } from '@/data/teams'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'

function buildFlagIcon(flagUrl: string): DivIcon {
  return new DivIcon({
    html: `<img src="${flagUrl}" style="width:28px;height:20px;object-fit:cover;border-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.8);" />`,
    className: '',
    iconSize: [28, 20],
    iconAnchor: [14, 10],
    popupAnchor: [0, -10],
  })
}

export default function TeamsMap() {
  const lang = useAppStore(s => s.lang)
  const teamsWithCoords = TEAMS.filter(team => team.lat != null && team.lng != null)

  return (
    <div className="rounded-2xl overflow-hidden border border-ink/10 h-80">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {teamsWithCoords.map(team => (
          <Marker
            key={team.id}
            position={[team.lat!, team.lng!]}
            icon={buildFlagIcon(team.flag_url)}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{getTeamName(team.id, lang)}</div>
                <div className="text-starlight/60">
                  {t(lang, 'teams_group')} {team.group} · {team.fifa_code}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
