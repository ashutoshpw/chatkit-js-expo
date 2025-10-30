import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { ChatKitProvider } from '../context/ChatKitContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ChatView } from './ChatView';
import { Composer } from './Composer';
import { Header } from './Header';
import type { ChatKitControl } from '../hooks/useChatKit';
import { useTheme } from '../context';

export interface ChatKitProps extends ViewProps {
  control: ChatKitControl;
  showHeader?: boolean;
  showHistory?: boolean;
}

/**
 * Main ChatKit component for React Native/Expo
 * Provides a complete chat interface with messages, composer, and optional header/history
 */
export const ChatKit = React.forwardRef<View, ChatKitProps>(
  function ChatKit({ control, showHeader = true, showHistory = false, style, ...props }, ref) {
    const { options, handlers } = control;

    return (
      <ChatKitProvider
        apiConfig={{
          getClientSecret: options.api?.getClientSecret || (() => Promise.resolve('')),
          url: options.api?.url,
          fetch: options.api?.fetch,
        }}
        eventHandlers={handlers}
        initialThreadId={options.initialThread?.id}
      >
        <ThemeProvider
          initialTheme={options.theme as any}
          initialColorScheme={
            options.theme?.colorScheme === 'dark' ? 'dark' :
            options.theme?.colorScheme === 'light' ? 'light' : 'system'
          }
        >
          <ChatKitContent
            ref={ref}
            showHeader={showHeader}
            showHistory={showHistory}
            style={style}
            {...props}
          />
        </ThemeProvider>
      </ChatKitProvider>
    );
  },
);

const ChatKitContent = React.forwardRef<View, Omit<ChatKitProps, 'control'>>(
  function ChatKitContent({ showHeader, showHistory, style, ...props }, ref) {
    const { theme } = useTheme();

    return (
      <View ref={ref} style={[styles.container, { backgroundColor: theme.colors.background }, style]} {...props}>
        {showHeader && <Header showHistoryButton={showHistory} />}
        <ChatView />
        <Composer />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
