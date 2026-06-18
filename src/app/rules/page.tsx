'use client';
import { useState } from 'react';
import { useAppStore } from '@/store';
import { t, TranslationKey } from '@/lib/i18n';

interface Rule {
  emoji: string;
  titleKey: TranslationKey;
  textKey: TranslationKey;
}

const RULES: Rule[] = [
  { emoji: '⚽', titleKey: 'rule1_title', textKey: 'rule1_text' },
  { emoji: '🔵', titleKey: 'rule2_title', textKey: 'rule2_text' },
  { emoji: '👥', titleKey: 'rule3_title', textKey: 'rule3_text' },
  { emoji: '👕', titleKey: 'rule4_title', textKey: 'rule4_text' },
  { emoji: '🧤', titleKey: 'rule5_title', textKey: 'rule5_text' },
  { emoji: '🚩', titleKey: 'rule6_title', textKey: 'rule6_text' },
  { emoji: '⏱️', titleKey: 'rule7_title', textKey: 'rule7_text' },
  { emoji: '🟢', titleKey: 'rule8_title', textKey: 'rule8_text' },
  { emoji: '🏳️', titleKey: 'rule9_title', textKey: 'rule9_text' },
  { emoji: '🥅', titleKey: 'rule10_title', textKey: 'rule10_text' },
  { emoji: '🚦', titleKey: 'rule11_title', textKey: 'rule11_text' },
  { emoji: '🟨', titleKey: 'rule12_title', textKey: 'rule12_text' },
  { emoji: '🎯', titleKey: 'rule13_title', textKey: 'rule13_text' },
  { emoji: '📍', titleKey: 'rule14_title', textKey: 'rule14_text' },
  { emoji: '↩️', titleKey: 'rule15_title', textKey: 'rule15_text' },
  { emoji: '🔺', titleKey: 'rule16_title', textKey: 'rule16_text' },
  { emoji: '⚑', titleKey: 'rule17_title', textKey: 'rule17_text' },
];

const WC_PREP_KEYS: TranslationKey[] = ['wc_prep_1', 'wc_prep_2', 'wc_prep_3', 'wc_prep_4', 'wc_prep_5', 'wc_prep_6'];
const WC_ROUND_KEYS: TranslationKey[] = ['wc_round_1', 'wc_round_2', 'wc_round_3', 'wc_round_4', 'wc_round_5', 'wc_round_6'];
const WC_QUALIFY_KEYS: TranslationKey[] = ['wc_qualify_1', 'wc_qualify_2', 'wc_qualify_3', 'wc_qualify_4', 'wc_qualify_5', 'wc_qualify_6'];
const WC_FACT_KEYS: TranslationKey[] = ['wc_fact_1', 'wc_fact_2', 'wc_fact_3', 'wc_fact_4', 'wc_fact_5', 'wc_fact_6'];

export default function RulesPage() {
  const { lang } = useAppStore();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1
        className="font-fredoka text-2xl text-gray-800 mb-1"
        style={{ fontFamily: 'Fredoka One, cursive' }}
      >
        📖 {t(lang, 'rules_title')}
      </h1>
      <p className="text-xs text-gray-400 mb-4">
        {t(lang, 'rules_subtitle')}
      </p>

      {/* All 17 Laws — accordion */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        {RULES.map((rule, i) => {
          const isOpen = expanded === i;
          return (
            <div
              key={i}
              className={i < RULES.length - 1 ? 'border-b border-gray-100' : ''}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-start hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl w-8 text-center flex-shrink-0">
                  {rule.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {t(lang, 'rules_law_label')} {i + 1}
                  </div>
                  <div className="font-bold text-sm text-gray-800 leading-tight">
                    {t(lang, rule.titleKey)}
                  </div>
                </div>
                <span
                  className={`text-gray-400 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>
              {isOpen && (
                <div
                  className="px-4 pb-4 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-blue-50/40"
                  dir="auto"
                >
                  {t(lang, rule.textKey)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* How the World Cup Works */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2
          className="font-fredoka text-lg text-gray-800 mb-3"
          style={{ fontFamily: 'Fredoka One, cursive' }}
        >
          🏆 {t(lang, 'wc_title')}
        </h2>

        <div className="mb-4">
          <h3 className="font-bold text-sm text-gray-800 mb-1">{t(lang, 'wc_host_title')}</h3>
          <p className="text-sm text-gray-600 leading-relaxed" dir="auto">{t(lang, 'wc_host_text')}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-sm text-gray-800 mb-1">{t(lang, 'wc_prep_title')}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-2" dir="auto">{t(lang, 'wc_prep_intro')}</p>
          <ul className="space-y-1.5">
            {WC_PREP_KEYS.map((key) => (
              <li key={key} className="text-sm text-gray-600 leading-relaxed" dir="auto">{t(lang, key)}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-sm text-gray-800 mb-1">{t(lang, 'wc_structure_title')}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-2" dir="auto">{t(lang, 'wc_structure_intro')}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-2" dir="auto">{t(lang, 'wc_structure_group')}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-2" dir="auto">{t(lang, 'wc_structure_knockout_intro')}</p>
          <ol className="space-y-1 mb-2">
            {WC_ROUND_KEYS.map((key, i) => (
              <li
                key={key}
                className={`text-sm leading-relaxed ${i === WC_ROUND_KEYS.length - 1 ? 'font-bold text-gray-800' : 'text-gray-600'}`}
                dir="auto"
              >
                {i + 1}. {t(lang, key)}
              </li>
            ))}
          </ol>
          <p className="text-sm text-gray-600 leading-relaxed" dir="auto">{t(lang, 'wc_structure_extra_time')}</p>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-800 mb-1">{t(lang, 'wc_qualify_title')}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-2" dir="auto">{t(lang, 'wc_qualify_intro')}</p>
          <ul className="space-y-1.5 mb-2">
            {WC_QUALIFY_KEYS.map((key) => (
              <li key={key} className="text-sm text-gray-600 leading-relaxed" dir="auto">{t(lang, key)}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed" dir="auto">{t(lang, 'wc_qualify_outro')}</p>
        </div>
      </div>

      {/* World Cup 2026 facts */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-4">
        <h2
          className="font-fredoka text-lg text-gray-800 mb-3"
          style={{ fontFamily: 'Fredoka One, cursive' }}
        >
          🌟 {t(lang, 'wc_facts_title')}
        </h2>
        {WC_FACT_KEYS.map((key) => (
          <div key={key} className="text-sm text-gray-700 mb-2 last:mb-0" dir="auto">
            {t(lang, key)}
          </div>
        ))}
      </div>
    </div>
  );
}
