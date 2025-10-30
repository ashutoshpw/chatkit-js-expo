import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context';
import { useThreads } from '../hooks';

export interface HeaderProps {
  showHistoryButton?: boolean;
  title?: string;
  onHistoryPress?: () => void;
}

/**
 * Header component for ChatKit
 */
export function Header({ showHistoryButton = false, title = 'ChatKit', onHistoryPress }: HeaderProps) {
  const { theme } = useTheme();
  const { currentThreadId, createThread } = useThreads();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      {showHistoryButton && (
        <TouchableOpacity style={styles.iconButton} onPress={onHistoryPress}>
          <Text style={[styles.icon, { color: theme.colors.text }]}>☰</Text>
        </TouchableOpacity>
      )}

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      </View>

      <TouchableOpacity style={styles.iconButton} onPress={createThread}>
        <Text style={[styles.icon, { color: theme.colors.text }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
