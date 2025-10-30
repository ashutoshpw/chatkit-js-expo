import { Appearance } from 'react-native';
import type { Theme } from '../types';

/**
 * Default light theme
 */
export const defaultLightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#10a37f',
    background: '#ffffff',
    surface: '#f7f7f8',
    surfaceVariant: '#ececf1',
    text: '#000000',
    textSecondary: '#6e6e80',
    border: '#d1d5db',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  typography: {
    fontFamily: 'System',
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
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
};

/**
 * Default dark theme
 */
export const defaultDarkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#19c37d',
    background: '#000000',
    surface: '#171717',
    surfaceVariant: '#2d2d2d',
    text: '#ececf1',
    textSecondary: '#b4b4b4',
    border: '#3f3f46',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
  },
  typography: defaultLightTheme.typography,
  spacing: defaultLightTheme.spacing,
  radius: defaultLightTheme.radius,
};

/**
 * Get the system color scheme
 */
export function getSystemColorScheme(): 'light' | 'dark' {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

/**
 * Merge custom theme with default theme
 */
export function mergeTheme(custom: Partial<Theme>, mode: 'light' | 'dark'): Theme {
  const baseTheme = mode === 'dark' ? defaultDarkTheme : defaultLightTheme;

  return {
    ...baseTheme,
    ...custom,
    mode,
    colors: {
      ...baseTheme.colors,
      ...(custom.colors || {}),
    },
    typography: {
      ...baseTheme.typography,
      ...(custom.typography || {}),
      fontSize: {
        ...baseTheme.typography.fontSize,
        ...(custom.typography?.fontSize || {}),
      },
      fontWeight: {
        ...baseTheme.typography.fontWeight,
        ...(custom.typography?.fontWeight || {}),
      },
    },
    spacing: {
      ...baseTheme.spacing,
      ...(custom.spacing || {}),
    },
    radius: {
      ...baseTheme.radius,
      ...(custom.radius || {}),
    },
  };
}

/**
 * Apply radius style based on theme configuration
 */
export function getRadiusStyle(size: 'sm' | 'md' | 'lg' | 'xl' | 'full', theme: Theme) {
  return {
    borderRadius: theme.radius[size],
  };
}

/**
 * Apply spacing style based on theme configuration
 */
export function getSpacingStyle(
  type: 'padding' | 'margin',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number,
  theme: Theme,
) {
  const value = typeof size === 'number' ? size : theme.spacing[size];
  return type === 'padding' ? { padding: value } : { margin: value };
}
