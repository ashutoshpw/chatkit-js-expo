import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Badge({ text, variant = 'default', ...props }: any) {
  const { theme } = useTheme();

  const getVariantColor = () => {
    switch (variant) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getVariantColor() + '20', borderColor: getVariantColor() }]}>
      <Text style={[styles.text, { color: getVariantColor() }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
