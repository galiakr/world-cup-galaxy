'use client'
import { Match } from '@/types'
import { useAppStore } from '@/store'
import { t } from '@/lib/i18n'
import { format } from 'date-fns'

interface MatchCardProps {
  match: Match
  compact?: boolean
  showGroup?: boolean
}

export default function MatchCard({ match, compact = false, showGroup = true }: MatchCardProps) {
  const lang = useAppStore(s => s.lang)
  const isHe = lang === 'he'

  const homeTeam = match.home_team
  const awayTeam = match.away_team

  const homeName = homeTeam ? (isHe ? homeTeam.name_he : homeTeam.name_en) : match.home_team_id
  const awayName = awayTeam ? (isHe ? awayTeam.name_he : awayTeam.name_en) : match.away_team_id

  const kickoff = match.kick_off_utc
    ? format(new Date(match.kick_off_utc), 'HH:mm')
    : ''

  const matchDate = match.match_date
    ? format(new Date(match.match_date), 'dd/MM')
    : ''

  const statusLabel = match.status === 'finished'
    ? t(lang, 'match_finished')
    : match.status === 'live'
    ? t(lang, 'match_live')
    : kickoff || t(lang, 'match_scheduled')

  const statusColor = match.status === 'finished'
    ? 'bg-gray-100 text-gray-500'
    : match.status === 'live'
    ? 'bg-red-500 text-white animate-pulse'
    : 'bg-blue-100 text-blue-700'

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${compact ? 'p-3' : 'p-4'} mb-3`}>
      {showGroup && match.group_name && (
        <div className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">
          {t(lang, 'match_group')} {match.group_name}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Home team */}
        <div className={`flex items-center gap-2 flex-1 ${isHe ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <img
            src={homeTeam?.flag_url || `https://flagcdn.com/w40/${match.home_team_id.toLowerCase()}.png`}
            alt={homeName}
            className="w-8 h-6 object-cover rounded shadow-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className={`font-bold ${compact ? 'text-sm' : 'text-base'} leading-tight`}>
            {homeName}
          </span>
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          {match.status === 'finished' || match.home_score !== null ? (
            <div className="bg-gray-900 text-white font-black text-lg px-3 py-1 rounded-xl min-w-[64px] text-center tracking-wide">
              {match.home_score} – {match.away_score}
            </div>
          ) : (
            <div className="bg-blue-600 text-white font-bold text-sm px-3 py-2 rounded-xl min-w-[64px] text-center">
              {kickoff || 'TBD'}
            </div>
          )}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {/* Away team */}
        <div className={`flex items-center gap-2 flex-1 justify-end ${isHe ? 'flex-row text-left' : 'flex-row-reverse text-right'}`}>
          <span className={`font-bold ${compact ? 'text-sm' : 'text-base'} leading-tight`}>
            {awayName}
          </span>
          <img
            src={awayTeam?.flag_url || `https://flagcdn.com/w40/${match.away_team_id.toLowerCase()}.png`}
            alt={awayName}
            className="w-8 h-6 object-cover rounded shadow-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      </div>

      {/* Stadium */}
      {!compact && match.stadium_id && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          🏟️ {match.stadium_id} · {matchDate}
        </div>
      )}
    </div>
  )
}
