/**
 * RoomHaiji - Modern Professional Theme System
 *
 * Indigo primary + amber accent on neutral slate.
 * Full Light & Dark mode support with accessible focus, error,
 * and component tokens.
 */

export interface ShadowTokens {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ThemeTokens {
  // Primary (Indigo)
  primary: string;
  primary600: string;
  primary700: string;
  primary050: string;
  primary100: string;

  // Accent (Amber)
  accent: string;
  accent600: string;
  accent050: string;

  // Neutrals / Typography & Surfaces
  ink: string;
  ink2: string;
  ink3: string;
  line: string;
  line2: string;
  surface: string;
  surface2: string;
  surface3: string;
  white: string;

  // Status & Categories
  ok: string;
  okBg: string;
  warn: string;
  warnBg: string;
  danger: string;
  dangerBg: string;
  info: string;
  infoBg: string;
  vacant: string;
  vacantBg: string;
  upi: string;
  upiBg: string;
  cash: string;

  // Navigation & Chrome
  navBg: string;
  appbarBg: string;

  // Shadows
  sh1: ShadowTokens;
  sh2: ShadowTokens;
  sh3: ShadowTokens;
  shNav: ShadowTokens;

  // Backward compatibility aliases
  bgBase: string;
  bgSurface: string;
  bgBanner: string;
  border: string;
  borderAccent: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textBanner: string;
  accentBg: string;
  statusGreen: string;
}

// ── Light Theme Tokens ────────────────────────────────────────────────────────
export const LIGHT_THEME: ThemeTokens = {
  // Primary (Indigo)
  primary: '#4F46E5',
  primary600: '#4338CA',
  primary700: '#3730A3',
  primary050: '#EEF2FF',
  primary100: '#E0E7FF',

  // Accent (Amber)
  accent: '#F59E0B',
  accent600: '#D97706',
  accent050: '#FEF3C7',

  // Neutrals / Typography & Surfaces
  ink: '#0F172A',
  ink2: '#334155',
  ink3: '#64748B',
  line: '#E2E8F0',
  line2: '#F1F5F9',
  surface: '#FFFFFF',
  surface2: '#F8FAFC',
  surface3: '#F1F5F9',
  white: '#FFFFFF',

  // Status & Categories
  ok: '#16A34A',
  okBg: '#DCFCE7',
  warn: '#D97706',
  warnBg: '#FEF3C7',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  info: '#2563EB',
  infoBg: '#DBEAFE',
  vacant: '#94A3B8',
  vacantBg: '#F1F5F9',
  upi: '#7C3AED',
  upiBg: '#F3E8FF',
  cash: '#2563EB',

  // Navigation & Chrome
  navBg: 'rgba(255,255,255,0.92)',
  appbarBg: 'rgba(255,255,255,0.92)',

  // Shadows
  sh1: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  sh2: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sh3: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 6,
  },
  shNav: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  // Backward compatibility aliases
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgBanner: '#EEF2FF',
  border: '#E2E8F0',
  borderAccent: '#E0E7FF',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textTertiary: '#64748B',
  textBanner: '#3730A3',
  accentBg: '#FEF3C7',
  statusGreen: '#16A34A',
};

// ── Dark Theme Tokens ─────────────────────────────────────────────────────────
export const DARK_THEME: ThemeTokens = {
  // Primary (Indigo in Dark Mode)
  primary: '#818CF8',
  primary600: '#6366F1',
  primary700: '#C7D2FE',
  primary050: '#1E1B4B',
  primary100: '#312E81',

  // Accent (Amber in Dark Mode)
  accent: '#FBBF24',
  accent600: '#F59E0B',
  accent050: '#3A2E0A',

  // Neutrals / Typography & Surfaces
  ink: '#E2E8F0',
  ink2: '#CBD5E1',
  ink3: '#94A3B8',
  line: '#1E293B',
  line2: '#172033',
  surface: '#0F172A',
  surface2: '#0B1120',
  surface3: '#1E293B',
  white: '#FFFFFF',

  // Status & Categories
  ok: '#4ADE80',
  okBg: '#0E2A1B',
  warn: '#FBBF24',
  warnBg: '#3A2E0A',
  danger: '#F87171',
  dangerBg: '#2E1414',
  info: '#60A5FA',
  infoBg: '#0B1E3A',
  vacant: '#94A3B8',
  vacantBg: '#1E293B',
  upi: '#C4B5FD',
  upiBg: '#211A3A',
  cash: '#60A5FA',

  // Navigation & Chrome
  navBg: 'rgba(15,23,42,0.92)',
  appbarBg: 'rgba(15,23,42,0.92)',

  // Shadows
  sh1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 1,
  },
  sh2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 3,
  },
  sh3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 6,
  },
  shNav: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },

  // Backward compatibility aliases
  bgBase: '#0B1120',
  bgSurface: '#0F172A',
  bgBanner: '#1E1B4B',
  border: '#1E293B',
  borderAccent: '#312E81',
  textPrimary: '#E2E8F0',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textBanner: '#C7D2FE',
  accentBg: '#3A2E0A',
  statusGreen: '#4ADE80',
};

export type ColorScheme = 'light' | 'dark';

export const THEMES: Record<ColorScheme, ThemeTokens> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};

/**
 * Default export COLORS for backward compatibility and static use.
 * For dynamic dark/light mode switching in components, use the `useTheme()` hook.
 */
export const COLORS = LIGHT_THEME;

/**
 * Spacing scale (multiples of 4 px).
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/**
 * Border-radius scale.
 */
export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
} as const;

/**
 * Global Font Size scale.
 */
export const FONT_SIZE = {
  xs: 11,
  caption: 12.5,
  sm: 13,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  title: 20,
  h3: 22,
  h2: 26,
  h1: 28,
  hero: 32,
} as const;

/**
 * Global Font Weight scale.
 */
export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

/**
 * Global Line Height scale.
 */
export const LINE_HEIGHT = {
  tight: 18,
  normal: 22,
  relaxed: 26,
  heading: 32,
  hero: 36,
} as const;

/**
 * Global Typography Presets.
 */
export const TYPOGRAPHY = {
  hero: {
    fontSize: FONT_SIZE.hero,
    fontWeight: FONT_WEIGHT.heavy,
    lineHeight: LINE_HEIGHT.hero,
  },
  h1: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.heavy,
    lineHeight: LINE_HEIGHT.heading,
  },
  h2: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.heavy,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: FONT_SIZE.h3,
    fontWeight: FONT_WEIGHT.bold,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.normal,
  },
  label: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  body: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
  input: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.5,
  },
  button: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  caption: {
    fontSize: FONT_SIZE.caption,
    lineHeight: LINE_HEIGHT.tight,
  },
} as const;
