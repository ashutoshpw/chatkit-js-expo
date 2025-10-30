import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';
import { WidgetRenderer } from '../WidgetRenderer';

export function Box({ children, padding, gap, ...props }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.box, { padding: padding || theme.spacing.md, gap: gap || 0 }]}>
      {children?.map((child: any, index: number) => (
        <WidgetRenderer key={index} widget={child} />
      ))}
    </View>
  );
}

export function Row({ children, gap, align, ...props }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.row, { gap: gap || theme.spacing.sm, alignItems: align || 'flex-start' }]}>
      {children?.map((child: any, index: number) => (
        <WidgetRenderer key={index} widget={child} />
      ))}
    </View>
  );
}

export function Col({ children, gap, ...props }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.col, { gap: gap || theme.spacing.sm }]}>
      {children?.map((child: any, index: number) => (
        <WidgetRenderer key={index} widget={child} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  col: {
    flexDirection: 'column',
    marginVertical: 4,
  },
});
