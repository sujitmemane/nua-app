import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

export type TypographyToken =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'bodyMedium'
  | 'small'
  | 'caption'
  | 'button';

export const typography: Record<TypographyToken, TextStyle> = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 50,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  small: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
};
