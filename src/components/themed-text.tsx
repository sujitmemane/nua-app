import { Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { typography, type TypographyToken } from '@/theme/typography';

type LegacyTextType = 'default' | 'subtitle' | 'smallBold' | 'link' | 'linkPrimary' | 'code';

export type ThemedTextProps = TextProps & {
  type?: TypographyToken | LegacyTextType;
  themeColor?: ThemeColor;
};

const LEGACY_TYPE_MAP: Record<LegacyTextType, TypographyToken> = {
  default: 'bodyMedium',
  subtitle: 'h1',
  smallBold: 'small',
  link: 'small',
  linkPrimary: 'button',
  code: 'caption',
};

function resolveType(type: ThemedTextProps['type']): TypographyToken {
  if (!type) return 'body';
  if (type in LEGACY_TYPE_MAP) return LEGACY_TYPE_MAP[type as LegacyTextType];
  return type as TypographyToken;
}

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const token = resolveType(type);
  const isPrimaryLink = type === 'link' || type === 'linkPrimary';
  const isLegacyBoldSmall = type === 'smallBold';

  return (
    <Text
      style={[
        typography[token],
        isLegacyBoldSmall && { fontFamily: typography.button.fontFamily, fontWeight: '600' },
        { color: theme[themeColor ?? (isPrimaryLink ? 'primary' : 'textPrimary')] },
        style,
      ]}
      {...rest}
    />
  );
}
