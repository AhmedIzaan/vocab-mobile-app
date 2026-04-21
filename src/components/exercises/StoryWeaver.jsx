import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function StoryWeaver({ ex, theme, onNext }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        STORY WEAVER
      </Text>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        {ex.prompt}
      </Text>

      {/* Story card */}
      <View style={[styles.storyCard, { backgroundColor: theme.card, borderColor: theme.rule }]}>
        <Text style={[styles.storyText, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
          {ex.template.map((part, i) => {
            const isWord = ex.words.includes(part);
            if (isWord) {
              return (
                <Text
                  key={i}
                  style={[
                    styles.highlight,
                    {
                      backgroundColor: submitted ? theme.sageSoft : theme.background,
                      borderColor: submitted ? theme.accentSage : theme.accentTerracotta,
                      color: theme.textPrimary,
                      fontFamily: 'Inter_600SemiBold',
                    },
                  ]}
                >
                  {part.toLowerCase()}
                </Text>
              );
            }
            return <Text key={i}>{part}</Text>;
          })}
        </Text>
      </View>

      {/* Words used */}
      <Text style={[styles.usedLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
        WORDS USED
      </Text>
      <View style={styles.wordChips}>
        {ex.words.map(w => (
          <View key={w} style={[styles.wordChip, { backgroundColor: theme.sageSoft, borderColor: theme.accentSage }]}>
            <Text style={[styles.wordChipText, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {w}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        {!submitted ? (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.textPrimary }]}
            onPress={() => setSubmitted(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              That works for me
            </Text>
            <Icon name="check" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.textPrimary }]}
            onPress={() => onNext(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              Finish session
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
  prompt:      { fontSize: 22, lineHeight: 28, marginTop: 14, marginBottom: spacing.lg, letterSpacing: -0.3 },
  storyCard:   { borderRadius: radius.lg, borderWidth: 1, padding: 22, marginBottom: spacing.md },
  storyText:   { fontStyle: 'italic', fontSize: 18, lineHeight: 28 },
  highlight:   { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, fontStyle: 'normal', marginHorizontal: 2 },
  usedLabel:   { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },
  wordChips:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  wordChip:    { borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  wordChipText: { fontSize: 14, fontStyle: 'italic' },
  btn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  btnText:     { fontSize: 15 },
});
