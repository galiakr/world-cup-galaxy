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

// Ranked bar chart of the tournament's top scorers. Bars share one
// baseline, so identity columns (rank, photo, flag) must keep a fixed
// width on every row — a scorer without a photo gets a placeholder
// circle instead of nothing, or their bar would start further left and
// read as longer than it is.
export default function TopScorersChart({
  scorers,
  lang,
}: {
  scorers: TopScorer[];
  lang: Language;
}) {
  const [expandedFact, setExpandedFact] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const maxGoals = Math.max(...scorers.map((s) => s.goals), 1);

  return (
    <div>
      {scorers.map((s, i) => {
        const scorerTeam = TEAMS_BY_FIFA_CODE[s.team_id];
        const isExpanded = expandedFact === s.player_name;
        // Prefer a native Hebrew article when reading in Hebrew, but
        // fall back to the English one rather than showing nothing.
        const isHebrewFact = lang === 'he' && !!s.fact_he;
        const fact =
          (lang === 'he' ? s.fact_he : s.fact_en) ?? s.fact_en ?? s.fact_he;
        const wikiUrl =
          (lang === 'he' ? s.wiki_url_he : s.wiki_url) ??
          s.wiki_url ??
          s.wiki_url_he;
        const pct = (s.goals / maxGoals) * 100;
        return (
          <div
            key={s.player_name}
            className="py-2 border-b border-ink/10 last:border-0"
          >
            <button
              onClick={() =>
                fact && setExpandedFact(isExpanded ? null : s.player_name)
              }
              className="w-full flex items-center gap-3 text-start"
            >
              <div
                className={`font-readout text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  MEDAL_STYLE[i] ?? 'text-starlight/40'
                }`}
              >
                {i + 1}
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
                      delay: i * 0.12,
                      ease: [0.25, 0.8, 0.4, 1],
                    }}
                  />
                </div>
              </div>
              {fact && (
                <span className="text-starlight/30 text-xs flex-shrink-0">
                  {isExpanded ? '▲' : '▼'}
                </span>
              )}
            </button>
            {isExpanded && fact && (
              <div dir={isHebrewFact ? 'rtl' : 'ltr'} className="ps-9 mt-2">
                <p className="text-xs text-starlight/60 leading-relaxed">
                  {fact}
                </p>
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
      })}
    </div>
  );
}
