import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Title({ text, level = 1, ...props }: any) {
  const { theme } = useTheme();

  const fontSize = level === 1 ? theme.typography.fontSize.xl : level === 2 ? theme.typography.fontSize.lg : theme.typography.fontSize.md;

  return (
    <Text style={[styles.title, { fontSize, color: theme.colors.text }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
    marginVertical: 4,
  },
});
