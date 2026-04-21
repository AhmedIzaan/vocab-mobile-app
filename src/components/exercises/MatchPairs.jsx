import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function MatchPairs({ ex, theme, onNext }) {
  const [shuffled] = useState(() => [...ex.pairs].sort(() => Math.random() - 0.5));
  const [selectedWord, setSelectedWord] = useState(null);
  const [matched, setMatched] = useState({});

  const pick = (kind, val) => {
    if (kind === 'word') {
      if (matched[val]) return;
      setSelectedWord(val);
    } else {
      if (!selectedWord) return;
      if (Object.values(matched).includes(val)) return;
      const isCorrect = ex.pairs.find(p => p.word === selectedWord)?.meaning === val;
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setMatched(m => ({ ...m, [selectedWord]: val }));
      setSelectedWord(null);
    }
  };

  const done = Object.keys(matched).length === ex.pairs.length;
  const allCorrect = done && ex.pairs.every(p => matched[p.word] === p.meaning);

  const wordState = (word) => {
    const isMatched = !!matched[word];
    const isSelected = selectedWord === word;
    if (isSelected) return { bg: theme.textPrimary, fg: theme.textInverse, border: theme.textPrimary };
    if (isMatched) {
      const correct = ex.pairs.find(p => p.word === word)?.meaning === matched[word];
      return { bg: correct ? theme.sageSoft : theme.accentSoft, fg: theme.textPrimary, border: correct ? theme.accentSage : theme.accentTerracotta };
    }
    return { bg: theme.card, fg: theme.textPrimary, border: theme.rule };
  };

  const meaningState = (meaning) => {
    const used = Object.values(matched).includes(meaning);
    if (!used) return { bg: theme.card, border: theme.rule };
    const wordKey = Object.keys(matched).find(k => matched[k] === meaning);
    const correct = ex.pairs.find(p => p.word === wordKey)?.meaning === meaning;
    return { bg: correct ? theme.sageSoft : theme.accentSoft, border: correct ? theme.accentSage : theme.accentTerracotta };
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        MATCH THE PAIRS
      </Text>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {ex.prompt}
      </Text>

      <View style={styles.columns}>
        {/* Words column */}
        <View style={styles.col}>
          {ex.pairs.map(p => {
            const s = wordState(p.word);
            return (
              <TouchableOpacity
                key={p.word}
                onPress={() => pick('word', p.word)}
                style={[styles.wordBtn, { backgroundColor: s.bg, borderColor: s.border }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.wordBtnText, { color: s.fg, fontFamily: 'Newsreader_400Regular' }]}>
                  {p.word}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Meanings column */}
        <View style={[styles.col, { flex: 1.3 }]}>
          {shuffled.map(p => {
            const s = meaningState(p.meaning);
            return (
              <TouchableOpacity
                key={p.meaning}
                onPress={() => pick('meaning', p.meaning)}
                style={[styles.meaningBtn, { backgroundColor: s.bg, borderColor: s.border }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.meaningBtnText, { color: theme.textPrimary, fontFamily: 'Inter_400Regular' }]}>
                  {p.meaning}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {done && (
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: theme.textPrimary, marginTop: spacing.lg }]}
          onPress={() => onNext(allCorrect)}
          activeOpacity={0.85}
        >
          <Text style={[styles.continueBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
            Continue
          </Text>
          <Icon name="arrow" size={14} color={theme.textInverse} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  type:         { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  prompt:       { fontSize: 24, lineHeight: 30, marginTop: 14, marginBottom: spacing.lg, letterSpacing: -0.3 },
  columns:      { flexDirection: 'row', gap: 10 },
  col:          { flex: 1, gap: 8 },
  wordBtn:      { borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  wordBtnText:  { fontSize: 17, fontWeight: '500' },
  meaningBtn:   { borderRadius: 14, borderWidth: 1, padding: 12, minHeight: 54, justifyContent: 'center' },
  meaningBtnText: { fontSize: 13, lineHeight: 18 },
  continueBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  continueBtnText: { fontSize: 15 },
});
