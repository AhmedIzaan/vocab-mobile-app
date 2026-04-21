import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius } from '../theme/theme';
import { Icon } from '../icons/Icon';
import { ProgressBar } from '../components/shared/ProgressBar';

export default function WordDetail({ navigation, route }) {
  const { theme } = useTheme();
  const { words, wordIndex = 0 } = route.params;
  const word = words[wordIndex];
  const [saved, setSaved] = useState(false);
  const total = words.length;

  const goNext = () => {
    if (wordIndex + 1 < total) {
      navigation.replace('WordDetail', { words, wordIndex: wordIndex + 1 });
    } else {
      navigation.navigate('Main', { screen: 'Exercise', params: { words } });
    }
  };

  const highlightWord = (sentence) => {
    const re = new RegExp(`(${word.word})`, 'i');
    const parts = sentence.split(re);
    return parts.map((part, i) =>
      re.test(part)
        ? <Text key={i} style={{ color: theme.textPrimary, fontWeight: '600', fontStyle: 'normal' }}>{part}</Text>
        : <Text key={i}>{part}</Text>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Top chrome */}
      <View style={[styles.chrome, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.rule }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={14} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.wordCount, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          Word {String(wordIndex + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}
        </Text>
        <TouchableOpacity
          style={[styles.iconBtn, {
            backgroundColor: saved ? theme.textPrimary : theme.card,
            borderColor: saved ? theme.textPrimary : theme.rule,
          }]}
          onPress={() => setSaved(!saved)}
        >
          <Icon name="bookmark" size={14} color={saved ? theme.textInverse : theme.textPrimary} filled={saved} />
        </TouchableOpacity>
      </View>

      {/* Progress dots */}
      <View style={[styles.progressRow, { paddingHorizontal: spacing.md }]}>
        {words.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i <= wordIndex ? theme.textPrimary : theme.rule },
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Word header */}
        <View style={styles.wordHeader}>
          <View style={styles.posMeta}>
            <Text style={[styles.pos, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              {word.pos}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>·</Text>
            <Text style={[styles.phonetic, { color: theme.textMuted, fontFamily: 'SourceSerif4_400Regular' }]}>
              {word.phonetic}
            </Text>
            <TouchableOpacity style={{ marginLeft: 2 }}>
              <Icon name="speaker" size={16} color={theme.accentTerracotta} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.wordTitle, { color: theme.textPrimary, fontFamily: 'Newsreader_700Bold' }]}>
            {word.word}
          </Text>
        </View>

        {/* Meaning */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
            MEANING
          </Text>
          <Text style={[styles.meaning, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
            {word.meaning}
          </Text>
        </View>

        {/* Examples */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
            IN A SENTENCE
          </Text>
          {word.examples.map((ex, i) => (
            <View
              key={i}
              style={[
                styles.exampleCard,
                { backgroundColor: theme.card, borderColor: theme.rule, borderLeftColor: theme.accentTerracotta },
              ]}
            >
              <Text style={[styles.exampleText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                {highlightWord(ex)}
              </Text>
            </View>
          ))}
        </View>

        {/* Etymology */}
        <View style={[styles.etymologyCard, { borderColor: theme.rule }]}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
            ETYMOLOGY
          </Text>
          <Text style={[styles.etymologyText, { color: theme.textSecondary, fontFamily: 'Newsreader_400Regular' }]}>
            {word.etymology}
          </Text>
        </View>

        {/* Synonyms / Antonyms */}
        <View style={styles.synAntRow}>
          {[
            { label: 'SIMILAR',  items: word.synonyms, color: theme.accentSage },
            { label: 'OPPOSITE', items: word.antonyms, color: theme.accentTerracotta },
          ].map((grp, i) => (
            <View
              key={i}
              style={[styles.synCard, { backgroundColor: theme.card, borderColor: theme.rule }]}
            >
              <Text style={[styles.sectionLabel, { color: grp.color, fontFamily: 'Inter_400Regular' }]}>
                {grp.label}
              </Text>
              <View style={styles.chipWrap}>
                {grp.items.length === 0 ? (
                  <Text style={[styles.dash, { color: theme.textMuted, fontFamily: 'Newsreader_400Regular' }]}>—</Text>
                ) : grp.items.map((w, j) => (
                  <Text key={j} style={[styles.synWord, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                    {w}{j < grp.items.length - 1 ? ',' : ''}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCta, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: theme.textPrimary }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
            {wordIndex + 1 === total ? 'Begin exercises' : 'Next word'}
          </Text>
          <Icon name="arrow" size={14} color={theme.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1 },
  chrome:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  iconBtn:    { width: 36, height: 36, borderRadius: radius.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  wordCount:  { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: spacing.sm },
  dot:        { flex: 1, height: 2, borderRadius: 2 },
  scroll:     { flex: 1 },
  content:    { padding: spacing.md },
  wordHeader: { marginTop: 10, marginBottom: spacing.lg },
  posMeta:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  pos:        { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  phonetic:   { fontSize: 13, fontStyle: 'italic' },
  wordTitle:  { fontSize: 52, lineHeight: 56, letterSpacing: -1.2 },
  section:    { marginBottom: spacing.lg, gap: 10 },
  sectionLabel: { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  meaning:    { fontSize: 22, lineHeight: 30, fontStyle: 'italic' },
  exampleCard: { borderRadius: radius.md, padding: 14, paddingLeft: 18, borderWidth: 1, borderLeftWidth: 3 },
  exampleText: { fontSize: 15, lineHeight: 23, fontStyle: 'italic' },
  etymologyCard: { borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, gap: 8 },
  etymologyText: { fontSize: 15, fontStyle: 'italic', lineHeight: 23 },
  synAntRow:  { flexDirection: 'row', gap: 10 },
  synCard:    { flex: 1, borderRadius: radius.md, padding: 14, borderWidth: 1, gap: 8 },
  chipWrap:   { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  synWord:    { fontSize: 14 },
  dash:       { fontStyle: 'italic', fontSize: 13 },
  bottomCta:  { padding: spacing.md, paddingBottom: spacing.lg },
  nextBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  nextBtnText: { fontSize: 15 },
});
