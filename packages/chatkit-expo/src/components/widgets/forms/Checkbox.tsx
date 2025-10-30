import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Checkbox({ label, value: initialValue, onChange, ...props }: any) {
  const { theme } = useTheme();
  const [checked, setChecked] = useState(initialValue || false);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleToggle}>
      <View style={[styles.checkbox, { borderColor: theme.colors.border, backgroundColor: checked ? theme.colors.primary : 'transparent' }]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
});
