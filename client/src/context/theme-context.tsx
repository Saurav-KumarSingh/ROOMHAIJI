import React, { type ReactNode } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { DARK_THEME, LIGHT_THEME, THEMES, type ColorScheme, type ThemeTokens } from '@/constants/theme';
import { useThemeStore, type ThemeMode } from '@/store/theme-store';

export type { ThemeMode };

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  const systemScheme = useRNColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode) || 'system';
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const activeScheme: ColorScheme =
    themeMode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode === 'dark'
        ? 'dark'
        : 'light';

  const isDark = activeScheme === 'dark';
  const theme = THEMES[activeScheme] || LIGHT_THEME;

  return {
    theme: theme || LIGHT_THEME,
    isDark,
    colorScheme: activeScheme,
    themeMode,
    setThemeMode,
    toggleTheme,
  };
}

export function getTheme(scheme?: ColorScheme | null): ThemeTokens {
  return scheme === 'dark' ? DARK_THEME : LIGHT_THEME;
}
