import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLevelFromXP, XP_REWARDS } from './config';

const KEYS = {
  XP:           'vocab:xp',
  LEVEL:        'vocab:level',
  STREAK:       'vocab:streak',
  LAST_SESSION: 'vocab:lastSession',
  WORDS_SEEN:   'vocab:wordsSeen',
  DAILY_GOAL:   'vocab:dailyGoal',
};

export function useGameState() {
  const [xp,          setXp]          = useState(0);
  const [level,       setLevel]       = useState(1);
  const [streak,      setStreak]      = useState(0);
  const [wordsSeen,   setWordsSeen]   = useState(0);
  const [levelUpData, setLevelUpData] = useState(null);
  const [loaded,      setLoaded]      = useState(false);

  useEffect(() => {
    (async () => {
      const [storedXP, storedLevel, storedStreak, storedWords] = await Promise.all([
        AsyncStorage.getItem(KEYS.XP),
        AsyncStorage.getItem(KEYS.LEVEL),
        AsyncStorage.getItem(KEYS.STREAK),
        AsyncStorage.getItem(KEYS.WORDS_SEEN),
      ]);
      setXp(parseInt(storedXP)      || 0);
      setLevel(parseInt(storedLevel)   || 1);
      setStreak(parseInt(storedStreak) || 0);
      setWordsSeen(parseInt(storedWords) || 0);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.multiSet([
      [KEYS.XP,         String(xp)],
      [KEYS.LEVEL,      String(level)],
      [KEYS.STREAK,     String(streak)],
      [KEYS.WORDS_SEEN, String(wordsSeen)],
    ]);
  }, [xp, level, streak, wordsSeen, loaded]);

  const awardXP = useCallback((action) => {
    const earned = XP_REWARDS[action] ?? 0;
    if (earned === 0) return { earned: 0, leveledUp: false };

    setXp(prev => {
      const newXP    = prev + earned;
      const newLevel = getLevelFromXP(newXP);
      const oldLevel = getLevelFromXP(prev);

      if (newLevel > oldLevel) {
        setLevelUpData({ newLevel, oldLevel, xp: newXP });
        setLevel(newLevel);
      }

      return newXP;
    });

    return { earned, leveledUp: false };
  }, []);

  const incrementStreak = useCallback(async () => {
    const lastSession = await AsyncStorage.getItem(KEYS.LAST_SESSION);
    const today       = new Date().toDateString();
    const yesterday   = new Date(Date.now() - 86400000).toDateString();

    if (lastSession === today) return;

    setStreak(prev => (lastSession === yesterday ? prev + 1 : 1));
    awardXP('STREAK_BONUS');
    await AsyncStorage.setItem(KEYS.LAST_SESSION, today);
  }, [awardXP]);

  const addWordSeen = useCallback(() => {
    setWordsSeen(p => p + 1);
    awardXP('FIRST_TIME_WORD');
  }, [awardXP]);

  const dismissLevelUp = useCallback(() => setLevelUpData(null), []);

  return {
    xp, level, streak, wordsSeen, levelUpData,
    awardXP, incrementStreak, addWordSeen, dismissLevelUp,
    loaded,
  };
}
