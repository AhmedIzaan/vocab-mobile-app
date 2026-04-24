import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuthContext } from '../auth/AuthContext';
import { spacing, radius } from '../theme/theme';
import { Icon } from '../icons/Icon';

const PRESETS = [
  { n: 3,  label: 'Gentle',    sub: '~4 min a day' },
  { n: 5,  label: 'Balanced',  sub: '~7 min a day' },
  { n: 10, label: 'Ambitious', sub: '~15 min a day' },
];

const DIFFICULTIES = [
  { key: 'beginner',     label: 'Beginner',     sub: 'Common, everyday words' },
  { key: 'intermediate', label: 'Intermediate', sub: 'Rich vocabulary, varied usage' },
  { key: 'advanced',     label: 'Advanced',     sub: 'Rare, literary, precise' },
];

export default function Onboarding({ navigation }) {
  const { theme } = useTheme();
  const { updateProfile, profile } = useAuthContext();
  const [step,    setStep]    = useState(1);
  const [goal,    setGoal]    = useState(5);
  const [loading, setLoading] = useState(false);

  const scales = useRef(PRESETS.map(() => new Animated.Value(1))).current;

  const pressScale = (index) => {
    Animated.spring(scales[index], {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start(() => {
      Animated.spring(scales[index], {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
      }).start();
    });
  };

  const handleConfirm = async (difficulty) => {
    setLoading(true);
    await updateProfile({ daily_goal: goal, difficulty });
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.inner}>
        <Text style={[styles.meta, { color: theme.textMuted, fontFamily: 'SourceSerif4_400Regular' }]}>
          {profile?.username ? `WELCOME, ${profile.username.toUpperCase()}` : 'DAY 01 · SETUP'}
        </Text>

        {step === 1 ? (
          <>
            <Text style={[styles.headline, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {'How many words\n'}
              <Text style={{ fontStyle: 'italic', color: theme.accentTerracotta }}>a day?</Text>
            </Text>
            <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              Small, steady doses. You can always change this later from your profile.
            </Text>

            <View style={{ flex: 1 }} />

            <View style={styles.presets}>
              {PRESETS.map((p, i) => {
                const selected = goal === p.n;
                return (
                  <Animated.View key={p.n} style={{ transform: [{ scale: scales[i] }] }}>
                    <TouchableOpacity
                      onPress={() => { setGoal(p.n); pressScale(i); }}
                      style={[styles.presetCard, {
                        backgroundColor: selected ? theme.textPrimary : theme.card,
                        borderColor:     selected ? theme.textPrimary : theme.rule,
                      }]}
                      activeOpacity={0.9}
                    >
                      <Text style={[styles.presetNum, { color: selected ? theme.textInverse : theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
                        {p.n}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.presetLabel, { color: selected ? theme.textInverse : theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
                          {p.label}
                        </Text>
                        <Text style={[styles.presetSub, { color: selected ? theme.textInverse : theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                          {p.sub}
                        </Text>
                      </View>
                      {selected && <Icon name="check" size={16} color={theme.textInverse} />}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            <View style={{ height: spacing.md }} />

            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: theme.accentTerracotta }]}
              onPress={() => setStep(2)}
              activeOpacity={0.85}
            >
              <Text style={[styles.confirmBtnText, { fontFamily: 'Inter_600SemiBold' }]}>
                Next — set difficulty
              </Text>
              <Icon name="arrow" size={14} color="#FBF7EE" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.headline, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
              {'What level of\n'}
              <Text style={{ fontStyle: 'italic', color: theme.accentTerracotta }}>vocabulary?</Text>
            </Text>
            <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              Tap to select — you can change this any time from your profile.
            </Text>

            <View style={{ flex: 1 }} />

            <View style={styles.presets}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  onPress={() => !loading && handleConfirm(d.key)}
                  disabled={loading}
                  style={[styles.presetCard, {
                    backgroundColor: theme.card,
                    borderColor: theme.rule,
                    opacity: loading ? 0.6 : 1,
                  }]}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.presetLabel, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
                      {d.label}
                    </Text>
                    <Text style={[styles.presetSub, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                      {d.sub}
                    </Text>
                  </View>
                  <Icon name="arrow" size={14} color={theme.textMuted} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: spacing.md }} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  inner:       { flex: 1, padding: spacing.lg, paddingTop: spacing.xxl },
  meta:        { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  headline:    { fontSize: 44, lineHeight: 50, marginTop: 16, marginBottom: 12, letterSpacing: -0.5 },
  sub:         { fontSize: 15, lineHeight: 23, maxWidth: 280 },
  presets:     { gap: 12 },
  presetCard:  { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1 },
  presetNum:   { fontSize: 40, lineHeight: 44, width: 48 },
  presetLabel: { fontSize: 15 },
  presetSub:   { fontSize: 13, marginTop: 2 },
  confirmBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  confirmBtnText: { fontSize: 15, color: '#FBF7EE' },
});
