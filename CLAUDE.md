# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChatKit is a batteries-included framework for building AI-powered chat experiences. This is a monorepo containing TypeScript packages for integrating ChatKit into JavaScript/React applications. The ChatKit component is a Web Component that must be loaded via CDN script tag (`https://cdn.platform.openai.com/deployments/chatkit/chatkit.js`).

## Monorepo Structure

This project uses pnpm workspaces with the following packages:

- `packages/chatkit` - TypeScript type definitions for the ChatKit Web Component
- `packages/chatkit-react` - React bindings that wrap the Web Component
- `packages/chatkit-expo` - React Native/Expo bindings for native iOS/Android apps
- `packages/docs` - Documentation site

## Development Commands

### Root-level commands (run from project root)

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Run linter on all packages
pnpm lint

# Check code formatting
pnpm format:check

# Fix code formatting
pnpm format

# Type check all packages
pnpm types

# Run full CI check locally (format, lint, types, test)
pnpm check

# Clean all build artifacts
pnpm clean

# Start docs development server
pnpm dev:docs
```

### Package-specific commands

To run commands in a specific package:

```bash
# Build a specific package
pnpm -F @openai/chatkit-react build
pnpm -F @openai/chatkit-expo build

# Run tests in a specific package
pnpm -F @openai/chatkit-react test
pnpm -F @openai/chatkit-expo test

# Type check a specific package
pnpm -F @openai/chatkit types
pnpm -F @openai/chatkit-expo types
```

### Running tests

- **All tests**: `pnpm test` (runs tests across all packages)
- **Single package**: `pnpm -F @openai/chatkit-react test`
- **Watch mode**: `cd packages/chatkit-react && pnpm test --watch`

The test suite uses Vitest. Test files are co-located with source files using the `*.test.ts` naming convention.

## Architecture

### Web Component Integration Pattern

ChatKit uses a Web Component (`<openai-chatkit>`) that is loaded from a CDN. The React bindings in `@openai/chatkit-react` wrap this Web Component to provide a React-friendly API.

**Key architectural decisions:**

1. **Lazy loading**: The Web Component is loaded asynchronously via CDN script tag, so the React wrapper must handle both defined and undefined states using `customElements.whenDefined('openai-chatkit')`.

2. **Options synchronization**: ChatKit options are set via the `setOptions()` method on the Web Component instance, called in a `useLayoutEffect` to ensure synchronization before paint.

3. **Stable references with function wrapping**: The `useStableOptions` hook ensures options objects remain referentially stable between renders while allowing function callbacks to always reference the latest closure. This is critical because:
   - The Web Component needs stable option references to avoid unnecessary reconfiguration
   - Event handlers passed as options must have access to the latest React state/props
   - Uses `deepEqualIgnoringFns` to compare options while ignoring function identity
   - Uses `withLatestFunctionWrappers` to create stable wrapper functions that always call the latest version

4. **Event handling**: ChatKit events (e.g., `chatkit.error`, `chatkit.response.end`) are transformed into React-style event handlers (e.g., `onError`, `onResponseEnd`). The mapping is defined in the `ChatKit.tsx` component and event listeners are attached during ref callback.

5. **Control pattern**: The `useChatKit` hook returns a `control` object that separates:
   - Instance management (`setInstance`)
   - Static options (API configuration, UI settings)
   - Event handlers (callbacks for ChatKit events)
   - Imperative methods (`focusComposer`, `setThreadId`, etc.)

### Type Definitions

The `@openai/chatkit` package contains only TypeScript type definitions for the Web Component. These types include:

- `ChatKitOptions` - Configuration options passed to the Web Component
- `ChatKitEvents` - Event types emitted by the Web Component
- Widget types for rendering custom interactive widgets in chat
- Attachment types for file/image uploads
- Icon types for UI customization

### React Native/Expo Architecture (`@openai/chatkit-expo`)

Unlike the web version which wraps a Web Component, the Expo package is a complete native implementation:

**Architecture differences:**

1. **Native Components**: Built entirely with React Native components (View, Text, TextInput, FlatList, etc.) instead of wrapping a Web Component.

2. **State Management**: Uses React Context (ChatKitContext, ThemeContext) for explicit state management:
   - Messages state (list, streaming status, updates)
   - Thread management (current thread, history, loading)
   - Composer state (text, attachments)
   - Theme state (colors, typography, spacing, radius)

3. **Streaming with SSE Polyfill**: Uses `eventsource-parser` library to handle Server-Sent Events in React Native:
   - Fetch API with ReadableStream
   - Manual parsing of SSE format
   - Abort controller for cancellation

4. **File Handling**: Platform-specific attachment handling:
   - `expo-image-picker` for images/camera
   - `expo-document-picker` for files
   - `expo-file-system` for file operations
   - Permission handling for iOS/Android

5. **Widget Rendering**: Custom declarative renderer that maps 25+ widget types to React Native components:
   - Root containers: Card, ListView, BasicRoot
   - Layout: Box, Row, Col, Form, Spacer, Divider
   - Content: Text, Title, Caption, Markdown, Badge, Icon, Image
   - Interactive: Button (with action handlers)
   - Forms: Input, Textarea, Select, DatePicker, Checkbox, RadioGroup, Label

6. **Theming System**: Built from scratch for React Native:
   - Light/dark mode with system preference detection
   - Customizable colors, typography, spacing, radius
   - Theme context provider for consistent styling
   - React Native StyleSheet-based styling

7. **API Compatibility**: Maintains similar API to `@openai/chatkit-react` for consistency:
   - Same `useChatKit` hook interface
   - Same event handler naming convention
   - Re-exports all types from `@openai/chatkit`

**Key files:**
- `packages/chatkit-expo/src/api/client.ts` - API client with SSE streaming
- `packages/chatkit-expo/src/context/ChatKitContext.tsx` - Main state management
- `packages/chatkit-expo/src/components/ChatKit.tsx` - Main component
- `packages/chatkit-expo/src/components/widgets/WidgetRenderer.tsx` - Widget system

### Package Dependencies

- `@openai/chatkit-react` depends on `@openai/chatkit` (workspace dependency)
- `@openai/chatkit-expo` depends on `@openai/chatkit` (workspace dependency)
- All packages are published to npm with public access
- React peer dependencies: React ≥18
- Expo peer dependencies: React Native ≥0.70, Expo ≥49

## Release Process

This project uses Changesets for versioning and releases:

1. Create a changeset: `pnpm changeset`
2. Changesets are committed to `.changeset/` directory
3. CI automatically creates version/release PRs when changesets are merged to main
4. The release workflow publishes packages to npm

## CI/CD

GitHub Actions workflows:

- **ci.yml**: Runs on PRs and merge queue - builds, formats, lints, type checks, and tests
- **release.yml**: Handles npm publishing when version PRs are merged
- **docs.yml**: Deploys documentation site

## Code Style

- TypeScript strict mode enabled
- Prettier for formatting (config in `.prettierrc`)
- ESLint for linting with React and TypeScript rules
- All exports use named exports (no default exports)
