/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/theme/theme-store';

export function useTheme() {
  const preference = useThemeStore((state) => state.preference);

  return Colors[preference];
}

export type AppTheme = ReturnType<typeof useTheme>;
