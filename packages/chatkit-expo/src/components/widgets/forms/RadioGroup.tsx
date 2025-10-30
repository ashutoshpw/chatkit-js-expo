import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function RadioGroup({ options = [], value: initialValue, onChange, ...props }: any) {
  const { theme } = useTheme();
  const [value, setValue] = useState(initialValue || '');

  const handleSelect = (optionValue: any) => {
    setValue(optionValue);
    onChange?.(optionValue);
  };

  return (
    <View style={styles.container}>
      {options.map((option: any) => {
        const isSelected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => handleSelect(option.value)}
          >
            <View style={[styles.radio, { borderColor: theme.colors.border }]}>
              {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
            </View>
            <Text style={[styles.label, { color: theme.colors.text }]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
});
