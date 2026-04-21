import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function Spell({ ex, theme, onNext }) {
  const [built, setBuilt] = useState([]);
  const [used, setUsed] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const pick = (letter, i) => {
    if (submitted || used.has(i)) return;
    setBuilt(b => [...b, { letter, idx: i }]);
    setUsed(u => new Set([...u, i]));
  };

  const unpick = (pos) => {
    if (submitted) return;
    const removed = built[pos];
    setBuilt(b => b.filter((_, i) => i !== pos));
    setUsed(u => { const n = new Set(u); n.delete(removed.idx); return n; });
  };

  const answer = built.map(b => b.letter).join('');
  const correct = answer.toLowerCase() === ex.word.toLowerCase();
  const complete = answer.length === ex.word.length;

  const handleCheck = () => {
    setSubmitted(true);
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const slotColor = submitted ? (correct ? theme.accentSage : theme.accentTerracotta) : theme.textPrimary;

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        SPELLING
      </Text>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {ex.prompt}
      </Text>

      {/* Build slots */}
      <View style={[styles.slotsCard, {
        backgroundColor: theme.card,
        borderColor: submitted && !correct ? theme.accentTerracotta : theme.rule,
      }]}>
        {Array.from({ length: ex.word.length }).map((_, i) => {
          const b = built[i];
          return (
            <TouchableOpacity
              key={i}
              onPress={() => b && unpick(i)}
              style={[styles.slot, { borderBottomColor: b ? slotColor : theme.textMuted }]}
            >
              <Text style={[styles.slotLetter, { color: slotColor, fontFamily: 'Newsreader_400Regular' }]}>
                {b ? b.letter.toLowerCase() : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Letter bank */}
      <View style={styles.letterBank}>
        {ex.letterBank.map((l, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => pick(l, i)}
            disabled={used.has(i)}
            style={[styles.letterTile, {
              backgroundColor: used.has(i) ? theme.tint : theme.card,
              borderColor: theme.rule,
              opacity: used.has(i) ? 0.4 : 1,
            }]}
          >
            <Text style={[styles.letterText, { color: used.has(i) ? theme.textMuted : theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: spacing.lg }}>
        {!submitted ? (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.textPrimary, opacity: complete ? 1 : 0.4 }]}
            onPress={handleCheck}
            disabled={!complete}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Check spelling
            </Text>
            <Icon name="arrow" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.textPrimary }]}
            onPress={() => onNext(correct)}
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
  type:       { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  prompt:     { fontSize: 22, lineHeight: 28, marginTop: 14, marginBottom: spacing.lg, letterSpacing: -0.3 },
  slotsCard:  { borderRadius: radius.lg, borderWidth: 1, padding: 24, flexDirection: 'row', gap: 4, justifyContent: 'center', flexWrap: 'wrap', minHeight: 72, alignItems: 'center', marginBottom: spacing.md },
  slot:       { width: 28, height: 40, borderBottomWidth: 2, alignItems: 'center', justifyContent: 'flex-end' },
  slotLetter: { fontSize: 28 },
  letterBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: spacing.md },
  letterTile: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontSize: 20 },
  btn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  btnText:    { fontSize: 15 },
});
