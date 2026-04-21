import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function UseInSentence({ ex, theme, onNext }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct = value.trim().toLowerCase() === ex.answer.toLowerCase();
  const parts = ex.template.split('____');
  const choices = ex.choices || ['quixotic', 'ephemeral', 'halcyon', 'sonder', 'petrichor'];

  const handleCheck = () => {
    setSubmitted(true);
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        FILL THE BLANK
      </Text>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {ex.prompt}
      </Text>

      {/* Sentence card */}
      <View style={[styles.sentenceCard, { backgroundColor: theme.card, borderColor: theme.rule }]}>
        <Text style={[styles.sentencePart, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
          {parts[0]}
          <View style={[
            styles.blankChip,
            {
              backgroundColor: submitted ? (correct ? theme.sageSoft : theme.accentSoft) : theme.background,
              borderColor: submitted ? (correct ? theme.accentSage : theme.accentTerracotta) : theme.accentTerracotta,
            },
          ]}>
            <Text style={[styles.blankText, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
              {value || '____'}
            </Text>
          </View>
          {parts[1]}
        </Text>
      </View>

      {/* Word choices */}
      <Text style={[styles.choiceLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
        CHOOSE
      </Text>
      <View style={styles.choices}>
        {choices.map(w => {
          const chosen = value === w;
          return (
            <TouchableOpacity
              key={w}
              onPress={() => { setValue(w); setSubmitted(false); }}
              style={[
                styles.choiceChip,
                {
                  backgroundColor: chosen ? theme.textPrimary : theme.card,
                  borderColor: chosen ? theme.textPrimary : theme.rule,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.choiceText, { color: chosen ? theme.textInverse : theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                {w}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!submitted && value !== '' && (
        <TouchableOpacity
          style={[styles.checkBtn, { backgroundColor: theme.textPrimary, marginTop: spacing.lg }]}
          onPress={handleCheck}
          activeOpacity={0.85}
        >
          <Text style={[styles.checkBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
            Check
          </Text>
          <Icon name="arrow" size={14} color={theme.textInverse} />
        </TouchableOpacity>
      )}

      {submitted && (
        <View style={styles.feedback}>
          <View style={[styles.feedbackCard, { backgroundColor: theme.card, borderColor: theme.rule }]}>
            <Text style={[styles.feedbackLabel, { color: correct ? theme.accentSage : theme.accentTerracotta, fontFamily: 'Inter_400Regular' }]}>
              {correct ? '✓ EXACTLY RIGHT' : `— TRY THE WORD ${ex.answer.toUpperCase()}`}
            </Text>
            <Text style={[styles.feedbackText, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
              An impossibly idealistic plan — like something out of Don Quixote.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.checkBtn, { backgroundColor: theme.textPrimary }]}
            onPress={() => onNext(correct)}
            activeOpacity={0.85}
          >
            <Text style={[styles.checkBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
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
  prompt:       { fontSize: 24, lineHeight: 30, marginTop: 14, marginBottom: spacing.lg, letterSpacing: -0.3 },
  sentenceCard: { borderRadius: radius.lg, padding: 22, borderWidth: 1, marginBottom: spacing.md },
  sentencePart: { fontStyle: 'italic', fontSize: 21, lineHeight: 32 },
  blankChip:    { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 2, minWidth: 90 },
  blankText:    { fontSize: 16, textAlign: 'center' },
  choiceLabel:  { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },
  choices:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceChip:   { borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  choiceText:   { fontSize: 15, fontStyle: 'italic' },
  checkBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  checkBtnText: { fontSize: 15 },
  feedback:     { marginTop: spacing.lg, gap: spacing.md },
  feedbackCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  feedbackLabel: { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  feedbackText: { fontStyle: 'italic', fontSize: 15, lineHeight: 23, marginTop: 6 },
});
