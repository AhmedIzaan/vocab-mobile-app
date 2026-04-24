import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTheme } from '../theme/ThemeContext';
import { useGame } from '../gamification/GameContext';
import { spacing, radius, shadows } from '../theme/theme';
import { Icon } from '../icons/Icon';
import { XPBar } from '../components/shared/XPBar';

export default function SessionComplete({ navigation, route }) {
  const { theme } = useTheme();
  const { awardXP, incrementStreak } = useGame();
  const { score = 7, total = 9, words = [] } = route?.params || {};

  const scoreScale   = useRef(new Animated.Value(0)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(scoreScale, {
        toValue: 1,
        damping: 10,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
    }, 300);

    setTimeout(() => {
      Animated.timing(statsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 700);

    incrementStreak();
    awardXP('SESSION_COMPLETE');
  }, []);

  const pct      = total > 0 ? Math.round((score / total) * 100) : 0;
  const headline = score === total ? 'Perfect.' : score >= total - 1 ? 'Beautifully done.' : 'Well begun.';
  const xpEarned = score * 10 + 25;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ConfettiCannon
        count={80}
        origin={{ x: 200, y: 0 }}
        colors={[theme.accentGold, theme.accentTerracotta, theme.accentSage]}
        fadeOut
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.meta, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
          SESSION COMPLETE
        </Text>

        <Text style={[styles.headline, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
          {headline}
        </Text>
        <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
          You sat with {total} words today. Tomorrow they will return, a little more yours.
        </Text>

        {/* Score */}
        <Animated.Text style={[styles.scoreDisplay, { color: theme.accentGold, fontFamily: 'Newsreader_700Bold', transform: [{ scale: scoreScale }] }]}>
          {pct}%
        </Animated.Text>

        <Animated.View style={{ opacity: statsOpacity }}>
          {/* Stats card */}
          <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.md]}>
            <View style={styles.statsRow}>
              <StatCell theme={theme} label="Correct" value={`${score}/${total}`} sub="exercises" hasBorder />
              <StatCell theme={theme} label="XP" value={`+${xpEarned}`} sub="earned" />
            </View>
            <View style={[styles.statsRow, { borderTopWidth: 1, borderTopColor: theme.rule }]}>
              <StatCell theme={theme} label="Time" value="6m 42s" sub="focused" hasBorder />
              <StatCell theme={theme} label="Words" value={words.length || total} sub="learned" />
            </View>
          </View>

          {/* XP progress */}
          <View style={[styles.xpCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.sm]}>
            <XPBar />
          </View>

          {/* Words learned */}
          {words.length > 0 && (
            <View style={styles.wordsSection}>
              <Text style={[styles.wordsLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                ADDED TO YOUR LIBRARY
              </Text>
              <View style={styles.wordChips}>
                {words.map((w, i) => (
                  <View key={i} style={[styles.wordChip, { backgroundColor: theme.card, borderColor: theme.rule }]}>
                    <Text style={[styles.wordChipText, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                      {w.word || w}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Animated.View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.reviewBtn, { borderColor: theme.rule }]}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.8}
          >
            <Text style={[styles.reviewBtnText, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
              Review words
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.textPrimary }]}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}
          >
            <Text style={[styles.doneBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Done for today
            </Text>
            <Icon name="check" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCell({ theme, label, value, sub, hasBorder }) {
  return (
    <View style={[styles.statCell, hasBorder && { borderRightWidth: 1, borderRightColor: theme.rule }]}>
      <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
        {label.toUpperCase()}
      </Text>
      <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {value}
      </Text>
      <Text style={[styles.statSub, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  scroll:        { flex: 1 },
  content:       { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  meta:          { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  headline:      { fontSize: 40, lineHeight: 44, letterSpacing: -0.8, marginTop: 14 },
  sub:           { fontStyle: 'italic', fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: spacing.sm },
  scoreDisplay:  { fontSize: 64, lineHeight: 72, letterSpacing: -2, marginBottom: spacing.md, textAlign: 'center' },
  statsCard:     { borderRadius: radius.xl, borderWidth: 1, overflow: 'hidden', marginBottom: spacing.md },
  xpCard:        { borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  statsRow:      { flexDirection: 'row' },
  statCell:      { flex: 1, padding: 16 },
  statLabel:     { fontSize: 10, letterSpacing: 1.4 },
  statValue:     { fontSize: 28, lineHeight: 32, letterSpacing: -0.4, marginTop: 6 },
  statSub:       { fontSize: 12, marginTop: 4 },
  wordsSection:  { marginBottom: spacing.md },
  wordsLabel:    { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 12 },
  wordChips:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  wordChip:      { borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  wordChipText:  { fontSize: 14, fontStyle: 'italic' },
  actions:       { flexDirection: 'row', gap: 10, marginTop: spacing.md },
  reviewBtn:     { flex: 1, borderWidth: 1, borderRadius: radius.full, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  reviewBtnText: { fontSize: 15 },
  doneBtn:       { flex: 1.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  doneBtnText:   { fontSize: 15 },
});
