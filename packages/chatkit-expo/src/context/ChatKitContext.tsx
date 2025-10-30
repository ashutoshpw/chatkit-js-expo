import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Message, Thread, StreamingState, ComposerState, ChatKitEventHandlers } from '../types';
import { ChatKitAPIClient, type ChatKitAPIConfig } from '../api';

export interface ChatKitContextValue {
  // API Client
  apiClient: ChatKitAPIClient;

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;

  // Threads
  currentThreadId: string | null;
  threads: Thread[];
  setCurrentThreadId: (id: string | null) => void;
  addThread: (thread: Thread) => void;
  updateThread: (id: string, updates: Partial<Thread>) => void;
  deleteThread: (id: string) => void;

  // Streaming
  streamingState: StreamingState;
  setStreamingState: (state: StreamingState) => void;

  // Composer
  composerState: ComposerState;
  setComposerState: (state: ComposerState) => void;

  // Event handlers
  eventHandlers: ChatKitEventHandlers;

  // Loading states
  isLoadingThread: boolean;
  setIsLoadingThread: (loading: boolean) => void;
}

const ChatKitContext = createContext<ChatKitContextValue | undefined>(undefined);

export interface ChatKitProviderProps {
  children: ReactNode;
  apiConfig: ChatKitAPIConfig;
  eventHandlers?: ChatKitEventHandlers;
  initialThreadId?: string | null;
}

export function ChatKitProvider({
  children,
  apiConfig,
  eventHandlers = {},
  initialThreadId = null,
}: ChatKitProviderProps) {
  const [apiClient] = useState(() => new ChatKitAPIClient(apiConfig));

  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);

  // Threads state
  const [currentThreadId, setCurrentThreadIdState] = useState<string | null>(initialThreadId);
  const [threads, setThreads] = useState<Thread[]>([]);

  // Streaming state
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
  });

  // Composer state
  const [composerState, setComposerState] = useState<ComposerState>({
    text: '',
    attachments: [],
  });

  // Loading states
  const [isLoadingThread, setIsLoadingThread] = useState(false);

  // Message management
  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Thread management
  const setCurrentThreadId = useCallback(
    (id: string | null) => {
      const prevId = currentThreadId;
      setCurrentThreadIdState(id);

      // Call event handler
      if (id !== prevId) {
        eventHandlers.onThreadChange?.({ threadId: id });
      }
    },
    [currentThreadId, eventHandlers],
  );

  const addThread = useCallback((thread: Thread) => {
    setThreads((prev) => [thread, ...prev]);
  }, []);

  const updateThread = useCallback((id: string, updates: Partial<Thread>) => {
    setThreads((prev) =>
      prev.map((thread) => (thread.id === id ? { ...thread, ...updates } : thread)),
    );
  }, []);

  const deleteThread = useCallback((id: string) => {
    setThreads((prev) => prev.filter((thread) => thread.id !== id));
    if (currentThreadId === id) {
      setCurrentThreadId(null);
    }
  }, [currentThreadId, setCurrentThreadId]);

  const value: ChatKitContextValue = React.useMemo(
    () => ({
      apiClient,
      messages,
      addMessage,
      updateMessage,
      clearMessages,
      currentThreadId,
      threads,
      setCurrentThreadId,
      addThread,
      updateThread,
      deleteThread,
      streamingState,
      setStreamingState,
      composerState,
      setComposerState,
      eventHandlers,
      isLoadingThread,
      setIsLoadingThread,
    }),
    [
      apiClient,
      messages,
      addMessage,
      updateMessage,
      clearMessages,
      currentThreadId,
      threads,
      setCurrentThreadId,
      addThread,
      updateThread,
      deleteThread,
      streamingState,
      composerState,
      isLoadingThread,
    ],
  );

  return <ChatKitContext.Provider value={value}>{children}</ChatKitContext.Provider>;
}

/**
 * Hook to access ChatKit context
 */
export function useChatKitContext(): ChatKitContextValue {
  const context = useContext(ChatKitContext);
  if (!context) {
    throw new Error('useChatKitContext must be used within a ChatKitProvider');
  }
  return context;
}
