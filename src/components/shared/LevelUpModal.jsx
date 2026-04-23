import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withDelay, withSequence, withTiming,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';
import { useGame } from '../../gamification/GameContext';
import { LEVEL_TITLES } from '../../gamification/config';
import { typography, spacing, radius } from '../../theme/theme';

export function LevelUpModal() {
  const { theme } = useTheme();
  const { levelUpData, dismissLevelUp } = useGame();

  const scale    = useSharedValue(0);
  const opacity  = useSharedValue(0);
  const badgeRot = useSharedValue(0);

  useEffect(() => {
    if (levelUpData) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      opacity.value  = withTiming(1, { duration: 200 });
      scale.value    = withSpring(1, { damping: 12, stiffness: 180 });
      badgeRot.value = withDelay(400,
        withSequence(
          withTiming(-8, { duration: 80 }),
          withTiming( 8, { duration: 80 }),
          withTiming(-5, { duration: 80 }),
          withTiming( 5, { duration: 80 }),
          withTiming( 0, { duration: 80 }),
        )
      );
    } else {
      scale.value   = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [levelUpData]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle    = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const badgeStyle   = useAnimatedStyle(() => ({
    transform: [{ rotate: `${badgeRot.value}deg` }],
  }));

  if (!levelUpData) return null;

  return (
    <Modal transparent visible animStatusBarHidden onRequestClose={dismissLevelUp}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <ConfettiCannon
          count={120}
          origin={{ x: 200, y: -20 }}
          colors={[theme.accentGold, theme.accentTerracotta, theme.accentSage, '#ffffff']}
          fadeOut
        />

        <Animated.View style={[styles.card, { backgroundColor: theme.surface }, cardStyle]}>
          <Animated.View style={[styles.badge, { backgroundColor: theme.accentGold }, badgeStyle]}>
            <Text style={styles.badgeText}>{levelUpData.newLevel}</Text>
          </Animated.View>

          <Text style={[typography.metaSmall, { color: theme.accentGold, marginTop: spacing.md }]}>
            LEVEL UP!
          </Text>
          <Text style={[typography.displayMedium, { color: theme.textPrimary, marginTop: spacing.xs }]}>
            {LEVEL_TITLES[levelUpData.newLevel]}
          </Text>
          <Text style={[typography.bodyMedium, { color: theme.textMuted, marginTop: spacing.sm, textAlign: 'center' }]}>
            You've reached Level {levelUpData.newLevel}.{'\n'}Keep building your vocabulary!
          </Text>

          <Pressable
            onPress={dismissLevelUp}
            style={[styles.button, { backgroundColor: theme.accentTerracotta }]}
          >
            <Text style={[typography.bodySemibold, { color: '#fff' }]}>Continue</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    width: '82%',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  badge: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  button: {
    marginTop: spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
  },
});
