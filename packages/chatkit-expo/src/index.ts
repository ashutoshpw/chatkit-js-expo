// Main component
export { ChatKit, type ChatKitProps } from './components/ChatKit';

// Hooks
export { useChatKit, type ChatKitControl, type UseChatKitOptions, type UseChatKitReturn } from './hooks/useChatKit';
export { useMessages } from './hooks/useMessages';
export { useThreads } from './hooks/useThreads';
export { useAttachments } from './hooks/useAttachments';
export { useStreaming } from './hooks/useStreaming';

// Context
export { ThemeProvider, useTheme, type ThemeProviderProps } from './context/ThemeContext';
export { ChatKitProvider, useChatKitContext, type ChatKitProviderProps } from './context/ChatKitContext';

// Components (for advanced customization)
export { ChatView } from './components/ChatView';
export { Composer } from './components/Composer';
export { Header } from './components/Header';
export { ThreadHistory } from './components/ThreadHistory';
export { StartScreen } from './components/StartScreen';

// Widget renderer
export { WidgetRenderer } from './components/widgets/WidgetRenderer';

// Types
export * from './types';

// API
export { ChatKitAPIClient, type ChatKitAPIConfig } from './api';
