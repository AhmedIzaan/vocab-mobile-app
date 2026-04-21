import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { spacing, radius } from '../theme/theme';
import { Icon } from '../icons/Icon';
import { ProgressBar } from '../components/shared/ProgressBar';
import { sampleWords, EXERCISES } from '../data/words';

import MCQ from '../components/exercises/MCQ';
import MatchPairs from '../components/exercises/MatchPairs';
import Flashcard from '../components/exercises/Flashcard';
import UseInSentence from '../components/exercises/UseInSentence';
import Association from '../components/exercises/Association';
import Spell from '../components/exercises/Spell';
import SpeedRound from '../components/exercises/SpeedRound';
import StoryWeaver from '../components/exercises/StoryWeaver';

const EXERCISE_COMPONENTS = {
  mcq:         MCQ,
  match:       MatchPairs,
  flashcard:   Flashcard,
  sentence:    UseInSentence,
  association: Association,
  spell:       Spell,
  speed:       SpeedRound,
  story:       StoryWeaver,
};

export default function Exercise({ navigation, route }) {
  const { theme } = useTheme();
  const words = route?.params?.words || sampleWords.slice(0, 5);
  const exercises = EXERCISES;

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const handleNext = (correct) => {
    if (correct) setScore(s => s + 1);
    if (idx + 1 >= exercises.length) {
      navigation.replace('SessionComplete', { score: score + (correct ? 1 : 0), total: exercises.length, words });
    } else {
      setIdx(i => i + 1);
    }
  };

  const ex = exercises[idx];
  const ExComponent = EXERCISE_COMPONENTS[ex.type];
  const progress = idx / exercises.length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Top chrome */}
      <View style={[styles.chrome, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
        <View style={styles.progressWrap}>
          <ProgressBar
            progress={progress}
            color={theme.accentTerracotta}
            backgroundColor={theme.tint}
            height={6}
          />
        </View>
        <Text style={[styles.counter, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
          {String(idx + 1).padStart(2, '0')}/{String(exercises.length).padStart(2, '0')}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.exerciseArea}>
          {ExComponent && (
            <ExComponent
              ex={ex}
              words={words}
              theme={theme}
              onNext={handleNext}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  chrome:       { flexDirection: 'row', alignItems: 'center', gap: 14, padding: spacing.md },
  closeBtn:     { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  progressWrap: { flex: 1 },
  counter:      { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  exerciseArea: { flex: 1, padding: spacing.md },
});
