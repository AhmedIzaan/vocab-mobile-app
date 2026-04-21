import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { spacing, radius } from '../../theme/theme';
import { Icon } from '../../icons/Icon';

export default function Flashcard({ ex, words, theme, onNext }) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    if (flipped) return;
    Animated.spring(flipAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
    setFlipped(true);
  };

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const word = words[ex.wordIdx];

  return (
    <View>
      <Text style={[styles.type, { color: theme.accentTerracotta, fontFamily: 'SourceSerif4_400Regular' }]}>
        FLASHCARD
      </Text>
      <Text style={[styles.prompt, { color: theme.textPrimary, fontFamily: 'Newsreader_400Regular' }]}>
        Tap the card. Can you recall it?
      </Text>

      <View style={styles.cardWrap}>
        {/* Front */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.rule },
            { transform: [{ rotateY: frontRotate }] },
          ]}
        >
          <TouchableOpacity style={styles.cardInner} onPress={handleFlip} activeOpacity={0.9}>
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
          </TouchableOpacity>
        </Animated.View>

        {/* Back */}
        <Animated.View
          pointerEvents={flipped ? 'auto' : 'none'}
          style={[
            styles.card,
            styles.cardBack,
            { backgroundColor: theme.textPrimary },
            { transform: [{ rotateY: backRotate }] },
          ]}
        >
          <View style={styles.cardInner}>
            <Text style={[styles.frontMeta, { color: theme.goldSoft, fontFamily: 'Inter_400Regular' }]}>
              MEANING
            </Text>
            <View style={styles.frontCenter}>
              <Text style={[styles.backText, { color: theme.textInverse, fontFamily: 'Newsreader_400Regular' }]}>
                {ex.back}
              </Text>
            </View>
            <Text style={[styles.tapHint, { color: theme.goldSoft, fontFamily: 'Inter_400Regular' }]}>
              DID YOU REMEMBER?
            </Text>
          </View>
        </Animated.View>
      </View>

      {flipped && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.noBtn, { borderColor: theme.rule }]}
            onPress={() => onNext(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.noBtnText, { color: theme.textPrimary, fontFamily: 'Inter_600SemiBold' }]}>
              Not yet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.yesBtn, { backgroundColor: theme.textPrimary, flex: 1 }]}
            onPress={() => onNext(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.yesBtnText, { color: theme.textInverse, fontFamily: 'Inter_600SemiBold' }]}>
              I knew it
            </Text>
            <Icon name="check" size={14} color={theme.textInverse} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  type:         { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  prompt:       { fontSize: 24, lineHeight: 30, marginTop: 14, marginBottom: spacing.lg, letterSpacing: -0.3 },
  cardWrap:     { height: 300, position: 'relative' },
  card:         { position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: radius.xl, borderWidth: 1, backfaceVisibility: 'hidden' },
  cardBack:     { backfaceVisibility: 'hidden' },
  cardInner:    { flex: 1, padding: 28, justifyContent: 'space-between' },
  frontMeta:    { fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' },
  frontCenter:  { alignItems: 'center' },
  frontWord:    { fontSize: 52, lineHeight: 56, letterSpacing: -1, textAlign: 'center' },
  frontPhonetic: { fontSize: 11, marginTop: 10, letterSpacing: 0.2 },
  tapHint:      { textAlign: 'center', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
  backText:     { fontStyle: 'italic', fontSize: 22, lineHeight: 30, textAlign: 'center' },
  actions:      { flexDirection: 'row', gap: 10, marginTop: spacing.md },
  noBtn:        { flex: 1, borderWidth: 1, borderRadius: radius.full, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  noBtnText:    { fontSize: 15 },
  yesBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: radius.full, paddingVertical: 14 },
  yesBtnText:   { fontSize: 15 },
  goldSoft: '#EBD9AE',
});
