import { useState, useCallback, useRef } from 'react';
import { useChatKitContext } from '../context';
import type { Message } from '../types';

/**
 * Hook for managing streaming responses
 */
export function useStreaming() {
  const { apiClient, addMessage, updateMessage, streamingState, setStreamingState, eventHandlers } = useChatKitContext();
  const abortRef = useRef<(() => void) | null>(null);

  const startStreaming = useCallback(
    async (messageText: string, attachments: any[] = [], threadId: string | null, newThread: boolean = false) => {
      if (!apiClient) return;

      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: Date.now(),
        attachments,
        status: 'sending',
      };

      addMessage(userMessage);

      // Create assistant message placeholder
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'sending',
      };

      addMessage(assistantMessage);

      // Update user message status
      updateMessage(userMessage.id, { status: 'sent' });

      // Start streaming
      setStreamingState({ isStreaming: true, currentMessage: assistantMessage });
      eventHandlers.onResponseStart?.();

      try {
        const abort = await apiClient.sendMessage(
          {
            text: messageText,
            attachments,
            threadId,
            newThread,
          },
          {
            onMessage: (processed) => {
              if (processed.type === 'content') {
                // Append content to message
                updateMessage(assistantMessageId, {
                  content: (msg: Message) => msg.content + (processed.data.text || processed.data.content || ''),
                } as any);
              } else if (processed.type === 'end') {
                // Streaming complete
                updateMessage(assistantMessageId, { status: 'sent' });
                setStreamingState({ isStreaming: false });
                eventHandlers.onResponseEnd?.();
              } else if (processed.type === 'error') {
                // Error occurred
                updateMessage(assistantMessageId, {
                  status: 'error',
                  error: processed.data.message || 'Unknown error',
                });
                setStreamingState({ isStreaming: false, error: new Error(processed.data.message) });
                eventHandlers.onError?.({ error: new Error(processed.data.message) });
              }
            },
            onError: (error) => {
              updateMessage(assistantMessageId, {
                status: 'error',
                error: error.message,
              });
              setStreamingState({ isStreaming: false, error });
              eventHandlers.onError?.({ error });
            },
            onEnd: () => {
              updateMessage(assistantMessageId, { status: 'sent' });
              setStreamingState({ isStreaming: false });
              eventHandlers.onResponseEnd?.();
            },
          },
        );

        abortRef.current = abort;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        updateMessage(assistantMessageId, {
          status: 'error',
          error: err.message,
        });
        setStreamingState({ isStreaming: false, error: err });
        eventHandlers.onError?.({ error: err });
      }
    },
    [apiClient, addMessage, updateMessage, setStreamingState, eventHandlers],
  );

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }
    setStreamingState({ isStreaming: false });
  }, [setStreamingState]);

  return {
    isStreaming: streamingState.isStreaming,
    currentMessage: streamingState.currentMessage,
    startStreaming,
    stopStreaming,
  };
}
