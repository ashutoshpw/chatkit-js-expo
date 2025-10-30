import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../context';
import { useThreads } from '../hooks';
import type { Thread } from '../types';

export interface ThreadHistoryProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * ThreadHistory component - displays list of threads in a modal/drawer
 */
export function ThreadHistory({ visible, onClose }: ThreadHistoryProps) {
  const { theme } = useTheme();
  const { threads, currentThreadId, loadThread, deleteThread, createThread } = useThreads();

  const handleThreadPress = async (threadId: string) => {
    await loadThread(threadId);
    onClose();
  };

  const handleNewThread = () => {
    createThread();
    onClose();
  };

  const handleDeleteThread = async (threadId: string) => {
    await deleteThread(threadId);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Conversations</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.newThreadButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleNewThread}
        >
          <Text style={styles.newThreadText}>+ New Conversation</Text>
        </TouchableOpacity>

        <FlatList
          data={threads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.threadItem,
                {
                  backgroundColor: item.id === currentThreadId ? theme.colors.surfaceVariant : 'transparent',
                },
              ]}
              onPress={() => handleThreadPress(item.id)}
            >
              <View style={styles.threadInfo}>
                <Text style={[styles.threadTitle, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.title || 'Untitled'}
                </Text>
                {item.preview && (
                  <Text style={[styles.threadPreview, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {item.preview}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteThread(item.id)}
              >
                <Text style={[styles.deleteIcon, { color: theme.colors.error }]}>🗑</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No conversations yet
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
  },
  newThreadButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  newThreadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  threadInfo: {
    flex: 1,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  threadPreview: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});
