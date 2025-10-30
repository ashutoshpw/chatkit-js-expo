import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Divider({ ...props }: any) {
  const { theme } = useTheme();

  return <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginVertical: 12,
  },
});
