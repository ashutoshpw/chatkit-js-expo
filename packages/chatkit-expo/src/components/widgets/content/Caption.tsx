import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Caption({ text, ...props }: any) {
  const { theme } = useTheme();

  return (
    <Text style={[styles.caption, { fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  caption: {
    marginVertical: 2,
  },
});
