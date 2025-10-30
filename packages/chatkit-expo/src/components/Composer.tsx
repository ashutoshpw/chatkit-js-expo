import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../context';
import { useStreaming, useAttachments } from '../hooks';
import { useChatKitContext } from '../context';
import type { Attachment } from '../types';

/**
 * Composer component - text input with attachment support
 */
export function Composer() {
  const { theme } = useTheme();
  const { currentThreadId, composerState, setComposerState } = useChatKitContext();
  const { startStreaming, isStreaming } = useStreaming();
  const { pickImage, takePhoto, pickDocument, isUploading } = useAttachments();

  const [localAttachments, setLocalAttachments] = useState<Attachment[]>([]);

  const handleSend = async () => {
    if (!composerState.text.trim() && localAttachments.length === 0) return;
    if (isStreaming) return;

    const messageText = composerState.text;
    const attachments = localAttachments;

    // Clear composer
    setComposerState({ text: '', attachments: [] });
    setLocalAttachments([]);

    // Send message
    await startStreaming(messageText, attachments, currentThreadId, false);
  };

  const handleAddAttachment = async (type: 'image' | 'camera' | 'file') => {
    try {
      let attachment: Attachment | null = null;

      if (type === 'image') {
        attachment = await pickImage();
      } else if (type === 'camera') {
        attachment = await takePhoto();
      } else if (type === 'file') {
        attachment = await pickDocument();
      }

      if (attachment) {
        setLocalAttachments((prev) => [...prev, attachment!]);
      }
    } catch (error) {
      console.error('Failed to add attachment:', error);
    }
  };

  const removeAttachment = (id: string) => {
    setLocalAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      {localAttachments.length > 0 && (
        <ScrollView horizontal style={styles.attachmentsContainer} showsHorizontalScrollIndicator={false}>
          {localAttachments.map((attachment) => (
            <View key={attachment.id} style={[styles.attachmentChip, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.attachmentText, { color: theme.colors.text }]} numberOfLines={1}>
                {attachment.name}
              </Text>
              <TouchableOpacity onPress={() => removeAttachment(attachment.id)}>
                <Text style={[styles.removeButton, { color: theme.colors.textSecondary }]}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => handleAddAttachment('image')}
          disabled={isUploading || isStreaming}
        >
          <Text style={[styles.attachIcon, { color: theme.colors.textSecondary }]}>+</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
          value={composerState.text}
          onChangeText={(text) => setComposerState({ ...composerState, text })}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          maxHeight={120}
          editable={!isStreaming}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: composerState.text.trim() || localAttachments.length > 0
                ? theme.colors.primary
                : theme.colors.surfaceVariant,
            },
          ]}
          onPress={handleSend}
          disabled={(!composerState.text.trim() && localAttachments.length === 0) || isStreaming}
        >
          {isStreaming ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendIcon}>→</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  attachmentsContainer: {
    paddingBottom: 8,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    maxWidth: 200,
  },
  attachmentText: {
    fontSize: 14,
    flex: 1,
  },
  removeButton: {
    fontSize: 20,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
