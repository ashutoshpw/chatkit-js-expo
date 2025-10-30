import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Input({ placeholder, value: initialValue, onChange, ...props }: any) {
  const { theme } = useTheme();
  const [value, setValue] = useState(initialValue || '');

  const handleChange = (text: string) => {
    setValue(text);
    onChange?.(text);
  };

  return (
    <TextInput
      style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
      value={value}
      onChangeText={handleChange}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 4,
  },
});
