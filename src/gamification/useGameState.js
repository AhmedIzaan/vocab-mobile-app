import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '../auth/AuthContext';
import { getLevelFromXP, XP_REWARDS } from './config';

const KEYS = {
  XP:           'vocab:xp',
  LEVEL:        'vocab:level',
  STREAK:       'vocab:streak',
  LAST_SESSION: 'vocab:lastSession',
  WORDS_SEEN:   'vocab:wordsSeen',
};

export function useGameState() {
  const [xp,          setXp]          = useState(0);
  const [level,       setLevel]       = useState(0);
  const [streak,      setStreak]      = useState(0);
  const [wordsSeen,   setWordsSeen]   = useState(0);
  const [levelUpData, setLevelUpData] = useState(null);
  const [loaded,      setLoaded]      = useState(false);

  const { profile, updateProfile } = useAuthContext();

  useEffect(() => {
    if (profile) {
      setXp(profile.xp      ?? 0);
      setLevel(profile.level  ?? 0);
      setStreak(profile.streak ?? 0);
      setLoaded(true);
    } else {
      (async () => {
        const [storedXP, storedLevel, storedStreak, storedWords] = await Promise.all([
          AsyncStorage.getItem(KEYS.XP),
          AsyncStorage.getItem(KEYS.LEVEL),
          AsyncStorage.getItem(KEYS.STREAK),
          AsyncStorage.getItem(KEYS.WORDS_SEEN),
        ]);
        setXp(parseInt(storedXP)      || 0);
        setLevel(parseInt(storedLevel)   || 0);
        setStreak(parseInt(storedStreak) || 0);
        setWordsSeen(parseInt(storedWords) || 0);
        setLoaded(true);
      })();
    }
  }, [profile?.id]);

  // Local cache
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

    const newXP    = xp + earned;
    const newLevel = getLevelFromXP(newXP);
    const oldLevel = getLevelFromXP(xp);

    setXp(newXP);

    if (newLevel > oldLevel) {
      setLevel(newLevel);
      setLevelUpData({ newLevel, oldLevel, xp: newXP });
      updateProfile({ xp: newXP, level: newLevel });
    } else {
      updateProfile({ xp: newXP });
    }

    return { earned, leveledUp: newLevel > oldLevel };
  }, [xp, updateProfile]);

  const incrementStreak = useCallback(async () => {
    const lastSession = await AsyncStorage.getItem(KEYS.LAST_SESSION);
    const today       = new Date().toDateString();
    const yesterday   = new Date(Date.now() - 86400000).toDateString();

    if (lastSession === today) return;

    const newStreak = lastSession === yesterday ? streak + 1 : 1;
    setStreak(newStreak);
    await AsyncStorage.setItem(KEYS.LAST_SESSION, today);
    await updateProfile({ streak: newStreak });
    awardXP('STREAK_BONUS');
  }, [streak, updateProfile, awardXP]);

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
