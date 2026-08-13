import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, getDiscountedPrice } from '@/utils';

import type { CartItem } from '../types';

const IMAGE_SIZE = 72;
const STEPPER_HEIGHT = 34;

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function CartItemRow({ item, onIncrement, onDecrement }: CartItemRowProps) {
  const theme = useTheme();
  const unitPrice = getDiscountedPrice(item.price, item.discountPercentage);
  const hasDiscount = item.discountPercentage > 0;

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Link href={`/product/${item.productId}`} asChild>
        <Pressable style={({ pressed }) => [styles.product, pressed && styles.pressed]}>
          <View style={[styles.imageWrap, { backgroundColor: theme.surface }]}>
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
              contentFit="contain"
              cachePolicy="memory-disk"
              accessibilityLabel={item.title}
            />
          </View>

          <View style={styles.info}>
            <ThemedText type="small" numberOfLines={2} style={styles.title}>
              {item.title}
            </ThemedText>
            <View style={styles.priceRow}>
              <ThemedText type="bodyMedium">{formatCurrency(unitPrice)}</ThemedText>
              {hasDiscount ? (
                <ThemedText type="caption" themeColor="textMuted" style={styles.original}>
                  {formatCurrency(item.price)}
                </ThemedText>
              ) : null}
            </View>
          </View>
        </Pressable>
      </Link>

      <View style={styles.stepperWrap}>
        <View style={[styles.stepper, { backgroundColor: theme.primary }]}>
          <Pressable
            onPress={onDecrement}
            hitSlop={8}
            style={({ pressed }) => [styles.stepHit, pressed && styles.pressed]}>
            <ThemedText type="button" style={styles.stepText}>
              −
            </ThemedText>
          </Pressable>
          <View style={styles.qty}>
            <ThemedText type="button" style={styles.stepText}>
              {item.quantity}
            </ThemedText>
          </View>
          <Pressable
            onPress={onIncrement}
            hitSlop={8}
            style={({ pressed }) => [styles.stepHit, pressed && styles.pressed]}>
            <ThemedText type="button" style={styles.stepText}>
              +
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  product: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    marginRight: Spacing.three,
  },
  imageWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    padding: 8,
    marginRight: Spacing.three,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  original: {
    textDecorationLine: 'line-through',
  },
  stepperWrap: {
    height: IMAGE_SIZE,
    justifyContent: 'center',
  },
  stepper: {
    width: 96,
    height: STEPPER_HEIGHT,
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  stepHit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 15,
    includeFontPadding: false,
  },
  pressed: {
    opacity: 0.75,
  },
});
