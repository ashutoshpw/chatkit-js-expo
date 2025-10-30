import { useRef, useMemo, useCallback } from 'react';
import type { ChatKitExpoOptions, ChatKitEventHandlers, Attachment } from '../types';
import type { ChatKitAPIClient } from '../api';

/**
 * ChatKit control interface - provides imperative methods
 * Similar to the React version but adapted for React Native
 */
export interface ChatKitControl {
  apiClient: ChatKitAPIClient | null;
  options: ChatKitExpoOptions;
  handlers: ChatKitEventHandlers;
  focusComposer: () => void;
  setThreadId: (threadId: string | null) => Promise<void>;
  sendUserMessage: (params: {
    text: string;
    reply?: string;
    attachments?: Attachment[];
    newThread?: boolean;
  }) => Promise<void>;
  setComposerValue: (params: {
    text: string;
    reply?: string;
    attachments?: Attachment[];
  }) => void;
  fetchUpdates: () => Promise<void>;
  sendCustomAction: (
    action: { type: string; payload?: Record<string, unknown> },
    itemId?: string,
  ) => Promise<void>;
}

export interface UseChatKitOptions extends ChatKitExpoOptions, ChatKitEventHandlers {}

export interface UseChatKitReturn {
  control: ChatKitControl;
  focusComposer: () => void;
  setThreadId: (threadId: string | null) => Promise<void>;
  sendUserMessage: (params: {
    text: string;
    reply?: string;
    attachments?: Attachment[];
    newThread?: boolean;
  }) => Promise<void>;
  setComposerValue: (params: {
    text: string;
    reply?: string;
    attachments?: Attachment[];
  }) => void;
  fetchUpdates: () => Promise<void>;
  sendCustomAction: (
    action: { type: string; payload?: Record<string, unknown> },
    itemId?: string,
  ) => Promise<void>;
}

/**
 * Main hook for using ChatKit in React Native
 * Provides configuration and imperative methods
 */
export function useChatKit(options: UseChatKitOptions): UseChatKitReturn {
  const apiClientRef = useRef<ChatKitAPIClient | null>(null);
  const composerRef = useRef<any>(null);
  const threadIdRef = useRef<string | null>(null);

  // Separate options from event handlers
  const { onReady, onError, onResponseStart, onResponseEnd, onThreadChange, onThreadLoadStart, onThreadLoadEnd, onLog, ...chatkitOptions } = options;

  const handlers: ChatKitEventHandlers = useMemo(
    () => ({
      onReady,
      onError,
      onResponseStart,
      onResponseEnd,
      onThreadChange,
      onThreadLoadStart,
      onThreadLoadEnd,
      onLog,
    }),
    [onReady, onError, onResponseStart, onResponseEnd, onThreadChange, onThreadLoadStart, onThreadLoadEnd, onLog],
  );

  // Imperative methods
  const focusComposer = useCallback(() => {
    composerRef.current?.focus();
  }, []);

  const setThreadId = useCallback(async (threadId: string | null) => {
    threadIdRef.current = threadId;
    handlers.onThreadChange?.({ threadId });

    if (threadId) {
      handlers.onThreadLoadStart?.({ threadId });
      try {
        // Load thread via API client
        if (apiClientRef.current) {
          await apiClientRef.current.loadThread(threadId);
        }
        handlers.onThreadLoadEnd?.({ threadId });
      } catch (error) {
        handlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
      }
    }
  }, [handlers]);

  const sendUserMessage = useCallback(
    async (params: {
      text: string;
      reply?: string;
      attachments?: Attachment[];
      newThread?: boolean;
    }) => {
      if (!apiClientRef.current) {
        console.warn('API client is not initialized');
        return;
      }

      try {
        handlers.onResponseStart?.();
        // This will be handled by the ChatView component via streaming
        // The actual implementation is in useStreaming hook
      } catch (error) {
        handlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
      }
    },
    [handlers],
  );

  const setComposerValue = useCallback((params: {
    text: string;
    reply?: string;
    attachments?: Attachment[];
  }) => {
    // This will be handled by the Composer component
    // The actual implementation updates the composer state
  }, []);

  const fetchUpdates = useCallback(async () => {
    if (!apiClientRef.current || !threadIdRef.current) {
      return;
    }

    try {
      await apiClientRef.current.loadThread(threadIdRef.current);
    } catch (error) {
      handlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  }, [handlers]);

  const sendCustomAction = useCallback(
    async (
      action: { type: string; payload?: Record<string, unknown> },
      itemId?: string,
    ) => {
      // Custom action handling
      // This would be implemented based on specific requirements
      console.log('Custom action:', action, itemId);
    },
    [],
  );

  const control: ChatKitControl = useMemo(
    () => ({
      apiClient: apiClientRef.current,
      options: chatkitOptions,
      handlers,
      focusComposer,
      setThreadId,
      sendUserMessage,
      setComposerValue,
      fetchUpdates,
      sendCustomAction,
    }),
    [chatkitOptions, handlers, focusComposer, setThreadId, sendUserMessage, setComposerValue, fetchUpdates, sendCustomAction],
  );

  return useMemo(
    () => ({
      control,
      focusComposer,
      setThreadId,
      sendUserMessage,
      setComposerValue,
      fetchUpdates,
      sendCustomAction,
    }),
    [control, focusComposer, setThreadId, sendUserMessage, setComposerValue, fetchUpdates, sendCustomAction],
  );
}
