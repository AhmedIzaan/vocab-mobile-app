import React from 'react';
import { View, StyleSheet } from 'react-native';
import { shadows, radius } from '../../theme/theme';

export function Card({ children, style, theme, elevation = 'md' }) {
  const shadow = shadows[elevation] || shadows.md;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.rule },
        shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
