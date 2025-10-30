import { useCallback } from 'react';
import { useChatKitContext } from '../context';
import type { Message } from '../types';

/**
 * Hook for managing messages
 */
export function useMessages() {
  const { messages, addMessage, updateMessage, clearMessages, apiClient, eventHandlers } = useChatKitContext();

  const sendFeedback = useCallback(
    async (messageId: string, feedback: 'positive' | 'negative') => {
      if (!apiClient) return;

      try {
        await apiClient.sendFeedback(messageId, feedback);
      } catch (error) {
        eventHandlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
      }
    },
    [apiClient, eventHandlers],
  );

  const retryMessage = useCallback(
    async (messageId: string) => {
      if (!apiClient) return;

      try {
        eventHandlers.onResponseStart?.();

        const abort = await apiClient.retryMessage(messageId, {
          onMessage: (processed) => {
            // Handle streamed response
            if (processed.type === 'content') {
              updateMessage(messageId, {
                content: (msg: Message) => msg.content + (processed.data.text || ''),
                status: 'sending',
              } as any);
            } else if (processed.type === 'end') {
              updateMessage(messageId, { status: 'sent' });
              eventHandlers.onResponseEnd?.();
            } else if (processed.type === 'error') {
              updateMessage(messageId, {
                status: 'error',
                error: processed.data.message,
              });
              eventHandlers.onError?.({ error: new Error(processed.data.message) });
            }
          },
          onError: (error) => {
            updateMessage(messageId, {
              status: 'error',
              error: error.message,
            });
            eventHandlers.onError?.({ error });
          },
          onEnd: () => {
            updateMessage(messageId, { status: 'sent' });
            eventHandlers.onResponseEnd?.();
          },
        });
      } catch (error) {
        eventHandlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
      }
    },
    [apiClient, updateMessage, eventHandlers],
  );

  return {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    sendFeedback,
    retryMessage,
  };
}
