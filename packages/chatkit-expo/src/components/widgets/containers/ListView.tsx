import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { WidgetRenderer } from '../WidgetRenderer';

export function ListView({ items, ...props }: any) {
  return (
    <View style={styles.container}>
      {items?.map((item: any, index: number) => (
        <View key={index} style={styles.item}>
          <WidgetRenderer widget={item} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  item: {
    marginBottom: 8,
  },
});
