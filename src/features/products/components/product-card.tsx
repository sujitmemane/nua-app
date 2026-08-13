import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { selectItemQuantity, useCartStore } from '@/features/cart';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, getDiscountedPrice } from '@/utils';

import type { Product } from '../types';

const BADGE_GREEN = '#318616';
const ADD_PINK = '#E51A4C';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const addItem = useCartStore((state) => state.addItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const quantity = useCartStore(selectItemQuantity(product.id));

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;
  const discountLabel = Math.round(product.discountPercentage);

  return (
    <ThemedView type="background" style={[styles.card, { borderColor: theme.backgroundElement }]}>
      <Link href={`/product/${product.id}`} asChild>
        <Pressable style={({ pressed }) => pressed && styles.pressed}>
          <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}>
            <Image
              source={{ uri: product.thumbnail }}
              style={styles.image}
              contentFit="contain"
              transition={200}
              cachePolicy="memory-disk"
              accessibilityLabel={product.title}
            />
            {hasDiscount ? (
              <View style={styles.badgeWrap}>
                <View style={styles.badge}>
                  <ThemedText type="smallBold" style={styles.badgePercent}>
                    {discountLabel}%
                  </ThemedText>
                  <ThemedText type="smallBold" style={styles.badgeOff}>
                    Off
                  </ThemedText>
                </View>
                <View style={styles.badgeNotch} />
              </View>
            ) : null}
          </View>

          <View style={styles.body}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {product.weight} kg ▾
            </ThemedText>
            <ThemedText type="default" numberOfLines={2} style={styles.title}>
              {product.title}
            </ThemedText>
            <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small" themeColor="textSecondary">
                ★ {product.rating.toFixed(1)}
              </ThemedText>
            </View>
          </View>
        </Pressable>
      </Link>

      <View style={styles.footer}>
        <View style={styles.prices}>
          {hasDiscount ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.originalPrice}>
              {formatCurrency(product.price)}
            </ThemedText>
          ) : null}
          <ThemedText type="default" style={styles.salePrice}>
            {formatCurrency(discountedPrice)}
          </ThemedText>
        </View>

        {quantity > 0 ? (
          <View style={styles.qtyButton}>
            <Pressable
              onPress={() => decrement(product.id)}
              hitSlop={6}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="smallBold" style={styles.qtyButtonText}>
                −
              </ThemedText>
            </Pressable>
            <ThemedText type="smallBold" style={styles.qtyButtonText}>
              {quantity}
            </ThemedText>
            <Pressable
              onPress={() => increment(product.id)}
              hitSlop={6}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedText type="smallBold" style={styles.qtyButtonText}>
                +
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => addItem(product, 1)}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.addButtonText}>
              Add
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: Spacing.two,
    paddingBottom: Spacing.three,
  },
  pressed: {
    opacity: 0.8,
  },
  imageWrap: {
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '78%',
    height: '78%',
  },
  badgeWrap: {
    position: 'absolute',
    top: 0,
    left: Spacing.two,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: BADGE_GREEN,
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
    minWidth: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  badgePercent: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 16,
  },
  badgeOff: {
    color: '#ffffff',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: 600,
  },
  badgeNotch: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BADGE_GREEN,
  },
  body: {
    paddingTop: Spacing.two,
    gap: 4,
    minHeight: 78,
  },
  title: {
    fontWeight: 700,
    minHeight: 48,
  },
  metaChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 999,
  },
  footer: {
    marginTop: Spacing.two,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  prices: {
    flex: 1,
    gap: 0,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 22,
  },
  addButton: {
    minWidth: 72,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ADD_PINK,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  addButtonText: {
    color: ADD_PINK,
  },
  qtyButton: {
    minWidth: 84,
    height: 34,
    borderRadius: 8,
    backgroundColor: ADD_PINK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  qtyButtonText: {
    color: '#ffffff',
  },
});
