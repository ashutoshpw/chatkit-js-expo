import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import type { Theme } from '../types';
import { defaultLightTheme, defaultDarkTheme, getSystemColorScheme, mergeTheme } from '../utils/theme';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Partial<Theme>) => void;
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<Theme>;
  initialColorScheme?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({
  children,
  initialTheme = {},
  initialColorScheme = 'system',
}: ThemeProviderProps) {
  const [colorSchemeMode, setColorSchemeMode] = useState<'light' | 'dark' | 'system'>(initialColorScheme);
  const [customTheme, setCustomTheme] = useState<Partial<Theme>>(initialTheme);

  // Determine actual color scheme
  const colorScheme: 'light' | 'dark' =
    colorSchemeMode === 'system' ? getSystemColorScheme() : colorSchemeMode;

  // Merge theme based on color scheme
  const theme = React.useMemo(
    () => mergeTheme(customTheme, colorScheme),
    [customTheme, colorScheme],
  );

  // Listen to system color scheme changes
  useEffect(() => {
    if (colorSchemeMode !== 'system') return;

    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      // Force re-render by updating state
      setColorSchemeMode('system');
    });

    return () => subscription.remove();
  }, [colorSchemeMode]);

  const setTheme = React.useCallback((newTheme: Partial<Theme>) => {
    setCustomTheme((prev) => ({
      ...prev,
      ...newTheme,
      colors: {
        ...(prev.colors || {}),
        ...(newTheme.colors || {}),
      },
      typography: {
        ...(prev.typography || {}),
        ...(newTheme.typography || {}),
      },
      spacing: {
        ...(prev.spacing || {}),
        ...(newTheme.spacing || {}),
      },
      radius: {
        ...(prev.radius || {}),
        ...(newTheme.radius || {}),
      },
    }));
  }, []);

  const setColorScheme = React.useCallback((scheme: 'light' | 'dark' | 'system') => {
    setColorSchemeMode(scheme);
  }, []);

  const value: ThemeContextValue = React.useMemo(
    () => ({
      theme,
      setTheme,
      colorScheme,
      setColorScheme,
    }),
    [theme, setTheme, colorScheme, setColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
