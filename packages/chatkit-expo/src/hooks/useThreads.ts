import { useCallback, useEffect } from 'react';
import { useChatKitContext } from '../context';
import type { Thread } from '../types';

/**
 * Hook for managing threads
 */
export function useThreads() {
  const {
    threads,
    currentThreadId,
    setCurrentThreadId,
    addThread,
    updateThread,
    deleteThread,
    apiClient,
    eventHandlers,
    isLoadingThread,
    setIsLoadingThread,
    clearMessages,
  } = useChatKitContext();

  /**
   * Load a thread and its messages
   */
  const loadThread = useCallback(
    async (threadId: string) => {
      if (!apiClient) return;

      setIsLoadingThread(true);
      eventHandlers.onThreadLoadStart?.({ threadId });

      try {
        const threadData = await apiClient.loadThread(threadId);

        // Update thread in list if exists, otherwise add it
        const existingThread = threads.find((t) => t.id === threadId);
        if (existingThread) {
          updateThread(threadId, {
            ...threadData,
            updatedAt: Date.now(),
          });
        } else {
          addThread({
            id: threadId,
            title: threadData.title,
            createdAt: threadData.created_at || Date.now(),
            updatedAt: Date.now(),
            messageCount: threadData.message_count || 0,
            preview: threadData.preview,
          });
        }

        // Clear current messages and load thread messages
        clearMessages();
        // TODO: Load messages from threadData

        setCurrentThreadId(threadId);
        setIsLoadingThread(false);
        eventHandlers.onThreadLoadEnd?.({ threadId });
      } catch (error) {
        setIsLoadingThread(false);
        eventHandlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
      }
    },
    [apiClient, threads, addThread, updateThread, setCurrentThreadId, clearMessages, setIsLoadingThread, eventHandlers],
  );

  /**
   * List all threads
   */
  const listThreads = useCallback(async () => {
    if (!apiClient) return;

    try {
      const result = await apiClient.listThreads();
      // Update threads list
      // TODO: Implement proper thread list update
    } catch (error) {
      eventHandlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  }, [apiClient, eventHandlers]);

  /**
   * Delete a thread
   */
  const removeThread = useCallback(
    async (threadId: string) => {
      if (!apiClient) return;

      try {
        await apiClient.deleteThread(threadId);
        deleteThread(threadId);
      } catch (error) {
        eventHandlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
      }
    },
    [apiClient, deleteThread, eventHandlers],
  );

  /**
   * Rename a thread
   */
  const renameThread = useCallback(
    async (threadId: string, newTitle: string) => {
      if (!apiClient) return;

      try {
        await apiClient.updateThread(threadId, { title: newTitle });
        updateThread(threadId, { title: newTitle });
      } catch (error) {
        eventHandlers.onError?.({ error: error instanceof Error ? error : new Error(String(error)) });
      }
    },
    [apiClient, updateThread, eventHandlers],
  );

  /**
   * Create a new thread
   */
  const createThread = useCallback(() => {
    setCurrentThreadId(null);
    clearMessages();
  }, [setCurrentThreadId, clearMessages]);

  return {
    threads,
    currentThreadId,
    isLoadingThread,
    loadThread,
    listThreads,
    deleteThread: removeThread,
    renameThread,
    createThread,
    switchThread: setCurrentThreadId,
  };
}
