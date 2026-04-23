export const XP_REWARDS = {
  CORRECT_MCQ:          10,
  CORRECT_FLASHCARD:     8,
  CORRECT_MATCH_PAIRS:  12,
  CORRECT_SPELL:        15,
  CORRECT_SPEED_ROUND:  20,
  CORRECT_ASSOCIATION:  10,
  CORRECT_SENTENCE:     12,
  WRONG_ANSWER:          0,
  SESSION_COMPLETE:     25,
  STREAK_BONUS:         20,
  FIRST_TIME_WORD:       5,
};

export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  900,   // Level 5
  1400,  // Level 6
  2100,  // Level 7
  3000,  // Level 8
  4100,  // Level 9
  5500,  // Level 10
  7200,  // Level 11
  9200,  // Level 12
  11700, // Level 13
  14700, // Level 14
  18300, // Level 15
];

export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

export const LEVEL_TITLES = {
  1:  'Curious Mind',
  2:  'Word Seeker',
  3:  'Eager Reader',
  4:  'Keen Learner',
  5:  'Vocab Apprentice',
  6:  'Word Artisan',
  7:  'Language Builder',
  8:  'Eloquent Speaker',
  9:  'Wordsmith',
  10: 'Lexicon Scholar',
  11: 'Prose Architect',
  12: 'Literary Sage',
  13: 'Vocabulary Master',
  14: 'Grand Lexicologist',
  15: 'Logophile Supreme',
};

export function getLevelFromXP(xp) {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(level, MAX_LEVEL);
}

export function getXPForNextLevel(currentLevel) {
  if (currentLevel >= MAX_LEVEL) return LEVEL_THRESHOLDS[MAX_LEVEL - 1];
  return LEVEL_THRESHOLDS[currentLevel];
}

export function getXPProgress(xp, currentLevel) {
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextThreshold    = getXPForNextLevel(currentLevel);
  const earned           = xp - currentThreshold;
  const required         = nextThreshold - currentThreshold;
  return { earned, required, percent: Math.min(earned / required, 1) };
}
