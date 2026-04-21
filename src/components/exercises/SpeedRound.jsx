import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function SpeedRound({ ex, theme, onNext }) {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (idx >= ex.pairs.length || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(x => x - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, idx]);

  useEffect(() => {
    if (timeLeft === 0 && idx < ex.pairs.length) setIdx(ex.pairs.length);
  }, [timeLeft]);

  const answer = (guess) => {
    const curr = ex.pairs[idx];
    const ok = guess === curr.match;
    if (ok) { setCorrect(c => c + 1); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }
    else    { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); }
    setFeedback(ok ? 'right' : 'wrong');
    setTimeout(() => { setFeedback(null); setIdx(i => i + 1); }, 400);
  };

  const done = idx >= ex.pairs.length;

  if (done) {
    return (
      <View>
        <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
          SPEED ROUND
        </Text>
        <Text style={[styles.result, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
          {correct} / {ex.pairs.length}{' '}
          <Text style={{ fontStyle: 'italic', color: theme.textSecondary }}>in {20 - timeLeft}s</Text>
        </Text>
        <View style={[styles.quoteCard, { backgroundColor: theme.card, borderColor: theme.rule }]}>
          <Text style={[styles.quoteText, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
            Quick recognition is how meanings become instincts.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.textPrimary }]}
          onPress={() => onNext(correct >= ex.pairs.length - 1)}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>Continue</Text>
          <Icon name="arrow" size={14} color={theme.textInverse} />
        </TouchableOpacity>
      </View>
    );
  }

  const curr = ex.pairs[idx];
  let pairBg = theme.card, pairBorder = theme.rule;
  if (feedback === 'right')  { pairBg = theme.sageSoft;   pairBorder = theme.accentSage; }
  if (feedback === 'wrong')  { pairBg = theme.accentSoft; pairBorder = theme.accentTerracotta; }

  return (
    <View>
      <View style={styles.topRow}>
        <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
          SPEED ROUND
        </Text>
        <Text style={[styles.timer, { color: timeLeft <= 5 ? theme.accentTerracotta : theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
          0:{String(timeLeft).padStart(2, '0')}
        </Text>
      </View>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {ex.prompt}
      </Text>

      <View style={[styles.pairCard, { backgroundColor: pairBg, borderColor: pairBorder }]}>
        <Text style={[styles.pairWord, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
          {curr.w}
        </Text>
        <Text style={[styles.pairEquals, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          EQUALS?
        </Text>
        <Text style={[styles.pairMeaning, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
          {curr.m}
        </Text>
      </View>

      <View style={styles.yesNo}>
        <TouchableOpacity
          style={[styles.noBtn, { borderColor: theme.rule, flex: 1 }]}
          onPress={() => answer(false)}
          activeOpacity={0.8}
        >
          <Icon name="close" size={14} color={theme.textPrimary} />
          <Text style={[styles.noBtnText, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.yesBtn, { backgroundColor: theme.textPrimary, flex: 1 }]}
          onPress={() => answer(true)}
          activeOpacity={0.85}
        >
          <Text style={[styles.yesBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>Yes</Text>
          <Icon name="check" size={14} color={theme.textInverse} />
        </TouchableOpacity>
      </View>

      {/* Progress ticks */}
      <View style={styles.ticks}>
        {ex.pairs.map((_, i) => (
          <View key={i} style={[styles.tick, { backgroundColor: i < idx ? theme.textPrimary : theme.rule }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  type:       { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  timer:      { fontSize: 13 },
  prompt:     { fontSize: 20, lineHeight: 26, marginTop: 10, marginBottom: spacing.lg, letterSpacing: -0.2 },
  pairCard:   { borderRadius: radius.xl, borderWidth: 1, padding: 40, alignItems: 'center', marginBottom: spacing.md },
  pairWord:   { fontSize: 42, lineHeight: 46, letterSpacing: -0.8 },
  pairEquals: { fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 10, marginBottom: 12 },
  pairMeaning: { fontStyle: 'italic', fontSize: 18, textAlign: 'center', lineHeight: 26 },
  yesNo:      { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  noBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderRadius: radius.full, paddingVertical: 14 },
  noBtnText:  { fontSize: 15 },
  yesBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  yesBtnText: { fontSize: 15 },
  ticks:      { flexDirection: 'row', gap: 4 },
  tick:       { flex: 1, height: 3, borderRadius: 2 },
  result:     { fontSize: 30, lineHeight: 34, letterSpacing: -0.3, marginTop: 14, marginBottom: spacing.lg },
  quoteCard:  { borderRadius: radius.lg, padding: 18, borderWidth: 1, marginBottom: spacing.lg },
  quoteText:  { fontStyle: 'italic', fontSize: 15, lineHeight: 23 },
  btn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  btnText:    { fontSize: 15 },
});
