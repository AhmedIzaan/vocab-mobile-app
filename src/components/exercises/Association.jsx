import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function Association({ ex, theme, onNext }) {
  const [picked, setPicked] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i) => {
    if (submitted) return;
    const next = new Set(picked);
    next.has(i) ? next.delete(i) : next.add(i);
    setPicked(next);
  };

  const allCorrect = ex.options.every((o, i) => o.correct === picked.has(i));

  const handleCheck = () => {
    setSubmitted(true);
    if (allCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const chipStyle = (opt, i) => {
    const on = picked.has(i);
    if (submitted) {
      if (on && opt.correct)  return { bg: theme.sageSoft, fg: theme.textPrimary, border: theme.accentSage };
      if (on && !opt.correct) return { bg: theme.accentSoft, fg: theme.textPrimary, border: theme.accentTerracotta };
      if (!on && opt.correct) return { bg: theme.card, fg: theme.textPrimary, border: theme.accentSage };
    }
    if (on) return { bg: theme.textPrimary, fg: theme.textInverse, border: theme.textPrimary };
    return { bg: theme.card, fg: theme.textPrimary, border: theme.rule };
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        WORD WEB
      </Text>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {ex.prompt}
      </Text>
      <View style={[styles.wordBadge, { backgroundColor: theme.textPrimary }]}>
        <Text style={[styles.wordBadgeText, { color: theme.textInverse, fontFamily: 'Newsreader_400Regular' }]}>
          {ex.word}
        </Text>
      </View>

      <View style={styles.chips}>
        {ex.options.map((opt, i) => {
          const s = chipStyle(opt, i);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggle(i)}
              style={[styles.chip, { backgroundColor: s.bg, borderColor: s.border }]}
              activeOpacity={submitted ? 1 : 0.8}
            >
              <Text style={[styles.chipText, { color: s.fg, fontFamily: 'Newsreader_400Regular' }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.lg }}>
        {!submitted ? (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.textPrimary, opacity: picked.size === 0 ? 0.4 : 1 }]}
            onPress={handleCheck}
            disabled={picked.size === 0}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Check ({picked.size} picked)
            </Text>
            <Icon name="arrow" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.textPrimary }]}
            onPress={() => onNext(allCorrect)}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Continue
            </Text>
            <Icon name="arrow" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  type:        { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  prompt:      { fontSize: 24, lineHeight: 30, marginTop: 14, marginBottom: 8, letterSpacing: -0.3 },
  wordBadge:   { alignSelf: 'flex-start', borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 6, marginBottom: spacing.lg },
  wordBadgeText: { fontSize: 16, fontStyle: 'italic' },
  chips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:        { borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  chipText:    { fontSize: 15, fontStyle: 'italic' },
  btn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  btnText:     { fontSize: 15 },
});
