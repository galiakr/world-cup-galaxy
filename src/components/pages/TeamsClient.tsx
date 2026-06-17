'use client'
import { useState, useEffect } from 'react'
import { Team } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { fetchWikipediaPhoto, fetchSquad } from '@/lib/api'

interface TeamsClientProps { teams: Team[] }

export default function TeamsClient({ teams }: TeamsClientProps) {
  const lang = useAppStore(s => s.lang)
  const isHe = lang === 'he'
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Team | null>(null)
  const [coachPhoto, setCoachPhoto] = useState<string | null>(null)
  const [squad, setSquad] = useState<{ name: string; position: string; jersey: number }[]>([])
  const [loadingDetail, setLoadingDetail] = useState(false)

  const filtered = teams.filter(team => {
    const q = search.toLowerCase()
    return team.name_en.toLowerCase().includes(q) || team.name_he.includes(q) || team.group.toLowerCase().includes(q)
  })

  // Group by group letter
  const byGroup = filtered.reduce<Record<string, Team[]>>((acc, t) => {
    if (!acc[t.group]) acc[t.group] = []
    acc[t.group].push(t)
    return acc
  }, {})

  async function openTeam(team: Team) {
    setSelected(team)
    setCoachPhoto(null)
    setSquad([])
    setLoadingDetail(true)
    try {
      const [photo, players] = await Promise.all([
        team.wikipedia_slug ? fetchWikipediaPhoto(team.wikipedia_slug) : Promise.resolve(null),
        fetchSquad(team.fifa_code),
      ])
      setCoachPhoto(photo)
      setSquad(players)
    } catch {}
    setLoadingDetail(false)
  }

  const posMap: Record<string, string> = {
    Goalkeeper: t(lang, 'pos_goalkeeper'),
    Defender: t(lang, 'pos_defender'),
    Midfielder: t(lang, 'pos_midfielder'),
    Forward: t(lang, 'pos_forward'),
  }

  return (
    <div className="px-4 pt-4">
      <h1 className="font-fredoka text-2xl text-gray-800 mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
        🌍 {t(lang, 'teams_title')}
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t(lang, 'teams_search')}
          dir="auto"
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Groups */}
      {Object.keys(byGroup).sort().map(group => (
        <div key={group} className="mb-4">
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
            {t(lang, 'teams_group')} {group}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {byGroup[group].map(team => (
              <button
                key={team.id}
                onClick={() => openTeam(team)}
                className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3 hover-lift text-start active:scale-97"
              >
                <img src={team.flag_url} alt={team.name_en} className="w-10 h-7 object-cover rounded shadow-sm" />
                <div>
                  <div className="font-bold text-sm leading-tight">{isHe ? team.name_he : team.name_en}</div>
                  <div className="text-xs text-gray-400">{team.fifa_code}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Team detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto pb-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center gap-4 border-b border-gray-100">
              <img src={selected.flag_url} alt={selected.name_en} className="w-16 h-11 object-cover rounded-lg shadow" />
              <div>
                <div className="font-fredoka text-2xl text-gray-800" style={{ fontFamily: 'Fredoka One, cursive' }}>
                  {isHe ? selected.name_he : selected.name_en}
                </div>
                <div className="text-sm text-gray-400">{t(lang, 'teams_group')} {selected.group} · {selected.fifa_code}</div>
              </div>
            </div>

            {/* Team/coach photo */}
            {coachPhoto && (
              <div className="px-5 pt-4">
                <img
                  src={coachPhoto}
                  alt={isHe ? selected.name_he : selected.name_en}
                  className="w-full h-48 object-cover rounded-2xl shadow-sm"
                />
                <p className="text-xs text-gray-400 text-center mt-1">{t(lang, 'teams_squad')}</p>
              </div>
            )}

            {/* Squad */}
            <div className="px-5 pt-4">
              <h3 className="font-fredoka text-lg text-gray-800 mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
                ⭐ {t(lang, 'teams_squad')}
              </h3>
              {loadingDetail && <p className="text-gray-400 text-sm text-center py-4">Loading...</p>}
              {!loadingDetail && squad.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">{t(lang, 'teams_no_photo')}</p>
              )}
              {squad.map(player => (
                <div key={player.jersey} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 text-yellow-400 font-fredoka text-sm flex items-center justify-center flex-shrink-0"
                    style={{ fontFamily: 'Fredoka One, cursive' }}>
                    {player.jersey || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{player.name}</div>
                    <div className="text-xs text-gray-400">{posMap[player.position] ?? player.position}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pt-4">
              <button
                onClick={() => setSelected(null)}
                className="w-full bg-gray-100 text-gray-600 font-bold rounded-2xl py-3 text-sm"
              >
                ← {t(lang, 'teams_back')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
