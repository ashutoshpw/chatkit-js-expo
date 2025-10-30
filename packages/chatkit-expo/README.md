# @openai/chatkit-expo

React Native/Expo bindings for the ChatKit framework. Build production-ready AI chat experiences for iOS and Android with minimal setup.

## Features

- **Complete Chat UI** - Message list, composer, header, and thread management
- **Response Streaming** - Real-time SSE streaming for natural conversations
- **File & Image Attachments** - Built-in support for camera, photo library, and file picker
- **Widget System** - 25+ interactive components for rich chat experiences
- **Deep Customization** - Full theming with light/dark mode support
- **TypeScript** - Complete type safety with TypeScript definitions
- **Expo Compatible** - Works seamlessly with Expo and bare React Native

## Installation

```bash
npm install @openai/chatkit-expo
# or
yarn add @openai/chatkit-expo
# or
pnpm add @openai/chatkit-expo
```

### Peer Dependencies

You'll also need to install the required Expo packages:

```bash
npx expo install expo-image-picker expo-document-picker expo-file-system expo-image expo-localization
```

## Quick Start

### 1. Set up your API endpoint

```typescript
// app/api/chatkit/session.ts
export async function POST(request: Request) {
  const session = await openai.chatkit.sessions.create({
    // your config
  });

  return Response.json({ client_secret: session.client_secret });
}
```

### 2. Create your chat component

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatKit, useChatKit } from '@openai/chatkit-expo';

export function MyChatScreen() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        const response = await fetch('https://your-api.com/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const { client_secret } = await response.json();
        return client_secret;
      },
    },
  });

  return (
    <View style={styles.container}>
      <ChatKit control={control} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Configuration

### useChatKit Options

```typescript
const { control } = useChatKit({
  // API Configuration (Required)
  api: {
    getClientSecret: async (current) => {
      // Fetch client secret from your server
      return 'client_secret_xxx';
    },
    url: 'https://api.openai.com/v1/chatkit', // Optional custom URL
  },

  // Theme Configuration
  theme: {
    colorScheme: 'light' | 'dark' | 'system',
    colors: {
      primary: '#10a37f',
      background: '#ffffff',
      // ... more colors
    },
    typography: {
      fontFamily: 'System',
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
    },
  },

  // Initial Thread
  initialThread: {
    id: 'thread_abc123',
  },

  // Event Handlers
  onReady: () => console.log('ChatKit ready'),
  onError: ({ error }) => console.error('Error:', error),
  onResponseStart: () => console.log('Response started'),
  onResponseEnd: () => console.log('Response ended'),
  onThreadChange: ({ threadId }) => console.log('Thread changed:', threadId),
});
```

### Component Props

```tsx
<ChatKit
  control={control}
  showHeader={true}        // Show/hide header
  showHistory={false}      // Show/hide thread history button
  style={styles.custom}    // Custom styles
/>
```

## Hooks

### useChatKit

Main hook for configuration and control:

```tsx
const { control, focusComposer, setThreadId, sendUserMessage } = useChatKit(options);

// Focus the composer input
focusComposer();

// Switch threads
await setThreadId('thread_123');

// Send a message programmatically
await sendUserMessage({
  text: 'Hello!',
  attachments: [],
  newThread: false,
});
```

### useMessages

Manage messages:

```tsx
const { messages, addMessage, updateMessage, sendFeedback, retryMessage } = useMessages();

// Send feedback
await sendFeedback('msg_123', 'positive');

// Retry failed message
await retryMessage('msg_123');
```

### useThreads

Manage conversation threads:

```tsx
const { threads, currentThreadId, loadThread, deleteThread, renameThread, createThread } = useThreads();

// Load a thread
await loadThread('thread_123');

// Create new thread
createThread();

// Delete thread
await deleteThread('thread_123');

// Rename thread
await renameThread('thread_123', 'New Title');
```

### useAttachments

Handle file and image attachments:

```tsx
const { pickImage, takePhoto, pickDocument, uploadAttachment, isUploading } = useAttachments();

// Pick image from library
const image = await pickImage();

// Take photo with camera
const photo = await takePhoto();

// Pick any file
const file = await pickDocument();

// Upload attachment
const uploaded = await uploadAttachment(image);
```

### useStreaming

Manage streaming responses:

```tsx
const { isStreaming, currentMessage, startStreaming, stopStreaming } = useStreaming();

// Check if currently streaming
if (isStreaming) {
  console.log('Streaming in progress:', currentMessage);
}

// Stop streaming
stopStreaming();
```

## Theming

### Using Theme Context

```tsx
import { useTheme } from '@openai/chatkit-expo';

function MyComponent() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();

  // Access theme values
  const backgroundColor = theme.colors.background;
  const primaryColor = theme.colors.primary;

  // Update theme
  setTheme({
    colors: {
      primary: '#ff0000',
    },
  });

  // Change color scheme
  setColorScheme('dark'); // 'light' | 'dark' | 'system'

  return <View style={{ backgroundColor }} />;
}
```

### Custom Theme

```tsx
const { control } = useChatKit({
  theme: {
    colors: {
      primary: '#10a37f',
      background: '#ffffff',
      surface: '#f7f7f8',
      text: '#000000',
      textSecondary: '#6e6e80',
      border: '#d1d5db',
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
    typography: {
      fontFamily: 'CustomFont',
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
  },
});
```

## Widget System

ChatKit supports 25+ interactive widgets for rich chat experiences:

### Root Containers
- `Card` - Container with optional actions
- `ListView` - List of items
- `BasicRoot` - Generic container

### Layout
- `Box`, `Row`, `Col` - Flexbox layout
- `Form` - Form container
- `Spacer`, `Divider` - Layout utilities

### Content
- `TextComponent`, `Title`, `Caption` - Text rendering
- `Markdown` - Markdown content
- `Badge`, `Icon`, `Image` - Visual elements

### Interactive
- `Button` - Action buttons

### Forms
- `Input`, `Textarea` - Text inputs
- `Select`, `DatePicker` - Pickers
- `Checkbox`, `RadioGroup` - Selection controls
- `Label` - Form labels

Widgets are automatically rendered when included in message responses from the server.

## Advanced Usage

### Custom Components

You can use individual components for advanced customization:

```tsx
import { ChatView, Composer, Header, ThemeProvider, ChatKitProvider } from '@openai/chatkit-expo';

function CustomChat() {
  return (
    <ChatKitProvider apiConfig={...} eventHandlers={...}>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Header title="My Custom Chat" />
          <ChatView />
          <Composer />
        </View>
      </ThemeProvider>
    </ChatKitProvider>
  );
}
```

### Thread History Modal

```tsx
import { ThreadHistory } from '@openai/chatkit-expo';

function MyChat() {
  const [historyVisible, setHistoryVisible] = useState(false);

  return (
    <>
      <ChatKit control={control} />
      <ThreadHistory visible={historyVisible} onClose={() => setHistoryVisible(false)} />
    </>
  );
}
```

## Permissions

This library requires the following permissions:

### iOS (ios/YourApp/Info.plist)

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to send images</string>
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take photos</string>
```

### Android (android/app/src/main/AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

## TypeScript

This package is written in TypeScript and includes complete type definitions. All types from `@openai/chatkit` are re-exported for convenience.

```typescript
import type {
  ChatKitExpoOptions,
  Message,
  Thread,
  Attachment,
  Theme,
  ChatKitEventHandlers,
} from '@openai/chatkit-expo';
```

## Differences from Web Version

While `@openai/chatkit-expo` maintains API compatibility with `@openai/chatkit-react`, there are some differences:

1. **No Web Component** - The web version loads a Web Component from CDN, while Expo uses native React Native components
2. **File Handling** - Uses Expo's native file pickers instead of HTML file inputs
3. **Styling** - Uses React Native StyleSheet instead of CSS
4. **Platform-Specific** - Takes advantage of native iOS/Android features

## Troubleshooting

### SSE Connection Issues

If you experience streaming issues, ensure:
1. Your server supports Server-Sent Events
2. Network requests aren't being blocked
3. CORS is properly configured for your API

### Attachment Upload Failures

1. Check that permissions are granted
2. Verify file size limits on your server
3. Ensure proper multipart/form-data handling

## License

MIT

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.
