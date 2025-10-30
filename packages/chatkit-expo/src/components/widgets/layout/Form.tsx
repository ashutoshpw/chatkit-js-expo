import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';
import { WidgetRenderer } from '../WidgetRenderer';

export function Form({ children, onSubmit, ...props }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { gap: theme.spacing.md }]}>
      {children?.map((child: any, index: number) => (
        <WidgetRenderer key={index} widget={child} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});
