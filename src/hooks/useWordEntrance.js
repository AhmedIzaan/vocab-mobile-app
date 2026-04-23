import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

export function useWordEntrance() {
  const translateY = useSharedValue(40);
  const opacity    = useSharedValue(0);

  function triggerEntrance() {
    translateY.value = 40;
    opacity.value    = 0;
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    opacity.value    = withTiming(1, { duration: 350 });
  }

  const entranceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return { entranceStyle, triggerEntrance };
}
