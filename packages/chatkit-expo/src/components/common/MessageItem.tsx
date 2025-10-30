import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../../context';
import type { Message } from '../../types';

export interface MessageItemProps {
  message: Message;
}

/**
 * MessageItem component - renders a single message
 */
export function MessageItem({ message }: MessageItemProps) {
  const { theme } = useTheme();
  const isUser = message.role === 'user';
  const isError = message.status === 'error';

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
            borderColor: isError ? theme.colors.error : theme.colors.border,
          },
          isError && styles.errorBubble,
        ]}
      >
        {message.status === 'sending' && message.role === 'assistant' ? (
          <ActivityIndicator size="small" color={theme.colors.textSecondary} />
        ) : (
          <Markdown
            style={{
              body: {
                color: isUser ? '#ffffff' : theme.colors.text,
                fontSize: 16,
              },
              paragraph: {
                marginTop: 0,
                marginBottom: 8,
              },
              code_inline: {
                backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant,
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
              },
              code_block: {
                backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant,
                padding: 12,
                borderRadius: 8,
              },
            }}
          >
            {message.content || ''}
          </Markdown>
        )}

        {isError && message.error && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {message.error}
          </Text>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <View style={styles.attachments}>
            {message.attachments.map((attachment) => (
              <View
                key={attachment.id}
                style={[styles.attachmentChip, { backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceVariant }]}
              >
                <Text style={[styles.attachmentText, { color: isUser ? '#ffffff' : theme.colors.text }]}>
                  {attachment.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  errorBubble: {
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  attachments: {
    marginTop: 8,
    gap: 4,
  },
  attachmentChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  attachmentText: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
  },
});
