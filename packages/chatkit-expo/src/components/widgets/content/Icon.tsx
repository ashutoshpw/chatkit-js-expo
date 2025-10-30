import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Icon({ name, size = 24, color, ...props }: any) {
  const { theme } = useTheme();

  // Map icon names to emoji (simplified)
  const iconMap: Record<string, string> = {
    'sparkle': '✨',
    'check': '✓',
    'close': '✕',
    'info': 'ℹ',
    'warning': '⚠',
    'error': '⚠',
    'search': '🔍',
    'settings': '⚙',
    'user': '👤',
    'star': '⭐',
  };

  return (
    <Text style={[styles.icon, { fontSize: size, color: color || theme.colors.text }]}>
      {iconMap[name] || '•'}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 4,
  },
});
