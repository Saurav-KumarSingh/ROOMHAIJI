import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { DARK_THEME, LIGHT_THEME, THEMES, type ColorScheme, type ThemeTokens } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeTokens;
  isDark: boolean;
  colorScheme: ColorScheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: LIGHT_THEME,
  isDark: false,
  colorScheme: 'light',
  themeMode: 'system',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const activeScheme: ColorScheme = useMemo(() => {
    return themeMode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;
  }, [themeMode, systemScheme]);

  const isDark = activeScheme === 'dark';
  const theme = THEMES[activeScheme];

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      colorScheme: activeScheme,
      themeMode,
      setThemeMode,
      toggleTheme,
    }),
    [theme, isDark, activeScheme, themeMode, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function getTheme(scheme?: ColorScheme | null): ThemeTokens {
  return scheme === 'dark' ? DARK_THEME : LIGHT_THEME;
}
