import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function TextComponent({ text, size = 'md', weight = 'regular', color, ...props }: any) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: theme.typography.fontSize[size as keyof typeof theme.typography.fontSize] || theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight[weight as keyof typeof theme.typography.fontWeight] || theme.typography.fontWeight.regular,
          color: color || theme.colors.text,
        },
      ]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    marginVertical: 2,
  },
});
