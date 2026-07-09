'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { GroupTeamRow, Language } from '@/types';
import { t } from '@/lib/i18n';
import { getTeamName } from '@/data/teams';

// Group-stage max: 3 wins × 3 points. A fixed domain keeps points bars
// comparable across groups (and stable as results come in), instead of
// rescaling to whichever group happens to have the current leader.
const MAX_POINTS = 9;

// Compact standings table with bar-in-cell visuals: points as a teal
// bar on a fixed 0–9 scale, goal difference as a diverging bar around
// a center hairline — violet positive / coral negative, a pair chosen
// over teal/coral for colorblind separation (position around the
// midpoint and the signed label carry the sign regardless of hue).
export default function GroupStandingsTable({
  rows,
  lang,
}: {
  rows: GroupTeamRow[];
  lang: Language;
}) {
  const reducedMotion = useReducedMotion();

  // GD bars scale to the group's own extreme so within-group ranking
  // stays readable; floor of 3 stops a lone ±1 from filling the cell
  // on matchday one.
  const maxAbsGd = Math.max(...rows.map((r) => Math.abs(r.goal_diff)), 3);

  return (
    <div className="bg-spacelight rounded-2xl border border-ink/10 px-3 py-2 mb-2">
      {/* Header — full column names; long ones ("Goal difference",
          "הפרש שערים") wrap to two lines within their column width */}
      <div className="flex items-end gap-1.5 pb-1 border-b border-ink/10 text-[8px] font-bold uppercase tracking-wide leading-tight text-starlight/40">
        <span className="w-4 flex-shrink-0" />
        <span className="w-6 flex-shrink-0" />
        <span className="flex-1" />
        <span className="w-9 text-center flex-shrink-0">{t(lang, 'standings_played')}</span>
        <span className="w-16 text-center flex-shrink-0">{t(lang, 'standings_gd')}</span>
        <span className="w-[72px] text-center flex-shrink-0">{t(lang, 'standings_points')}</span>
      </div>

      {rows.map((row, i) => {
        const gdPct = (Math.abs(row.goal_diff) / maxAbsGd) * 100;
        const ptsPct = (row.points / MAX_POINTS) * 100;
        return (
          <div
            key={row.team_id}
            className="flex items-center gap-1.5 py-1.5 border-b border-ink/5 last:border-0"
          >
            <span className="w-4 font-readout text-[11px] text-starlight/40 text-center flex-shrink-0">
              {i + 1}
            </span>
            <img
              src={row.team?.flag_url || ''}
              alt=""
              className="w-6 h-4 object-cover rounded-sm shadow-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.visibility = 'hidden';
              }}
            />
            <span className="flex-1 min-w-0 truncate text-xs font-bold text-starlight">
              {getTeamName(row.team_id, lang)}
            </span>
            <span
              className="w-9 font-readout text-[11px] text-starlight/50 text-center flex-shrink-0"
              aria-label={`${row.played} ${t(lang, 'teams_played_label')}`}
            >
              {row.played}
            </span>

            {/* Goal difference: diverging bar around a center hairline */}
            <span className="w-16 flex items-center gap-1 flex-shrink-0">
              <span className="relative flex-1 h-2" aria-hidden>
                <span className="absolute inset-y-0 start-1/2 w-px bg-ink/20" />
                {row.goal_diff !== 0 && (
                  <motion.span
                    className={`absolute inset-y-0 ${
                      row.goal_diff > 0
                        ? 'start-1/2 bg-violet rounded-e'
                        : 'end-1/2 bg-coral rounded-s'
                    }`}
                    initial={{ width: reducedMotion ? `${gdPct / 2}%` : 0 }}
                    whileInView={{ width: `${gdPct / 2}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                  />
                )}
              </span>
              {/* dir=ltr: in RTL context the sign would trail the digits
                  ("6+" instead of "+6") */}
              <span
                dir="ltr"
                className="w-5 font-readout text-[11px] text-starlight/70 text-end flex-shrink-0"
              >
                {row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff}
              </span>
            </span>

            {/* Points: bar on the fixed 0–9 group-stage scale */}
            <span className="w-[72px] flex items-center gap-1 flex-shrink-0">
              <span className="flex-1 h-2.5 bg-teal/10 rounded-e" aria-hidden>
                <motion.span
                  className="block h-full bg-teal rounded-e"
                  initial={{ width: reducedMotion ? `${ptsPct}%` : 0 }}
                  whileInView={{ width: `${ptsPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                />
              </span>
              <span
                className="w-4 font-readout text-[11px] font-bold text-starlight text-end flex-shrink-0"
                aria-label={`${row.points} ${t(lang, 'teams_points_label')}`}
              >
                {row.points}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
