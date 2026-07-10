'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TopScorer, Language } from '@/types';
import { t } from '@/lib/i18n';
import { TEAMS_BY_FIFA_CODE, getTeamName } from '@/data/teams';

const MEDAL_STYLE: Record<number, string> = {
  0: 'bg-gold/20 text-gold',
  1: 'bg-starlight/15 text-starlight/80',
  2: 'bg-coral/20 text-coral',
};

const COLLAPSED_COUNT = 5;

// Accent-insensitive compare so "dembele" finds "Dembélé"; Hebrew has
// no combining marks in practice, so it passes through unchanged.
function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Ranked bar chart of the tournament's top scorers: the home page shows
// the top 5, and "show all" opens a bottom sheet (same pattern as the
// team detail modal) with a player search and the full list. In the
// sheet, only players with 2+ goals keep ranked bar rows — the ~120
// one-goal scorers are all tied, so they collapse into a flag-chip tier
// instead of a hundred identical bars with meaningless rank numbers.
export default function TopScorersChart({
  scorers,
  lang,
}: {
  scorers: TopScorer[];
  lang: Language;
}) {
  const [expandedFact, setExpandedFact] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const maxGoals = Math.max(...scorers.map((s) => s.goals), 1);

  return (
    <div>
      {scorers.slice(0, COLLAPSED_COUNT).map((s, i) => (
        <ScorerRow
          key={s.player_name}
          scorer={s}
          rank={i + 1}
          lang={lang}
          maxGoals={maxGoals}
          isExpanded={expandedFact === s.player_name}
          onToggleFact={() =>
            setExpandedFact(
              expandedFact === s.player_name ? null : s.player_name,
            )
          }
          reducedMotion={!!reducedMotion}
        />
      ))}
      {scorers.length > COLLAPSED_COUNT && (
        <button
          onClick={() => setSheetOpen(true)}
          className="w-full text-center text-xs font-bold text-teal py-2 hover:text-teal/70 transition-colors"
        >
          {t(lang, 'scorers_show_all')} ({scorers.length}) ▼
        </button>
      )}
      {sheetOpen && (
        <ScorersSheet
          scorers={scorers}
          lang={lang}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}

function ScorersSheet({
  scorers,
  lang,
  onClose,
}: {
  scorers: TopScorer[];
  lang: Language;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [expandedFact, setExpandedFact] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const maxGoals = Math.max(...scorers.map((s) => s.goals), 1);

  // Rank is the position in the full API order — computed before any
  // filtering so search results keep their true rank.
  const ranked = scorers.map((s, i) => ({ scorer: s, rank: i + 1 }));

  const q = fold(search.trim());
  const matchesQuery = ({ scorer: s }: { scorer: TopScorer }) => {
    const team = TEAMS_BY_FIFA_CODE[s.team_id];
    return (
      fold(s.player_name).includes(q) ||
      fold(s.name_he ?? '').includes(q) ||
      fold(getTeamName(team?.id, 'en')).includes(q) ||
      fold(getTeamName(team?.id, 'he')).includes(q)
    );
  };

  const searching = q.length > 0;
  const results = searching ? ranked.filter(matchesQuery) : [];
  const multi = ranked.filter(({ scorer }) => scorer.goals >= 2);
  const singles = ranked.filter(({ scorer }) => scorer.goals === 1);

  const row = ({ scorer, rank }: { scorer: TopScorer; rank: number }) => (
    <ScorerRow
      key={scorer.player_name}
      scorer={scorer}
      rank={rank}
      lang={lang}
      maxGoals={maxGoals}
      isExpanded={expandedFact === scorer.player_name}
      onToggleFact={() =>
        setExpandedFact(
          expandedFact === scorer.player_name ? null : scorer.player_name,
        )
      }
      reducedMotion={!!reducedMotion}
    />
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[2000] flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-spacelight rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto pb-8 border-t border-ink/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-ink/20 rounded-full" />
        </div>

        {/* Header + search — sticky so the search stays reachable while
            scrolling a 170-player list */}
        <div className="sticky top-0 bg-spacelight px-5 pb-3 pt-1 border-b border-ink/10 z-10">
          <div className="font-display text-xl text-starlight mb-3">
            ⚽ {t(lang, 'home_top_scorers')}
            <span className="text-starlight/40 text-sm ms-2">
              {scorers.length}
            </span>
          </div>
          <div className="relative">
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-starlight/40">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(lang, 'scorers_search')}
              dir="auto"
              className="w-full ps-10 pe-4 py-2.5 bg-space border border-ink/10 text-starlight placeholder-starlight/30 rounded-2xl text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        <div className="px-5">
          {searching ? (
            results.length > 0 ? (
              results.map(row)
            ) : (
              <p className="text-starlight/40 text-sm text-center py-6">
                {t(lang, 'scorers_no_results')}
              </p>
            )
          ) : (
            <>
              {multi.map(row)}

              {/* One-goal tier — all tied, so flag chips instead of a
                  hundred identical ranked bars */}
              {singles.length > 0 && (
                <>
                  <div className="text-xs font-black text-teal uppercase tracking-wider pt-4 pb-2">
                    ⚽ {t(lang, 'scorers_one_goal')} · {singles.length}{' '}
                    {t(lang, 'scorers_players')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {singles.map(({ scorer }) => {
                      const team = TEAMS_BY_FIFA_CODE[scorer.team_id];
                      return (
                        <span
                          key={scorer.player_name}
                          className="flex items-center gap-1.5 bg-ink/5 border border-ink/10 rounded-full ps-1.5 pe-2.5 py-1 text-xs text-starlight"
                        >
                          <img
                            src={team?.flag_url || ''}
                            alt=""
                            className="w-5 h-3.5 object-cover rounded-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.visibility =
                                'hidden';
                            }}
                          />
                          {lang === 'he' && scorer.name_he
                            ? scorer.name_he
                            : scorer.player_name}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="px-5 pt-5">
          <button
            onClick={onClose}
            className="w-full bg-ink/5 text-starlight/70 font-bold rounded-2xl py-3 text-sm"
          >
            ← {t(lang, 'teams_back')}
          </button>
        </div>
      </div>
    </div>
  );
}

// A single ranked row: medal/rank, photo, flag, name + team + games,
// goal count, and the proportional goal bar. Bars share one baseline,
// so identity columns must keep a fixed width on every row — a scorer
// without a photo gets a placeholder circle instead of nothing, or
// their bar would start further left and read as longer than it is.
function ScorerRow({
  scorer: s,
  rank,
  lang,
  maxGoals,
  isExpanded,
  onToggleFact,
  reducedMotion,
}: {
  scorer: TopScorer;
  rank: number;
  lang: Language;
  maxGoals: number;
  isExpanded: boolean;
  onToggleFact: () => void;
  reducedMotion: boolean;
}) {
  const scorerTeam = TEAMS_BY_FIFA_CODE[s.team_id];
  // Prefer a native Hebrew article when reading in Hebrew, but fall
  // back to the English one rather than showing nothing.
  const isHebrewFact = lang === 'he' && !!s.fact_he;
  const fact =
    (lang === 'he' ? s.fact_he : s.fact_en) ?? s.fact_en ?? s.fact_he;
  const wikiUrl =
    (lang === 'he' ? s.wiki_url_he : s.wiki_url) ?? s.wiki_url ?? s.wiki_url_he;
  const pct = (s.goals / maxGoals) * 100;

  return (
    <div className="py-2 border-b border-ink/10 last:border-0">
      <button
        onClick={() => fact && onToggleFact()}
        className="w-full flex items-center gap-3 text-start"
      >
        <div
          className={`font-readout text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
            MEDAL_STYLE[rank - 1] ?? 'text-starlight/40'
          }`}
        >
          {rank}
        </div>
        {s.photo_url ? (
          <img
            src={s.photo_url}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-ink/10 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-sm flex-shrink-0">
            ⚽
          </div>
        )}
        <img
          src={scorerTeam?.flag_url || ''}
          alt=""
          className="w-7 h-5 object-cover rounded shadow-sm flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.visibility = 'hidden';
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-bold text-sm truncate">
              {lang === 'he' && s.name_he ? s.name_he : s.player_name}
            </div>
            <div
              className="font-readout text-sm text-starlight flex-shrink-0"
              aria-label={`${s.goals} ${t(lang, 'home_goals')}`}
            >
              {s.goals} ⚽
              {/* fact indicator lives here, not as a flex sibling of the
                  bar column — a trailing column would shrink enriched
                  rows' bars relative to rows without a fact */}
              {fact && (
                <span className="text-starlight/30 text-xs ms-1.5">
                  {isExpanded ? '▲' : '▼'}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-starlight/40 truncate">
            {getTeamName(scorerTeam?.id, lang)}
            {/* played_matches is absent in older cached snapshots */}
            {!!s.played_matches && (
              <> · {s.played_matches} {t(lang, 'scorer_games')}</>
            )}
          </div>
          {/* Bar track: same-ramp light teal; fill square at the
              baseline (inline-start), 4px rounded at the data end.
              Logical rounded-e keeps that correct in RTL, where
              bars grow right-to-left. */}
          <div className="h-2.5 mt-1 bg-teal/10 rounded-e" aria-hidden>
            <motion.div
              className="h-full bg-teal rounded-e"
              initial={{ width: reducedMotion ? `${pct}%` : 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true, amount: 'all' }}
              transition={{
                duration: 0.7,
                // cap the stagger so deep rows don't wait for their bar
                delay: Math.min((rank - 1) * 0.12, 0.6),
                ease: [0.25, 0.8, 0.4, 1],
              }}
            />
          </div>
        </div>
      </button>
      {isExpanded && fact && (
        <div dir={isHebrewFact ? 'rtl' : 'ltr'} className="ps-9 mt-2">
          <p className="text-xs text-starlight/60 leading-relaxed">{fact}</p>
          {wikiUrl && (
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1.5 text-[11px] text-teal/70 hover:text-teal transition-colors"
            >
              {lang === 'he' ? 'ויקיפדיה' : 'Wikipedia'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
