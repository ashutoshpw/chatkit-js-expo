import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Label({ text, required, ...props }: any) {
  const { theme } = useTheme();

  return (
    <Text style={[styles.label, { color: theme.colors.text }]}>
      {text}
      {required && <Text style={[styles.required, { color: theme.colors.error }]}> *</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 8,
  },
  required: {
    fontWeight: 'bold',
  },
});
