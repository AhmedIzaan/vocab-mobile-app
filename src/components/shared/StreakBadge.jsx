import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { useGame } from '../../gamification/GameContext';
import { Icon } from '../../icons/Icon';
import { typography, spacing, radius } from '../../theme/theme';

export function StreakBadge() {
  const { theme } = useTheme();
  const { streak } = useGame();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 700 }),
        withTiming(1.00, { duration: 700 }),
      ),
      -1,
      true
    );
  }, []);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.badge, { backgroundColor: theme.surface }]}>
      <Animated.View style={flameStyle}>
        <Icon name="flame" size={20} color={theme.streakFlame} />
      </Animated.View>
      <Text style={[typography.bodySemibold, { color: theme.textPrimary, marginLeft: 6 }]}>
        {streak}
      </Text>
      <Text style={[typography.metaSmall, { color: theme.textMuted, marginLeft: 4 }]}>
        DAY STREAK
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
});
