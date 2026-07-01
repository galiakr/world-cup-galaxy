'use client';
import { useState } from 'react';
import { Match } from '@/types';
import { useAppStore } from '@/store';
import { t } from '@/lib/i18n';
import { format } from 'date-fns';
import { TEAMS_BY_ID, getTeamName } from '@/data/teams';
import { getStadiumText } from '@/data/stadiums';
import type { WeatherInfo } from '@/lib/weather';
import { weatherEmoji } from '@/lib/weatherDisplay';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  showGroup?: boolean;
  refereeMatchCount?: number;
  weather?: WeatherInfo | null;
}

export default function MatchCard({
  match,
  compact = false,
  showGroup = true,
  refereeMatchCount,
  weather,
}: MatchCardProps) {
  const lang = useAppStore((s) => s.lang);
  const isHe = lang === 'he';
  const [showInfo, setShowInfo] = useState(false);

  const homeTeam = TEAMS_BY_ID[match.home_team_id];
  const awayTeam = TEAMS_BY_ID[match.away_team_id];
  const homeFlagUrl =
    homeTeam?.flag_url ||
    `https://flagcdn.com/w40/${match.home_team_id.toLowerCase()}.png`;
  const awayFlagUrl =
    awayTeam?.flag_url ||
    `https://flagcdn.com/w40/${match.away_team_id.toLowerCase()}.png`;
  const stadiumText = getStadiumText(match.stadium_id, lang);

  const homeName = getTeamName(match.home_team_id, lang) || match.home_team_id;
  const awayName = getTeamName(match.away_team_id, lang) || match.away_team_id;

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

  // Highlight the winner once a result is in — losing side dims back,
  // a draw leaves both sides as-is. In knockout matches that go to
  // penalties the regular score stays level; use the penalty score to
  // pick the winner instead.
  const isFinished = match.status === 'finished';
  const regularHomeWon =
    isFinished &&
    match.home_score != null &&
    match.away_score != null &&
    match.home_score > match.away_score;
  const regularAwayWon =
    isFinished &&
    match.home_score != null &&
    match.away_score != null &&
    match.away_score > match.home_score;
  const hasPenalties =
    isFinished &&
    match.home_penalty_score != null &&
    match.away_penalty_score != null;
  const homeWon =
    regularHomeWon ||
    (hasPenalties && match.home_penalty_score! > match.away_penalty_score!);
  const awayWon =
    regularAwayWon ||
    (hasPenalties && match.away_penalty_score! > match.home_penalty_score!);

  // Combined goal timeline for the post-match summary — "45+5" sorts as 45.5
  // so stoppage-time goals land right after the minute they were added to.
  const allGoals = [
    ...match.home_scorers.map((g) => ({ ...g, side: 'home' as const })),
    ...match.away_scorers.map((g) => ({ ...g, side: 'away' as const })),
  ].sort(
    (a, b) =>
      Number(a.minute.replace('+', '.')) - Number(b.minute.replace('+', '.')),
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

  const hasInfo =
    (showGroup && !!match.group_name) ||
    (match.status === 'finished' && allGoals.length > 0) ||
    !!match.stadium_id;

  return (
    <div
      className={`flex flex-col gap-1 lg:flex-row lg:gap-6 rounded-2xl border ${compact ? 'p-3' : 'p-4'} mb-3 ${
        isOngoing ? 'bg-coral/10 border-coral/40' : 'bg-ink/5 border-ink/10'
      }`}
    >
      <div className="order-2 lg:order-1 flex flex-col lg:basis-[30%] min-w-0 lg:shrink">
        {/* Mobile-only toggle — desktop has room to show this section always */}
        {hasInfo && (
          <button
            onClick={() => setShowInfo((s) => !s)}
            className="lg:hidden w-full text-xs text-starlight/60 font-bold text-center py-1 hover:text-starlight transition-colors"
          >
            ⚽ {t(lang, 'match_summary')} {showInfo ? '▲' : '▼'}
          </button>
        )}

        <div className={`${showInfo ? 'block' : 'hidden'} lg:block`}>
          {showGroup && match.group_name && (
            <div className="text-xs text-starlight/60 font-bold mb-2 uppercase tracking-wide">
              {t(lang, 'match_group')} {match.group_name}
            </div>
          )}

          {/* Match summary — goal-by-goal timeline, always visible when present */}
          {match.status === 'finished' && allGoals.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-3">
              {allGoals.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-starlight/60"
                >
                  <span className="font-readout text-starlight/60 w-10 text-right">
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

          {/* Stadium */}
          {match.stadium_id && (
            <div
              className={`mb-3 text-xs text-starlight/60 ${isHe ? 'text-right' : 'text-left'}`}
            >
              {stadiumText.name
                ? `${stadiumText.name}, ${stadiumText.city}`
                : match.stadium_id}{' '}
              · {matchDate} {kickoff && `· ${kickoff}`}
              {weather && (
                <div className="text-starlight/60">
                  {weatherEmoji(weather.icon)} {weather.tempC}°C{' '}
                  {t(
                    lang,
                    isOngoing ? 'match_weather_now' : 'match_weather_forecast',
                  )}
                </div>
              )}
            </div>
          )}

          {/* Referee — only finished matches get a "no information" fallback;
              referees for scheduled matches simply aren't assigned yet */}
          {(match.referee || match.status === 'finished') && (
            <div
              className={`mb-3 text-xs text-starlight/60 ${isHe ? 'text-right' : 'text-left'}`}
            >
              🧑‍⚖️ {t(lang, 'match_referee')}:{' '}
              {match.referee ?? t(lang, 'match_referee_unknown')}
              {match.referee && !!refereeMatchCount && (
                <div className="text-starlight/60">
                  {refereeMatchCount} {t(lang, 'referee_matches_judged')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        dir="ltr"
        className="order-1 lg:order-2 flex items-center justify-center gap-2 lg:basis-[70%] min-w-0 lg:shrink"
      >
        {/* Home team */}
        <div
          className={`flex items-center gap-1.5 min-w-0 flex-1 justify-end ${
            homeWon ? 'origin-right animate-winner-grow' : ''
          }`}
        >
          <span
            dir={isHe ? 'rtl' : 'ltr'}
            className={`text-sm leading-tight ${isHe ? 'text-right' : 'text-left'} ${
              homeWon ? 'font-extrabold text-gold' : 'font-bold text-starlight'
            }`}
          >
            {homeName}
          </span>
          <img
            src={homeFlagUrl}
            alt={homeName}
            className="w-7 h-5 object-cover rounded shadow-sm flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          {match.status === 'finished' || isOngoing ? (
            <div className="bg-space border border-ink/10 font-readout text-lg px-3 py-1 my-2 rounded-xl min-w-[64px] text-center tracking-wide">
              <span className={homeWon ? 'text-gold font-black' : 'text-gold'}>
                {match.home_score}
              </span>
              <span className="text-gold/50"> – </span>
              <span className={awayWon ? 'text-gold font-black' : 'text-gold'}>
                {match.away_score}
              </span>
            </div>
          ) : (
            <div className="bg-space border border-ink/10 text-gold/40 font-readout text-lg px-3 py-1 my-2 rounded-xl min-w-[64px] text-center tracking-wide">
              --:--
            </div>
          )}
          {hasPenalties && (
            <div dir="ltr" className="text-xs font-bold text-starlight/90 text-center font-readout tracking-wide">
              {isHe
                ? `${match.home_penalty_score}–${match.away_penalty_score} ${t(lang, 'match_pens')}`
                : `${t(lang, 'match_pens')} ${match.home_penalty_score}–${match.away_penalty_score}`}
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
          className={`flex items-center gap-1.5 min-w-0 flex-1 justify-end flex-row-reverse ${
            awayWon ? 'origin-left animate-winner-grow' : ''
          }`}
        >
          <span
            dir={isHe ? 'rtl' : 'ltr'}
            className={`text-sm leading-tight ${isHe ? 'text-right' : 'text-left'} ${
              awayWon ? 'font-extrabold text-gold' : 'font-bold text-starlight'
            }`}
          >
            {awayName}
          </span>
          <img
            src={awayFlagUrl}
            alt={awayName}
            className="w-7 h-5 object-cover rounded shadow-sm flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
}
