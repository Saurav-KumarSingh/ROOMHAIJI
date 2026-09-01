/**
 * Design token system for ROOMHAIJI.
 *
 * All raw color values and spacing scale are defined here.
 * Import from this file — never use raw hex strings in components.
 *
 * Color palette: dark navy base with amber accent.
 */

export const COLORS = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  /** Primary screen background */
  bgBase: '#0b0f19',
  /** Card / elevated surface background */
  bgSurface: '#111827',
  /** Deep accent banner background (indigo tint) */
  bgBanner: '#1e1b4b',

  // ── Borders ────────────────────────────────────────────────────────────────
  /** Default subtle border */
  border: '#1f2937',
  /** Accent banner border (indigo) */
  borderAccent: '#312e81',

  // ── Text ───────────────────────────────────────────────────────────────────
  /** Primary high-contrast text */
  textPrimary: '#f8fafc',
  /** Secondary / muted text */
  textSecondary: '#94a3b8',
  /** Tertiary / label text */
  textTertiary: '#64748b',
  /** Banner body text */
  textBanner: '#c7d2fe',

  // ── Brand / Accent ─────────────────────────────────────────────────────────
  /** Primary amber accent — active icons, kicker text, badges */
  accent: '#f59e0b',
  /** Amber badge background */
  accentBg: '#451a03',

  // ── Status ─────────────────────────────────────────────────────────────────
  /** Green "live" status indicator */
  statusGreen: '#10b981',

  // ── Misc ───────────────────────────────────────────────────────────────────
  /** Pure white — logo/avatar backgrounds */
  white: '#ffffff',
} as const;

/**
 * Spacing scale (multiples of 4 px).
 * Use these instead of arbitrary magic numbers.
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
} as const;
