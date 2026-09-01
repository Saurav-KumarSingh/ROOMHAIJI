import { DARK_THEME, LIGHT_THEME, THEMES, type ColorScheme, type ThemeTokens } from '@/constants/theme';
import { useColorScheme } from 'react-native';

/**
 * Hook to access active theme tokens with automatic Light/Dark mode support.
 *
 * Usage:
 * ```tsx
 * const { theme, isDark, colorScheme } = useTheme();
 * <View style={{ backgroundColor: theme.surface2 }} />
 * ```
 */
export function useTheme(): {
  theme: ThemeTokens;
  isDark: boolean;
  colorScheme: ColorScheme;
} {
  const scheme = useColorScheme();
  const colorScheme: ColorScheme = scheme === 'dark' ? 'dark' : 'light';
  const isDark = colorScheme === 'dark';
  const theme = THEMES[colorScheme];

  return { theme, isDark, colorScheme };
}

/**
 * Helper function to retrieve theme tokens directly by color scheme.
 */
export function getTheme(scheme?: ColorScheme | null): ThemeTokens {
  return scheme === 'dark' ? DARK_THEME : LIGHT_THEME;
}

