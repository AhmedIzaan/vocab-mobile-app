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

// Level thresholds — index = level number (0-based)
export const LEVEL_THRESHOLDS = [
  0,     // Level 0
  100,   // Level 1
  250,   // Level 2
  500,   // Level 3
  900,   // Level 4
  1400,  // Level 5
  2100,  // Level 6
  3000,  // Level 7
  4100,  // Level 8
  5500,  // Level 9
  7200,  // Level 10
  9200,  // Level 11
  11700, // Level 12
  14700, // Level 13
  18300, // Level 14
];

export const MAX_LEVEL = LEVEL_THRESHOLDS.length - 1; // 14

export const LEVEL_TITLES = {
  0:  'Curious Mind',
  1:  'Word Seeker',
  2:  'Eager Reader',
  3:  'Keen Learner',
  4:  'Vocab Apprentice',
  5:  'Word Artisan',
  6:  'Language Builder',
  7:  'Eloquent Speaker',
  8:  'Wordsmith',
  9:  'Lexicon Scholar',
  10: 'Prose Architect',
  11: 'Literary Sage',
  12: 'Vocabulary Master',
  13: 'Grand Lexicologist',
  14: 'Logophile Supreme',
};

export function getLevelFromXP(xp) {
  let level = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i;
      break;
    }
  }
  return Math.min(level, MAX_LEVEL);
}

export function getXPForNextLevel(currentLevel) {
  if (currentLevel >= MAX_LEVEL) return LEVEL_THRESHOLDS[MAX_LEVEL];
  return LEVEL_THRESHOLDS[currentLevel + 1];
}

export function getXPProgress(xp, currentLevel) {
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold    = getXPForNextLevel(currentLevel);
  const earned           = xp - currentThreshold;
  const required         = nextThreshold - currentThreshold;
  return { earned, required, percent: Math.min(earned / required, 1) };
}
