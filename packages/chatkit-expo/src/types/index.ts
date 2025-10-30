// Re-export all types from @openai/chatkit
export * from '@openai/chatkit';
export type {
  ChatKitOptions,
  ChatKitEvents,
  StartScreenPrompt,
  Attachment,
  HeaderIcon,
  IconName,
} from '@openai/chatkit';

// React Native-specific types
export interface ChatKitExpoOptions extends Omit<import('@openai/chatkit').ChatKitOptions, 'widgets'> {
  /**
   * Custom widget handlers for React Native
   */
  widgets?: {
    onClientTool?: (params: {
      name: string;
      arguments: Record<string, unknown>;
    }) => Promise<unknown>;
  };
}

/**
 * Message type for internal state management
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: import('@openai/chatkit').Attachment[];
  widgets?: any[];
  status?: 'sending' | 'sent' | 'error';
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Thread type for thread management
 */
export interface Thread {
  id: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  preview?: string;
}

/**
 * Streaming state
 */
export interface StreamingState {
  isStreaming: boolean;
  currentMessage?: Partial<Message>;
  error?: Error;
}

/**
 * Theme configuration for React Native
 */
export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      regular: '400' | 'normal';
      medium: '500';
      semibold: '600';
      bold: '700' | 'bold';
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

/**
 * Event handlers for React Native (camelCase)
 */
export interface ChatKitEventHandlers {
  onReady?: () => void;
  onError?: (event: { error: Error }) => void;
  onResponseStart?: () => void;
  onResponseEnd?: () => void;
  onThreadChange?: (event: { threadId: string | null }) => void;
  onThreadLoadStart?: (event: { threadId: string }) => void;
  onThreadLoadEnd?: (event: { threadId: string }) => void;
  onLog?: (event: { name: string; data?: Record<string, unknown> }) => void;
}

/**
 * Composer state
 */
export interface ComposerState {
  text: string;
  attachments: import('@openai/chatkit').Attachment[];
  replyTo?: string;
}

/**
 * File selection result from picker
 */
export interface FilePickerResult {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
  type: 'image' | 'file';
}
