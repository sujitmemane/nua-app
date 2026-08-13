import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily, typography } from '@/theme/typography';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  placeholderColor?: string;
  borderColor?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  backgroundColor,
  textColor,
  placeholderColor,
  borderColor,
  ...rest
}: SearchBarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? theme.surface,
          borderColor: borderColor ?? theme.border,
        },
      ]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor ?? theme.textMuted}
        style={[styles.input, { color: textColor ?? theme.textPrimary }]}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
  },
  input: {
    height: 44,
    fontFamily: fontFamily.regular,
    fontSize: typography.body.fontSize,
  },
});
