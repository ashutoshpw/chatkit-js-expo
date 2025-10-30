import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../context';

export function Button({ text, variant = 'primary', onPress, disabled, loading, ...props }: any) {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary, color: theme.colors.primary };
      default:
        return { backgroundColor: theme.colors.primary, color: '#ffffff' };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: variantStyle.backgroundColor }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.color} />
      ) : (
        <Text style={[styles.text, { color: variantStyle.color }]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
