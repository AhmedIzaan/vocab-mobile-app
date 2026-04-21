import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function MCQ({ ex, words, theme, onNext }) {
  const [picked, setPicked] = useState(null);
  const word = words[ex.wordIdx];

  const handlePick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === ex.answer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        MULTIPLE CHOICE
      </Text>
      <Text style={[styles.question, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {ex.question}
      </Text>
      {word && (
        <View style={[styles.wordChip, { backgroundColor: theme.card, borderColor: theme.rule }]}>
          <Text style={[styles.wordChipText, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
            {word.word}
          </Text>
        </View>
      )}

      <View style={styles.options}>
        {ex.options.map((opt, i) => {
          const selected = picked === i;
          const isCorrect = i === ex.answer;
          const showState = picked !== null;
          let bg = theme.card;
          let border = theme.rule;
          if (showState && isCorrect)         { bg = theme.sageSoft;   border = theme.accentSage; }
          else if (showState && selected)     { bg = theme.accentSoft; border = theme.accentTerracotta; }

          return (
            <TouchableOpacity
              key={i}
              onPress={() => handlePick(i)}
              activeOpacity={picked === null ? 0.8 : 1}
              style={[styles.option, { backgroundColor: bg, borderColor: border }]}
            >
              <View style={[
                styles.optionBullet,
                {
                  borderColor: selected || (showState && isCorrect) ? theme.textPrimary : theme.rule,
                  backgroundColor: showState && isCorrect ? theme.accentSage : 'transparent',
                },
              ]}>
                {showState && isCorrect
                  ? <Icon name="check" size={12} color="#FBF7EE" />
                  : <Text style={[styles.optionLetter, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                      {String.fromCharCode(65 + i)}
                    </Text>
                }
              </View>
              <Text style={[styles.optionText, { color: theme.textPrimary, fontFamily: 'Inter_400Regular' }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {picked !== null && (
        <View style={styles.feedback}>
          <View style={[styles.feedbackCard, { backgroundColor: theme.card, borderColor: theme.rule }]}>
            <Text style={[styles.feedbackLabel, { color: picked === ex.answer ? theme.accentSage : theme.accentTerracotta, fontFamily: 'Inter_400Regular' }]}>
              {picked === ex.answer ? '✓ CORRECT' : '— NOT QUITE'}
            </Text>
            {word && (
              <Text style={[styles.feedbackText, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
                {word.meaning}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: theme.textPrimary }]}
            onPress={() => onNext(picked === ex.answer)}
            activeOpacity={0.85}
          >
            <Text style={[styles.continueBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Continue
            </Text>
            <Icon name="arrow" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  type:         { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  question:     { fontSize: 26, lineHeight: 32, marginTop: 14, marginBottom: 8, letterSpacing: -0.3 },
  wordChip:     { alignSelf: 'flex-start', borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, marginBottom: spacing.lg },
  wordChipText: { fontSize: 15, fontStyle: 'italic' },
  options:      { gap: 10 },
  option:       { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, borderWidth: 1, padding: 16 },
  optionBullet: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  optionLetter: { fontSize: 11 },
  optionText:   { flex: 1, fontSize: 15, lineHeight: 22 },
  feedback:     { marginTop: spacing.lg, gap: spacing.md },
  feedbackCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  feedbackLabel: { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  feedbackText: { fontStyle: 'italic', fontSize: 15, lineHeight: 23, marginTop: 6 },
  continueBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  continueBtnText: { fontSize: 15 },
});
