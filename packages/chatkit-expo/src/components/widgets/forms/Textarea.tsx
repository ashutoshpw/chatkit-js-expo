import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Textarea({ placeholder, value: initialValue, onChange, rows = 4, ...props }: any) {
  const { theme } = useTheme();
  const [value, setValue] = useState(initialValue || '');

  const handleChange = (text: string) => {
    setValue(text);
    onChange?.(text);
  };

  return (
    <TextInput
      style={[styles.textarea, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text, minHeight: rows * 20 }]}
      value={value}
      onChangeText={handleChange}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      multiline
      numberOfLines={rows}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 4,
    textAlignVertical: 'top',
  },
});
