import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius, shadows } from '../theme/theme';
import { Icon } from '../icons/Icon';
import { ProgressBar } from '../components/shared/ProgressBar';
import { INITIAL_USER } from '../data/words';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const HEATMAP = Array.from({ length: 35 }, (_, i) => {
  if (i >= 34) return 2;
  if (i >= 22) return [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1][i - 22] ?? 0;
  return (i * 7 + 3) % 5 > 1 ? ((i % 3 === 0) ? 0.5 : 1) : 0;
});

function heatmapColor(v, theme) {
  if (v === 0) return theme.tint;
  if (v === 0.5) return theme.accentSoft;
  if (v === 1) return theme.accentTerracotta;
  return theme.textPrimary;
}

export default function Progress() {
  const { theme } = useTheme();
  const user = INITIAL_USER;
  const xpPct = user.xp / user.xpToNext;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenMeta, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          YOUR PRACTICE
        </Text>
        <Text style={[styles.screenTitle, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
          Progress
        </Text>

        {/* Streak hero */}
        <View style={[styles.streakHero, { backgroundColor: theme.textPrimary }, shadows.lg]}>
          <View style={styles.streakHeader}>
            <Icon name="flame" size={16} color={theme.accentTerracotta} />
            <Text style={[styles.streakLabel, { color: theme.goldSoft, fontFamily: 'Inter_400Regular' }]}>
              CURRENT STREAK
            </Text>
          </View>
          <Text style={[styles.streakNum, { color: theme.textInverse, fontFamily: 'Newsreader_400Regular' }]}>
            {user.streak}
            <Text style={[styles.streakUnit, { color: theme.goldSoft }]}> days</Text>
          </Text>
          <Text style={[styles.streakLongest, { color: theme.goldSoft, fontFamily: 'Newsreader_400Regular' }]}>
            Longest run: {user.longestStreak} days
          </Text>

          <View style={styles.weekDots}>
            {user.weeklyActivity.map((a, i) => (
              <View key={i} style={styles.weekDotCol}>
                <View style={[
                  styles.weekDot,
                  {
                    backgroundColor: a ? theme.accentTerracotta : 'rgba(255,255,255,0.15)',
                    borderWidth: i === 6 ? 2 : 0,
                    borderColor: theme.accentGold,
                  },
                ]} />
                <Text style={[styles.dayLabel, { color: theme.goldSoft, fontFamily: 'Inter_400Regular' }]}>
                  {DAYS[i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* XP + level */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          <View style={styles.xpHeader}>
            <Text style={[styles.metaLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              LEVEL {user.level}
            </Text>
            <Text style={[styles.xpFraction, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              {user.xp} / {user.xpToNext}
            </Text>
          </View>
          <Text style={[styles.levelTitle, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
            Apprentice Reader
          </Text>
          <View style={{ marginTop: 14 }}>
            <ProgressBar
              progress={xpPct}
              color={theme.accentTerracotta}
              backgroundColor={theme.tint}
              height={6}
            />
          </View>
          <Text style={[styles.xpSub, { color: theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
            360 XP until <Text style={{ color: theme.textPrimary, fontWeight: '500' }}>Essayist</Text>
          </Text>
        </View>

        {/* Heatmap */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
          <View style={styles.heatmapHeader}>
            <Text style={[styles.metaLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              LAST 5 WEEKS
            </Text>
            <Text style={[styles.heatmapSub, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
              32 of 35 days
            </Text>
          </View>
          <View style={styles.heatmapGrid}>
            {HEATMAP.map((v, i) => (
              <View
                key={i}
                style={[styles.heatCell, { backgroundColor: heatmapColor(v, theme) }]}
              />
            ))}
          </View>
          <View style={styles.legend}>
            <Text style={[styles.legendText, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>less</Text>
            {[theme.tint, theme.accentSoft, theme.accentTerracotta, theme.textPrimary].map((c, i) => (
              <View key={i} style={[styles.legendDot, { backgroundColor: c }]} />
            ))}
            <Text style={[styles.legendText, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>more</Text>
          </View>
        </View>

        {/* Badges */}
        <Text style={[styles.metaLabel, { color: theme.textMuted, marginBottom: 12, fontFamily: 'Inter_400Regular' }]}>
          BADGES
        </Text>
        <View style={styles.badgeGrid}>
          {[
            { name: 'First week', earned: true, glyph: '7' },
            { name: 'Bookworm',   earned: true, glyph: '100' },
            { name: 'Poet',       earned: false, glyph: '250' },
          ].map((b, i) => (
            <View
              key={i}
              style={[
                styles.badge,
                { backgroundColor: theme.card, borderColor: theme.rule, opacity: b.earned ? 1 : 0.5 },
                shadows.sm,
              ]}
            >
              <View style={[
                styles.badgeIcon,
                {
                  backgroundColor: b.earned ? theme.textPrimary : theme.tint,
                  borderColor: b.earned ? theme.accentGold : theme.rule,
                  borderWidth: b.earned ? 2 : 1,
                  borderStyle: b.earned ? 'solid' : 'dashed',
                },
              ]}>
                <Text style={[styles.badgeGlyph, { color: b.earned ? theme.textInverse : theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
                  {b.glyph}
                </Text>
              </View>
              <Text style={[styles.badgeName, { color: b.earned ? theme.textPrimary : theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>
                {b.name}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  scroll:       { flex: 1 },
  content:      { padding: spacing.md, paddingBottom: spacing.xxl },
  screenMeta:   { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  screenTitle:  { fontSize: 36, lineHeight: 40, letterSpacing: -0.5, marginTop: 8, marginBottom: spacing.lg },
  streakHero:   { borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.md, overflow: 'hidden' },
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakLabel:  { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  streakNum:    { fontSize: 68, lineHeight: 72, letterSpacing: -1.2, marginTop: 6 },
  streakUnit:   { fontSize: 22 },
  streakLongest: { fontSize: 13, fontStyle: 'italic', marginTop: 10 },
  weekDots:     { flexDirection: 'row', gap: 6, marginTop: 18 },
  weekDotCol:   { flex: 1, alignItems: 'center', gap: 6 },
  weekDot:      { width: 10, height: 10, borderRadius: 5 },
  dayLabel:     { fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' },
  card:         { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.md },
  xpHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  metaLabel:    { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  xpFraction:   { fontSize: 12 },
  levelTitle:   { fontSize: 24, letterSpacing: -0.3, marginTop: 6 },
  xpSub:        { fontSize: 12, marginTop: 10, fontStyle: 'italic' },
  heatmapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 },
  heatmapSub:   { fontStyle: 'italic', fontSize: 14 },
  heatmapGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  heatCell:     { width: '12%', aspectRatio: 1, borderRadius: 5 },
  legend:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  legendText:   { fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' },
  legendDot:    { width: 10, height: 10, borderRadius: 2 },
  badgeGrid:    { flexDirection: 'row', gap: 10 },
  badge:        { flex: 1, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, alignItems: 'center' },
  badgeIcon:    { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeGlyph:   { fontSize: 18 },
  badgeName:    { fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
});
