import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WidgetRenderer } from '../WidgetRenderer';

export function BasicRoot({ children, ...props }: any) {
  return (
    <View style={styles.container}>
      {children?.map((child: any, index: number) => (
        <WidgetRenderer key={index} widget={child} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
});
