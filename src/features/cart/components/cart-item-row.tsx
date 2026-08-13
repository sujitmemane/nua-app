import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useNetInfo } from '@/hooks/use-net-info';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, getDiscountedPrice } from '@/utils';
import { toast } from '@/utils/toast';

import type { CartItem } from '../types';

const IMAGE_SIZE = 72;
const STEPPER_WIDTH = 92;
const STEPPER_HEIGHT = 32;

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function CartItemRow({ item, onIncrement, onDecrement }: CartItemRowProps) {
  const theme = useTheme();
  const router = useRouter();
  const { isOnline } = useNetInfo();
  const unitPrice = getDiscountedPrice(item.price, item.discountPercentage);
  const hasDiscount = item.discountPercentage > 0;

  function openProduct() {
    if (!isOnline) {
      toast.error("You're offline", "Can't open product details. Please connect to the internet.");
      return;
    }
    router.push(`/product/${item.productId}`);
  }

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Pressable
        onPress={openProduct}
        style={({ pressed }) => [
          styles.imageWrap,
          { backgroundColor: theme.surface },
          pressed && styles.pressed,
        ]}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          contentFit="contain"
          cachePolicy="memory-disk"
          accessibilityLabel={item.title}
        />
      </Pressable>

      <View style={styles.details}>
        <Pressable onPress={openProduct} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedText type="small" numberOfLines={2} style={styles.title}>
            {item.title}
          </ThemedText>
        </Pressable>

        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <ThemedText type="bodyMedium" numberOfLines={1}>
              {formatCurrency(unitPrice)}
            </ThemedText>
            {hasDiscount ? (
              <ThemedText type="caption" themeColor="textMuted" numberOfLines={1} style={styles.original}>
                {formatCurrency(item.price)}
              </ThemedText>
            ) : null}
          </View>

          <View style={[styles.stepper, { backgroundColor: theme.primary }]}>
            <Pressable
              onPress={onDecrement}
              hitSlop={6}
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
              hitSlop={6}
              style={({ pressed }) => [styles.stepHit, pressed && styles.pressed]}>
              <ThemedText type="button" style={styles.stepText}>
                +
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  imageWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    padding: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    minWidth: 0,
    minHeight: IMAGE_SIZE,
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  priceRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  original: {
    textDecorationLine: 'line-through',
  },
  stepper: {
    width: STEPPER_WIDTH,
    height: STEPPER_HEIGHT,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepHit: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 18,
    includeFontPadding: false,
  },
  pressed: {
    opacity: 0.75,
  },
});
