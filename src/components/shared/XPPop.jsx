import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { typography } from '../../theme/theme';

export function XPPop({ amount, onDone }) {
  const { theme } = useTheme();
  const translateY = useSharedValue(0);
  const opacity    = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-60, { duration: 900 });
    opacity.value    = withSequence(
      withTiming(1,  { duration: 200 }),
      withTiming(0,  { duration: 700 }),
    );
    const timer = setTimeout(() => onDone?.(), 950);
    return () => clearTimeout(timer);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.text, { color: theme.accentGold }, style]}>
      +{amount} XP
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    alignSelf: 'center',
    ...typography.bodySemibold,
    fontSize: 18,
    zIndex: 100,
  },
});
