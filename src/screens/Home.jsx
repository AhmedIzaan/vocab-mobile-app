import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { useGame } from '../gamification/GameContext';
import { typography, spacing, radius, shadows } from '../theme/theme';
import { Icon } from '../icons/Icon';
import { XPBar } from '../components/shared/XPBar';
import { StreakBadge } from '../components/shared/StreakBadge';
import { sampleWords, INITIAL_USER } from '../data/words';

export default function Home({ navigation }) {
  const { theme } = useTheme();
  const { xp, level, streak, incrementStreak } = useGame();
  const [user, setUser]   = useState(INITIAL_USER);
  const [goal, setGoal]   = useState(5);

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    async function loadState() {
      const [wordsLearned, dailyGoal] = await Promise.all([
        AsyncStorage.getItem('vocab:wordsLearned'),
        AsyncStorage.getItem('vocab:dailyGoal'),
      ]);
      setUser(u => ({
        ...u,
        wordsLearned: wordsLearned ? parseInt(wordsLearned) : u.wordsLearned,
      }));
      if (dailyGoal) setGoal(parseInt(dailyGoal));
    }
    loadState();
    incrementStreak();
  }, []);

  const todaysWords = sampleWords.slice(0, goal);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.background, theme.backgroundSecondary]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.dateMeta, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              {dateStr.toUpperCase()}
            </Text>
            <Text style={[typography.displaySmall, { color: theme.textPrimary, marginTop: 4 }]}>
              Good morning, {user.name}.
            </Text>
          </View>
          <StreakBadge />
        </View>

        {/* Trial banner */}
        {!user.isPro && user.trialDaysLeft > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Paywall')}
            style={[styles.trialBanner, { backgroundColor: theme.card, borderColor: theme.rule }]}
            activeOpacity={0.8}
          >
            <View style={[styles.trialDayBadge, { backgroundColor: theme.accentTerracotta }]}>
              <Text style={[styles.trialDayNum, { fontFamily: 'Newsreader_700Bold' }]}>
                {user.trialDaysLeft}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.trialTitle, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
                {user.trialDaysLeft} days of Pro left
              </Text>
              <Text style={[styles.trialSub, { color: theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
                Enjoying it? Keep Lexica for $9/mo.
              </Text>
            </View>
            <Icon name="arrow" size={14} color={theme.textMuted} />
          </TouchableOpacity>
        )}

        {/* Hero session card */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.md]}>
          <Text style={[styles.sessionMeta, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
            TODAY'S SESSION
          </Text>
          <Text style={[styles.wordCountDisplay, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
            {goal}
            <Text style={[styles.wordCountSub, { color: theme.textMuted }]}>  / {goal} words</Text>
          </Text>
          <Text style={[styles.sessionSub, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
            A small, unhurried ritual. About seven minutes.
          </Text>

          <View style={styles.chipRow}>
            {todaysWords.map((w, i) => (
              <View key={i} style={[styles.chip, { borderColor: theme.rule, backgroundColor: theme.background }]}>
                <Text style={[styles.chipText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  {w.word.toLowerCase()}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.startBtn, { backgroundColor: theme.textPrimary }]}
            onPress={() => navigation.navigate('WordDetail', { words: todaysWords, wordIndex: 0 })}
            activeOpacity={0.85}
          >
            <Text style={[styles.startBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Begin today
            </Text>
            <Icon name="arrow" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        </View>

        {/* XP Progress */}
        <View style={[styles.xpCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          <XPBar />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
            <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              LEVEL
            </Text>
            <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {level}
            </Text>
            <Text style={[styles.statSub, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              {xp} xp total
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
            <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              LEARNED
            </Text>
            <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {user.wordsLearned}
            </Text>
            <Text style={[styles.statSub, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              total words
            </Text>
          </View>
        </View>

        {/* Yesterday review */}
        <View style={[styles.reviewCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              YESTERDAY
            </Text>
            <Text style={[styles.reviewLink, { color: theme.accentTerracotta, fontFamily: 'Inter_400Regular' }]}>
              Review →
            </Text>
          </View>
          {[
            { w: 'Mellifluous', m: 'sweet-sounding, pleasing to the ear' },
            { w: 'Saudade',     m: 'a deep, melancholy longing' },
            { w: 'Vicissitude', m: 'a change of circumstances' },
          ].map((item, i) => (
            <View
              key={i}
              style={[
                styles.reviewRow,
                { borderBottomColor: theme.rule, borderBottomWidth: i < 2 ? 1 : 0 },
              ]}
            >
              <Text style={[styles.reviewWord, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                {item.w}
              </Text>
              <Text style={[styles.reviewMeaning, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
                {item.m}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  scroll:      { flex: 1 },
  content:     { padding: spacing.md, paddingBottom: spacing.xxl },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  dateMeta:    { fontSize: 10, letterSpacing: 1.4 },
  trialBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 12, borderWidth: 1, marginBottom: spacing.md },
  trialDayBadge: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trialDayNum: { fontSize: 20, color: '#FBF7EE' },
  trialTitle:  { fontSize: 14 },
  trialSub:    { fontSize: 12, marginTop: 2, fontStyle: 'italic' },
  heroCard:    { borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, marginBottom: spacing.md, overflow: 'hidden' },
  sessionMeta: { fontSize: 11, letterSpacing: 1.5 },
  wordCountDisplay: { fontSize: 48, lineHeight: 52, marginTop: 6, letterSpacing: -0.8 },
  wordCountSub: { fontSize: 22 },
  sessionSub:  { fontStyle: 'italic', fontSize: 16, lineHeight: 22, marginTop: 6, marginBottom: spacing.md },
  chipRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.md },
  chip:        { borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  chipText:    { fontSize: 12, letterSpacing: 0.3 },
  startBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  startBtnText: { fontSize: 15 },
  xpCard:      { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.md },
  statsRow:    { flexDirection: 'row', gap: 12, marginBottom: spacing.md },
  statCard:    { flex: 1, borderRadius: radius.lg, padding: 18, borderWidth: 1, gap: 4 },
  statLabel:   { fontSize: 10, letterSpacing: 1.4 },
  statValue:   { fontSize: 34, lineHeight: 36, letterSpacing: -0.4 },
  statSub:     { fontSize: 12, marginBottom: 6 },
  reviewCard:  { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reviewLink:  { fontSize: 12 },
  reviewRow:   { flexDirection: 'row', alignItems: 'baseline', gap: 12, paddingVertical: 10 },
  reviewWord:  { fontSize: 17, minWidth: 110 },
  reviewMeaning: { fontSize: 13, fontStyle: 'italic', flex: 1 },
});
