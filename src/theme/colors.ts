export const colors = {
  primary: '#E75650',
  primaryDark: '#D94843',
  primaryLight: '#F9D0CD',

  background: '#FFFFFF',
  surface: '#F7F7F5',

  textPrimary: '#111111',
  textSecondary: '#666666',
  textMuted: '#999999',

  border: '#E5E5E5',

  success: '#3D8378',
  successLight: '#D2E8E8',

  gold: '#E9B949',
  goldLight: '#FDF0D3',

  silver: '#64759B',
  silverLight: '#E8EBF2',

  error: '#D64545',

  black: '#000000',
} as const;

export type PaletteColor = keyof typeof colors;

/** Light theme = design-system tokens + aliases used by existing screens. */
export const lightTheme = {
  ...colors,
  text: colors.textPrimary,
  backgroundElement: colors.surface,
  backgroundSelected: colors.primaryLight,
} as const;

/** Dark variant derived from the same system (surfaces invert, accents stay). */
export const darkTheme = {
  primary: colors.primary,
  primaryDark: colors.primaryDark,
  primaryLight: '#5A2A28',

  background: colors.black,
  surface: '#1A1A1A',

  textPrimary: '#F5F5F5',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',

  border: '#2A2A2A',

  success: colors.success,
  successLight: '#1F3F3C',

  gold: colors.gold,
  goldLight: '#3F3420',

  silver: colors.silver,
  silverLight: '#2A3142',

  error: colors.error,
  black: colors.black,

  text: '#F5F5F5',
  backgroundElement: '#1A1A1A',
  backgroundSelected: '#5A2A28',
} as const;

export const Colors = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeColor = keyof typeof lightTheme & keyof typeof darkTheme;
