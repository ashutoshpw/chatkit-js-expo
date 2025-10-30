import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function DatePicker({ value: initialValue, onChange, placeholder = 'Select date', ...props }: any) {
  const { theme } = useTheme();
  const [value, setValue] = useState<Date | null>(initialValue ? new Date(initialValue) : null);

  // Simplified date picker - in production, use a library like @react-native-community/datetimepicker
  const handlePress = () => {
    const now = new Date();
    setValue(now);
    onChange?.(now.toISOString());
  };

  return (
    <TouchableOpacity
      style={[styles.picker, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
      onPress={handlePress}
    >
      <Text style={[styles.text, { color: value ? theme.colors.text : theme.colors.textSecondary }]}>
        {value ? value.toLocaleDateString() : placeholder}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
  },
});
