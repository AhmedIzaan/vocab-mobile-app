import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius, shadows } from '../theme/theme';
import { Icon } from '../icons/Icon';

export default function SessionComplete({ navigation, route }) {
  const { theme } = useTheme();
  const { score = 7, total = 9, words = [] } = route?.params || {};
  const xpEarned = score * 20;
  const newStreak = 13;

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    AsyncStorage.getItem('vocab:streak').then(s => {
      const current = s ? parseInt(s) : 0;
      AsyncStorage.setItem('vocab:streak', String(current + 1));
    });
  }, []);

  const headline = score === total ? 'Perfect.' : score >= total - 1 ? 'Beautifully done.' : 'Well begun.';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.inner, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.meta, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
          SESSION COMPLETE
        </Text>

        <View style={styles.headlineBlock}>
          <Text style={[styles.headline, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
            {headline}
          </Text>
          <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
            You sat with {total} words today. Tomorrow they will return, a little older, a little more yours.
          </Text>
        </View>

        {/* Stats card */}
        <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.rule }, shadows.md]}>
          <View style={styles.statsRow}>
            <StatCell theme={theme} label="Correct" value={`${score}/${total}`} sub="exercises" hasBorder />
            <StatCell theme={theme} label="XP" value={`+${xpEarned}`} sub="earned" />
          </View>
          <View style={[styles.statsRow, { borderTopWidth: 1, borderTopColor: theme.rule }]}>
            <StatCell theme={theme} label="Streak" value={newStreak} sub="days" hasBorder showFlame />
            <StatCell theme={theme} label="Time" value="6m 42s" sub="focused" />
          </View>
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

        <View style={{ flex: 1 }} />

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
            style={[styles.doneBtn, { backgroundColor: theme.textPrimary, flex: 1.3 }]}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}
          >
            <Text style={[styles.doneBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Done for today
            </Text>
            <Icon name="check" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function StatCell({ theme, label, value, sub, hasBorder, showFlame }) {
  return (
    <View style={[styles.statCell, hasBorder && { borderRightWidth: 1, borderRightColor: theme.rule }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          {label.toUpperCase()}
        </Text>
        {showFlame && <Icon name="flame" size={14} color={theme.accentTerracotta} />}
      </View>
      <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {value}
      </Text>
      <Text style={[styles.statSub, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  inner:       { flex: 1, padding: spacing.lg, paddingTop: spacing.xxl },
  meta:        { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  headlineBlock: { marginTop: 16, marginBottom: spacing.xl },
  headline:    { fontSize: 48, lineHeight: 52, letterSpacing: -1 },
  sub:         { fontStyle: 'italic', fontSize: 18, lineHeight: 26, color: undefined, marginTop: 14, maxWidth: 280 },
  statsCard:   { borderRadius: radius.xl, borderWidth: 1, overflow: 'hidden', marginBottom: spacing.lg },
  statsRow:    { flexDirection: 'row' },
  statCell:    { flex: 1, padding: 18 },
  statLabel:   { fontSize: 10, letterSpacing: 1.4 },
  statValue:   { fontSize: 32, lineHeight: 36, letterSpacing: -0.4, marginTop: 8, fontFamily: 'Newsreader_400Regular' },
  statSub:     { fontSize: 12, marginTop: 4 },
  wordsSection: { marginBottom: spacing.md },
  wordsLabel:  { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 12 },
  wordChips:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  wordChip:    { borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  wordChipText: { fontSize: 15, fontStyle: 'italic' },
  actions:     { flexDirection: 'row', gap: 10 },
  reviewBtn:   { flex: 1, borderWidth: 1, borderRadius: radius.full, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  reviewBtnText: { fontSize: 15 },
  doneBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  doneBtnText: { fontSize: 15 },
});
