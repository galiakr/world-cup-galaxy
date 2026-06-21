'use client';
import { useState, useEffect } from 'react';
import { Team } from '@/types';
import { useAppStore } from '@/store';
import { t, TranslationKey } from '@/lib/i18n';
import { fetchWikipediaPhoto } from '@/lib/api';
import { getTeamName } from '@/data/teams';
import { TeamStage, GroupPosition } from '@/lib/standings';
import UpdateAttemptTab from '@/components/ui/UpdateAttemptTab';

interface SquadResult {
  coachName: string | null;
  players: {
    name: string;
    position: string;
    jersey: number;
    photo_url?: string;
  }[];
}

async function fetchSquad(code: string): Promise<SquadResult> {
  const res = await fetch(`/api/squad/${code}`);
  if (!res.ok) return { coachName: null, players: [] };
  return res.json();
}

interface TeamsClientProps {
  teams: Team[];
  stageById?: Record<string, TeamStage>;
  standingById?: Record<string, GroupPosition>;
  matchesAttemptedAt?: string;
}

const STAGE_STYLE: Record<TeamStage, string> = {
  group: 'bg-teal/15 text-teal',
  round_of_32: 'bg-teal/15 text-teal',
  round_of_16: 'bg-violet/15 text-violet',
  quarter: 'bg-violet/15 text-violet',
  semi: 'bg-gold/15 text-gold',
  third_place: 'bg-gold/15 text-gold',
  final: 'bg-gold/20 text-gold',
  champion: 'bg-gold/25 text-gold',
  runner_up: 'bg-starlight/15 text-starlight/70',
  fourth_place: 'bg-ink/10 text-starlight/50',
  eliminated: 'bg-coral/15 text-coral',
};

const STAGE_KEY: Record<TeamStage, TranslationKey> = {
  group: 'stage_group',
  round_of_32: 'stage_round_of_32',
  round_of_16: 'stage_round_of_16',
  quarter: 'stage_quarter',
  semi: 'stage_semi',
  third_place: 'stage_third_place',
  final: 'stage_final',
  champion: 'stage_champion',
  runner_up: 'stage_runner_up',
  fourth_place: 'stage_fourth_place',
  eliminated: 'stage_eliminated',
};

export default function TeamsClient({ teams, stageById, standingById, matchesAttemptedAt }: TeamsClientProps) {
  const lang = useAppStore((s) => s.lang);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Team | null>(null);
  const [coachPhoto, setCoachPhoto] = useState<string | null>(null);
  const [coachName, setCoachName] = useState<string | null>(null);
  const [squad, setSquad] = useState<SquadResult['players']>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const filtered = teams.filter((team) => {
    const q = search.toLowerCase();
    return (
      getTeamName(team.id, 'en').toLowerCase().includes(q) ||
      getTeamName(team.id, 'he').includes(q) ||
      team.group.toLowerCase().includes(q)
    );
  });

  // Group by group letter
  const byGroup = filtered.reduce<Record<string, Team[]>>((acc, t) => {
    if (!acc[t.group]) acc[t.group] = [];
    acc[t.group].push(t);
    return acc;
  }, {});

  // Sort each group by current standing (#1, #2, ...) once results exist;
  // teams with no standing yet (no data) keep their original order, at the end.
  for (const group of Object.keys(byGroup)) {
    byGroup[group].sort((a, b) => {
      const posA = standingById?.[a.id]?.position ?? Infinity;
      const posB = standingById?.[b.id]?.position ?? Infinity;
      return posA - posB;
    });
  }

  async function openTeam(team: Team) {
    setSelected(team);
    setCoachPhoto(null);
    setCoachName(null);
    setSquad([]);
    setLoadingDetail(true);
    try {
      const [photo, squadResult] = await Promise.all([
        team.wikipedia_slug
          ? fetchWikipediaPhoto(team.wikipedia_slug)
          : Promise.resolve(null),
        fetchSquad(team.fifa_code),
      ]);
      setCoachPhoto(photo);
      setCoachName(squadResult.coachName);
      setSquad(squadResult.players);
    } catch {}
    setLoadingDetail(false);
  }

  const posMap: Record<string, string> = {
    Goalkeeper: t(lang, 'pos_goalkeeper'),
    Defender: t(lang, 'pos_defender'),
    Midfielder: t(lang, 'pos_midfielder'),
    Forward: t(lang, 'pos_forward'),
  };

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl text-starlight mb-3">
        🌍 {t(lang, 'teams_title')}
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t(lang, 'teams_search')}
          dir="auto"
          className="w-full pl-10 pr-4 py-3 bg-spacelight border border-ink/10 text-starlight placeholder-starlight/30 rounded-2xl text-sm focus:outline-none focus:border-teal"
        />
      </div>

      {/* Groups */}
      {Object.keys(byGroup)
        .sort()
        .map((group) => (
          <div key={group} className="mb-4">
            <div className="text-xs font-black text-teal uppercase tracking-wider mb-2">
              {t(lang, 'teams_group')} {group}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {byGroup[group].map((team) => {
                const stage = stageById?.[team.id];
                const standing = standingById?.[team.id];
                return (
                  <button
                    key={team.id}
                    onClick={() => openTeam(team)}
                    className="bg-spacelight rounded-2xl border border-ink/10 p-3 flex items-center gap-3 hover-lift text-start active:scale-97"
                  >
                    <img
                      src={team.flag_url}
                      alt={getTeamName(team.id, lang)}
                      className="w-10 h-7 object-cover rounded shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm leading-tight text-starlight">
                        {getTeamName(team.id, lang)}
                      </div>
                      <div className="text-xs text-starlight/40 mb-1">
                        {team.fifa_code}
                      </div>
                      {stage && (
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${STAGE_STYLE[stage]}`}
                        >
                          {t(lang, STAGE_KEY[stage])}
                        </span>
                      )}
                      {stage === 'group' && standing && (
                        <div className="text-[10px] text-starlight/40 mt-1">
                          #{standing.position} · {standing.played} {t(lang, 'teams_played_label')} · {standing.points} {t(lang, 'teams_points_label')}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {/* Team detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-spacelight rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto pb-8 border-t border-ink/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-ink/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center gap-4 border-b border-ink/10">
              <img
                src={selected.flag_url}
                alt={getTeamName(selected.id, lang)}
                className="w-16 h-11 object-cover rounded-lg shadow"
              />
              <div>
                <div className="font-display text-2xl text-starlight">
                  {getTeamName(selected.id, lang)}
                </div>
                <div className="text-sm text-starlight/40">
                  {t(lang, 'teams_group')} {selected.group} ·{' '}
                  {selected.fifa_code}
                </div>
              </div>
            </div>

            {/* Team photo */}
            {coachPhoto && (
              <div className="px-5 pt-4">
                <img
                  src={coachPhoto}
                  alt={getTeamName(selected.id, lang)}
                  className="h-48 m-auto object-cover rounded-2xl shadow-sm"
                />
              </div>
            )}

            {/* Coach */}
            {coachName && (
              <div className="px-5 pt-4 flex items-center gap-2">
                <span className="text-xs font-bold text-starlight/40 uppercase tracking-wide">
                  {t(lang, 'teams_coach')}
                </span>
                <span className="text-sm font-bold text-starlight">
                  {coachName}
                </span>
              </div>
            )}

            {/* Squad */}
            <div className="px-5 pt-4">
              <h3 className="font-display text-lg text-starlight mb-3">
                {t(lang, 'teams_squad')}
              </h3>
              {loadingDetail && (
                <p className="text-starlight/40 text-sm text-center py-4">
                  {t(lang, 'teams_loading')}
                </p>
              )}
              {!loadingDetail && squad.length === 0 && (
                <p className="text-starlight/40 text-sm text-center py-4">
                  {t(lang, 'teams_no_photo')}
                </p>
              )}
              {squad.map((player) => (
                <div
                  key={player.name}
                  className="flex items-center gap-3 py-2 border-b border-ink/10 last:border-0"
                >
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-ink/10 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-3xl leading-none flex-shrink-0 overflow-hidden">
                      ⚽
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-starlight">
                        {player.name}
                      </span>
                      {player.jersey > 0 && (
                        <span className="font-readout text-gold text-xs">
                          #{player.jersey}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-starlight/40">
                      {posMap[player.position] ?? player.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pt-4">
              <button
                onClick={() => setSelected(null)}
                className="w-full bg-ink/5 text-starlight/70 font-bold rounded-2xl py-3 text-sm"
              >
                ← {t(lang, 'teams_back')}
              </button>
            </div>
          </div>
        </div>
      )}
      {matchesAttemptedAt && <UpdateAttemptTab attemptedAt={matchesAttemptedAt} />}
    </div>
  );
}
