import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { useGame } from '../../gamification/GameContext';
import { getXPProgress, LEVEL_TITLES } from '../../gamification/config';
import { typography, spacing, radius } from '../../theme/theme';

export function XPBar() {
  const { theme } = useTheme();
  const { xp, level } = useGame();
  const { percent, earned, required } = getXPProgress(xp, level);

  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(percent, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent]);

  const animatedBar = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[typography.metaSmall, { color: theme.textMuted }]}>
          LVL {level} · {LEVEL_TITLES[level]}
        </Text>
        <Text style={[typography.metaSmall, { color: theme.textMuted }]}>
          {earned} / {required} XP
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: theme.accentGold }, animatedBar]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  labelRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  track:     { height: 8, borderRadius: radius.full, overflow: 'hidden' },
  fill:      { height: '100%', borderRadius: radius.full },
});
