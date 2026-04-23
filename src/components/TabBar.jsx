import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSequence, withTiming, withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Icon } from '../icons/Icon';

const TABS = [
  { id: 'Home',     label: 'Today',    icon: 'home' },
  { id: 'Exercise', label: 'Practice', icon: 'library' },
  { id: 'Progress', label: 'Progress', icon: 'chart' },
  { id: 'Profile',  label: 'You',      icon: 'user' },
];

function TabIcon({ name, focused, color, size }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withTiming(1.3, { duration: 120 }),
        withSpring(1,   { damping: 8 }),
      );
    }
  }, [focused]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <Icon name={name} size={size} color={color} filled={focused} />
    </Animated.View>
  );
}

export function TabBar({ state, navigation }) {
  const { theme } = useTheme();
  const insets    = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom || 16, backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {TABS.map((tab, index) => {
        const focused = state.index === index;
        const color   = focused ? theme.accentTerracotta : theme.textMuted;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.id)}
            activeOpacity={0.7}
          >
            {focused && (
              <View style={[styles.activeIndicator, { backgroundColor: theme.accentTerracotta }]} />
            )}
            <TabIcon name={tab.icon} size={22} color={color} focused={focused} />
            <Text style={[styles.label, { color, fontFamily: 'Inter_400Regular' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 2,
    borderRadius: 2,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
