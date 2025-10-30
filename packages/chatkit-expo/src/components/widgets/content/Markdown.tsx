import React from 'react';
import MarkdownDisplay from 'react-native-markdown-display';
import { useTheme } from '../../../context';

export function MarkdownComponent({ content, ...props }: any) {
  const { theme } = useTheme();

  return (
    <MarkdownDisplay
      style={{
        body: { color: theme.colors.text, fontSize: 16 },
        paragraph: { marginTop: 0, marginBottom: 8 },
        code_inline: {
          backgroundColor: theme.colors.surfaceVariant,
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4,
        },
        code_block: {
          backgroundColor: theme.colors.surfaceVariant,
          padding: 12,
          borderRadius: 8,
        },
      }}
    >
      {content}
    </MarkdownDisplay>
  );
}
