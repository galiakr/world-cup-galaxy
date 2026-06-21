import { QuizQuestion, Language } from '@/types';
import { QUIZ_TEXT_EN } from './en';
import { QUIZ_TEXT_HE } from './he';

// Question/option text lives in data/en.ts / data/he.ts, resolved via
// getQuizText() below.
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── RULES ─────────────────────────────────────────────────────────────────
  { id: 'r1', correct_index: 2, difficulty: 'easy', category: 'rules', sticker_reward_id: 'a_welcome' },
  { id: 'r2', correct_index: 1, difficulty: 'easy', category: 'rules' },
  { id: 'r3', correct_index: 1, difficulty: 'easy', category: 'rules' },
  { id: 'r4', correct_index: 1, difficulty: 'easy', category: 'rules' },
  { id: 'r5', correct_index: 2, difficulty: 'medium', category: 'rules' },
  { id: 'r6', correct_index: 1, difficulty: 'hard', category: 'rules' },
  { id: 'r7', correct_index: 1, difficulty: 'medium', category: 'rules' },
  // ── TOURNAMENT ─────────────────────────────────────────────────────────────
  { id: 't1', correct_index: 2, difficulty: 'easy', category: 'tournament' },
  { id: 't2', correct_index: 0, difficulty: 'easy', category: 'tournament' },
  { id: 't3', correct_index: 3, difficulty: 'medium', category: 'tournament' },
  { id: 't4', correct_index: 2, difficulty: 'medium', category: 'tournament' },
  { id: 't5', correct_index: 2, difficulty: 'medium', category: 'tournament' },
  { id: 't6', correct_index: 1, difficulty: 'hard', category: 'tournament' },
  // ── TEAMS ──────────────────────────────────────────────────────────────────
  { id: 'tm1', correct_index: 2, difficulty: 'easy', category: 'teams' },
  { id: 'tm2', correct_index: 2, difficulty: 'easy', category: 'teams' },
  { id: 'tm3', correct_index: 3, difficulty: 'medium', category: 'teams' },
  { id: 'tm4', correct_index: 1, difficulty: 'medium', category: 'teams' },
  { id: 'tm5', correct_index: 2, difficulty: 'hard', category: 'teams' },
  // ── PLAYERS ────────────────────────────────────────────────────────────────
  { id: 'pl1', correct_index: 2, difficulty: 'easy', category: 'players', sticker_reward_id: 'p_messi' },
  { id: 'pl2', correct_index: 2, difficulty: 'easy', category: 'players', sticker_reward_id: 'p_mbappe' },
  { id: 'pl3', correct_index: 2, difficulty: 'easy', category: 'players', sticker_reward_id: 'p_haaland' },
  { id: 'pl4', correct_index: 2, difficulty: 'medium', category: 'players', sticker_reward_id: 'p_ronaldo' },
  { id: 'pl5', correct_index: 2, difficulty: 'easy', category: 'players', sticker_reward_id: 'p_bellingham' },
  // ── HISTORY ────────────────────────────────────────────────────────────────
  { id: 'h1', correct_index: 1, difficulty: 'medium', category: 'history' },
  { id: 'h2', correct_index: 2, difficulty: 'easy', category: 'history' },
  { id: 'h3', correct_index: 2, difficulty: 'hard', category: 'history' },
  { id: 'h4', correct_index: 1, difficulty: 'easy', category: 'history' },
  { id: 'h5', correct_index: 2, difficulty: 'medium', category: 'history' },
];

// Daily quiz rotation - returns today's set of 5 questions
export function getDailyQuestions(): QuizQuestion[] {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const seed = dayOfYear % QUIZ_QUESTIONS.length;
  const rotated = [
    ...QUIZ_QUESTIONS.slice(seed),
    ...QUIZ_QUESTIONS.slice(0, seed),
  ];
  return rotated.slice(0, 5);
}

export function getQuizText(id: string, lang: Language): { question: string; options: string[] } {
  const map = lang === 'he' ? QUIZ_TEXT_HE : QUIZ_TEXT_EN;
  return map[id] ?? { question: '', options: [] };
}
