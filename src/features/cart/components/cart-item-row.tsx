import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatCurrency, getDiscountedPrice } from '@/utils';

import type { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const unitPrice = getDiscountedPrice(item.price, item.discountPercentage);
  const lineTotal = unitPrice * item.quantity;

  return (
    <ThemedView type="backgroundElement" style={styles.row}>
      <Link href={`/product/${item.productId}`} asChild>
        <Pressable style={({ pressed }) => [styles.product, pressed && styles.pressed]}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            contentFit="contain"
            cachePolicy="memory-disk"
            accessibilityLabel={item.title}
          />
          <View style={styles.info}>
            <ThemedText type="default" numberOfLines={2}>
              {item.title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatCurrency(unitPrice)} each
            </ThemedText>
            <ThemedText type="smallBold">{formatCurrency(lineTotal)}</ThemedText>
          </View>
        </Pressable>
      </Link>

      <View style={styles.actions}>
        <View style={styles.stepper}>
          <Pressable onPress={onDecrement} style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
            <ThemedText type="default">−</ThemedText>
          </Pressable>
          <ThemedText type="smallBold">{item.quantity}</ThemedText>
          <Pressable onPress={onIncrement} style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
            <ThemedText type="default">+</ThemedText>
          </Pressable>
        </View>
        <Pressable onPress={onRemove} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedText type="linkPrimary">Remove</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  product: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Spacing.two,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
