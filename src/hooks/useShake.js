import { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export function useShake() {
  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  function triggerShake() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shakeX.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming( 12, { duration: 60 }),
      withTiming( -8, { duration: 60 }),
      withTiming(  8, { duration: 60 }),
      withTiming( -4, { duration: 60 }),
      withTiming(  0, { duration: 60 }),
    );
  }

  return { shakeStyle, triggerShake };
}
