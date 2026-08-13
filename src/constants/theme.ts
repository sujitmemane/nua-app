/**
 * App theme. Design tokens live in `@/theme`; this file keeps spacing +
 * re-exports colors so existing `@/constants/theme` imports still work.
 */

import '@/global.css';

import { Platform } from 'react-native';

export { colors, Colors } from '@/theme/colors';
export type { ThemeColor } from '@/theme/colors';
export { fontFamily, typography } from '@/theme/typography';
export type { TypographyToken } from '@/theme/typography';

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
