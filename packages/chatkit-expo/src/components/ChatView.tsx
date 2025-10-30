import React from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useMessages } from '../hooks';
import { useTheme } from '../context';
import { MessageItem } from './common/MessageItem';
import { StartScreen } from './StartScreen';
import type { Message } from '../types';

/**
 * ChatView component - displays the message list using FlatList
 */
export function ChatView() {
  const { messages } = useMessages();
  const { theme } = useTheme();
  const flatListRef = React.useRef<FlatList>(null);

  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return <StartScreen />;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageItem message={item} />}
      contentContainerStyle={[
        styles.contentContainer,
        { backgroundColor: theme.colors.background },
      ]}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
});
