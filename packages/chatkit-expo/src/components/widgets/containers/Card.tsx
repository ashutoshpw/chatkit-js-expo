import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';
import { WidgetRenderer } from '../WidgetRenderer';

export function Card({ children, ...props }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {children?.map((child: any, index: number) => (
        <WidgetRenderer key={index} widget={child} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
});
