import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../context';

export function Spacer({ size = 'md', ...props }: any) {
  const { theme } = useTheme();
  const height = typeof size === 'number' ? size : theme.spacing[size as keyof typeof theme.spacing] || theme.spacing.md;

  return <View style={{ height }} />;
}
