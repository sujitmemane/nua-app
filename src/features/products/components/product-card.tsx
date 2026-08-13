import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { selectItemQuantity, useCartStore } from '@/features/cart';
import { useNetInfo } from '@/hooks/use-net-info';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, getDiscountedPrice } from '@/utils';
import { toast } from '@/utils/toast';

import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const { isOnline } = useNetInfo();
  const addItem = useCartStore((state) => state.addItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const quantity = useCartStore(selectItemQuantity(product.id));

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;
  const discountLabel = Math.round(product.discountPercentage);

  function openProduct() {
    if (!isOnline) {
      toast.error("You're offline", "Can't open product details. Please connect to the internet.");
      return;
    }
    router.push(`/product/${product.id}`);
  }

  return (
    <ThemedView type="background" style={styles.card}>
      <View style={[styles.imageWrap, { backgroundColor: theme.surface }]}>
        <Pressable
          onPress={openProduct}
          style={({ pressed }) => [styles.imageHit, pressed && styles.pressed]}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            accessibilityLabel={product.title}
          />
          {hasDiscount ? (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <ThemedText type="caption" style={styles.badgeText}>
                {discountLabel}% Off
              </ThemedText>
            </View>
          ) : null}
        </Pressable>

        {quantity > 0 ? (
          <View style={[styles.qtyOverlay, { backgroundColor: theme.primary }]}>
            <Pressable
              onPress={() => decrement(product.id)}
              hitSlop={6}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="button" style={styles.qtyText}>
                −
              </ThemedText>
            </Pressable>
            <ThemedText type="button" style={styles.qtyText}>
              {quantity}
            </ThemedText>
            <Pressable
              onPress={() => increment(product.id)}
              hitSlop={6}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="button" style={styles.qtyText}>
                +
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => addItem(product, 1)}
            style={({ pressed }) => [
              styles.addButton,
              { borderColor: theme.primary, backgroundColor: theme.background },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="caption" themeColor="primary" style={styles.addLabel}>
              ADD
            </ThemedText>
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={openProduct}
        style={({ pressed }) => [styles.body, pressed && styles.pressed]}>
        <View style={styles.priceRow}>
          <ThemedText type="title" themeColor="textPrimary" numberOfLines={1}>
            {formatCurrency(discountedPrice)}
          </ThemedText>
          {hasDiscount ? (
            <ThemedText type="caption" themeColor="textMuted" style={styles.originalPrice}>
              {formatCurrency(product.price)}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="small" numberOfLines={2} style={styles.name}>
          {product.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="textMuted" numberOfLines={1}>
          ★ {product.rating.toFixed(1)} · {product.weight} kg
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  imageWrap: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageHit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '78%',
    height: '78%',
  },
  badge: {
    position: 'absolute',
    top: Spacing.one,
    left: Spacing.one,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 13,
  },
  addButton: {
    position: 'absolute',
    right: Spacing.one,
    bottom: Spacing.one,
    minWidth: 52,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  addLabel: {
    fontWeight: '700',
  },
  qtyOverlay: {
    position: 'absolute',
    right: Spacing.one,
    bottom: Spacing.one,
    minWidth: 72,
    height: 28,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  body: {
    paddingTop: Spacing.two,
    gap: 2,
    minHeight: 72,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flexWrap: 'wrap',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  name: {
    minHeight: 40,
  },
});
