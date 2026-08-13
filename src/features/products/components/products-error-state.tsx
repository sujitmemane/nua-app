import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ProductsErrorStateProps {
  offline?: boolean;
  retrying?: boolean;
  onRetry: () => void;
}

export function ProductsErrorState({ offline, retrying, onRetry }: ProductsErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <ThemedText type="title" style={styles.title}>
        Couldn’t load products
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.copy}>
        {offline
          ? "You're offline. Connect to the internet and try again."
          : 'Something went wrong. Please try again.'}
      </ThemedText>
      <Pressable
        onPress={onRetry}
        disabled={retrying}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.primary },
          (pressed || retrying) && styles.pressed,
        ]}>
        {retrying ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText type="button" style={styles.buttonLabel}>
            Retry
          </ThemedText>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  copy: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.two,
    minWidth: 140,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },
});
