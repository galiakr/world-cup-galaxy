'use client';
import { useState } from 'react';
import { Match } from '@/types';
import { useAppStore } from '@/store';
import { t } from '@/lib/i18n';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  showGroup?: boolean;
}

export default function MatchCard({
  match,
  compact = false,
  showGroup = true,
}: MatchCardProps) {
  const lang = useAppStore((s) => s.lang);
  const isHe = lang === 'he';
  const [showSummary, setShowSummary] = useState(false);

  const homeTeam = match.home_team;
  const awayTeam = match.away_team;
  const homeFlagUrl =
    homeTeam?.flag_url ||
    `https://flagcdn.com/w40/${match.home_team_id.toLowerCase()}.png`;
  const awayFlagUrl =
    awayTeam?.flag_url ||
    `https://flagcdn.com/w40/${match.away_team_id.toLowerCase()}.png`;

  const homeName = homeTeam
    ? isHe
      ? homeTeam.name_he
      : homeTeam.name_en
    : match.home_team_id;
  const awayName = awayTeam
    ? isHe
      ? awayTeam.name_he
      : awayTeam.name_en
    : match.away_team_id;

  const kickoff = match.kick_off_utc
    ? format(new Date(match.kick_off_utc), 'HH:mm')
    : '';

  const matchDate = match.match_date
    ? format(new Date(match.match_date), 'dd/MM')
    : '';

  // The upstream feed's own `status` can lag — Predict's lock logic
  // already treats a match as started once its kickoff time has passed,
  // even if `status` hasn't flipped to 'live' yet. Match that here too,
  // so a match isn't shown as merely "scheduled" in one place while
  // Predict has already locked it as ongoing in another.
  const hasKickedOff =
    !!match.kick_off_utc &&
    new Date(match.kick_off_utc).getTime() <= Date.now();
  const isOngoing =
    match.status !== 'finished' && (match.status === 'live' || hasKickedOff);

  // Combined goal timeline for the post-match summary — "45+5" sorts as 45.5
  // so stoppage-time goals land right after the minute they were added to.
  const allGoals = [
    ...match.home_scorers.map((g) => ({ ...g, side: 'home' as const })),
    ...match.away_scorers.map((g) => ({ ...g, side: 'away' as const })),
  ].sort(
    (a, b) =>
      Number(a.minute.replace('+', '.')) - Number(b.minute.replace('+', '.'))
  );

  const statusLabel =
    match.status === 'finished'
      ? t(lang, 'match_finished')
      : isOngoing
        ? `🔴 ${t(lang, 'match_live')}`
        : kickoff || t(lang, 'match_scheduled');

  // Finished matches get a stamped-result look (dashed ink ring, slight
  // tilt) — the one state that's "officially recorded," echoing the
  // passport-stamp motif; live/upcoming stay as plain status pills.
  const statusColor =
    match.status === 'finished'
      ? 'border border-dashed border-teal text-teal bg-transparent'
      : isOngoing
        ? 'bg-coral text-white animate-pulse'
        : 'bg-teal/20 text-teal';

  return (
    <div
      className={`rounded-2xl border ${compact ? 'p-3' : 'p-4'} mb-3 ${
        isOngoing ? 'bg-coral/10 border-coral/40' : 'bg-ink/5 border-ink/10'
      }`}
    >
      {showGroup && match.group_name && (
        <div className="text-xs text-starlight/40 font-bold mb-2 uppercase tracking-wide">
          {t(lang, 'match_group')} {match.group_name}
        </div>
      )}

      <div className="flex items-center justify-center gap-6">
        {/* Home team */}
        <div
          className={`flex items-center gap-2 ${isHe ? 'flex-row-reverse text-right' : 'text-left'}`}
        >
          <span
            className={`font-bold text-starlight max-w-22 ${compact ? 'text-sm' : 'text-base'} leading-tight`}
          >
            {homeName}
          </span>
          <img
            src={homeFlagUrl}
            alt={homeName}
            className="w-8 h-6 object-cover rounded shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          {match.status === 'finished' || match.home_score !== null ? (
            <div className="bg-space border border-ink/10 text-gold font-readout text-lg px-3 py-1 my-2 rounded-xl min-w-[64px] text-center tracking-wide">
              {match.home_score} – {match.away_score}
            </div>
          ) : (
            <div className="bg-violet text-white font-readout text-sm px-3 py-2 rounded-xl min-w-[64px] text-center">
              {kickoff || 'TBD'}
            </div>
          )}
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Away team */}
        <div
          className={`flex items-center gap-2 justify-end flex-row-reverse text-right ${isHe ? 'flex-row text-left' : ''}`}
        >
          <span
            className={`font-bold text-starlight max-w-22 ${compact ? 'text-sm' : 'text-base'} leading-tight`}
          >
            {awayName}
          </span>
          <img
            src={awayFlagUrl}
            alt={awayName}
            className="w-8 h-6 object-cover rounded shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Stadium */}
      {!compact && match.stadium_id && (
        <div className="mt-2 text-xs text-starlight/40 text-center">
          🏟️{' '}
          {match.stadium
            ? `${isHe ? match.stadium.name_he : match.stadium.name_en}, ${isHe ? match.stadium.city_he : match.stadium.city_en}`
            : match.stadium_id}{' '}
          · {matchDate}
        </div>
      )}

      {/* Match summary — goal-by-goal timeline, collapsed by default */}
      {match.status === 'finished' && allGoals.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowSummary((s) => !s)}
            className="w-full text-xs text-starlight/40 font-bold text-center hover:text-starlight/70 transition-colors"
          >
            ⚽ {t(lang, 'match_summary')} {showSummary ? '▲' : '▼'}
          </button>
          {showSummary && (
            <div className="mt-2 flex flex-col gap-1.5 px-1">
              {allGoals.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-starlight/70"
                >
                  <span className="font-readout text-starlight/40 w-10 text-right">
                    {g.minute}&apos;
                  </span>
                  <img
                    src={g.side === 'home' ? homeFlagUrl : awayFlagUrl}
                    alt=""
                    className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0"
                  />
                  <span className="flex-1">
                    {g.scorer}
                    {g.own_goal && (
                      <span className="text-coral font-bold"> (OG)</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
