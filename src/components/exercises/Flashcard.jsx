import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';
import { useWordEntrance } from '../../hooks/useWordEntrance';

export default function Flashcard({ ex, words, theme, onNext }) {
  const [flipped, setFlipped] = useState(false);
  const rotate = useSharedValue(0);
  const { entranceStyle, triggerEntrance } = useWordEntrance();

  useEffect(() => {
    triggerEntrance();
  }, [ex]);

  const handleFlip = () => {
    if (flipped) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotate.value = withTiming(180, { duration: 400 });
    setFlipped(true);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  }));

  const word = words[ex.wordIdx];

  return (
    <Animated.View style={entranceStyle}>
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        FLASHCARD
      </Text>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        Tap the card. Can you recall it?
      </Text>

      <TouchableOpacity onPress={handleFlip} activeOpacity={0.9} style={styles.cardWrap}>
        {/* Front */}
        <Animated.View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.rule }, frontStyle]}>
          <View style={styles.cardInner}>
            <Text style={[styles.frontMeta, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              FRONT
            </Text>
            <View style={styles.frontCenter}>
              <Text style={[styles.frontWord, { color: theme.textPrimary, fontFamily: 'Newsreader_700Bold' }]}>
                {ex.front}
              </Text>
              {word && (
                <Text style={[styles.frontPhonetic, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
                  {word.phonetic}
                </Text>
              )}
            </View>
            <Text style={[styles.tapHint, { color: theme.textMuted, fontFamily: 'Inter_400Regular' }]}>
              TAP TO REVEAL
            </Text>
          </View>
        </Animated.View>

        {/* Back */}
        <Animated.View style={[styles.card, { backgroundColor: theme.textPrimary }, backStyle]}>
          <View style={styles.cardInner}>
            <Text style={[styles.frontMeta, { color: '#EBD9AE', fontFamily: 'Inter_400Regular' }]}>
              MEANING
            </Text>
            <View style={styles.frontCenter}>
              <Text style={[styles.backText, { color: theme.textInverse, fontFamily: 'Newsreader_400Regular' }]}>
                {ex.back}
              </Text>
            </View>
            <Text style={[styles.tapHint, { color: '#EBD9AE', fontFamily: 'Inter_400Regular' }]}>
              DID YOU REMEMBER?
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {flipped && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.noBtn, { borderColor: theme.rule }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onNext(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.noBtnText, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
              Not yet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.yesBtn, { backgroundColor: theme.textPrimary, flex: 1 }]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onNext(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={[styles.yesBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              I knew it
            </Text>
            <Icon name="check" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  type:          { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  prompt:        { fontSize: 24, lineHeight: 30, marginTop: 14, marginBottom: spacing.lg, letterSpacing: -0.3 },
  cardWrap:      { height: 300, position: 'relative' },
  card:          { position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: radius.xl, borderWidth: 1 },
  cardInner:     { flex: 1, padding: 28, justifyContent: 'space-between' },
  frontMeta:     { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  frontCenter:   { alignItems: 'center' },
  frontWord:     { fontSize: 52, lineHeight: 56, letterSpacing: -1, textAlign: 'center' },
  frontPhonetic: { fontSize: 11, marginTop: 10, letterSpacing: 0.2 },
  tapHint:       { textAlign: 'center', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
  backText:      { fontStyle: 'italic', fontSize: 22, lineHeight: 30, textAlign: 'center' },
  actions:       { flexDirection: 'row', gap: 10, marginTop: spacing.md },
  noBtn:         { flex: 1, borderWidth: 1, borderRadius: radius.full, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  noBtnText:     { fontSize: 15 },
  yesBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  yesBtnText:    { fontSize: 15 },
});
