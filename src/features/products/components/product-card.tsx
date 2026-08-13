import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils';

import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.thumbnail}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            accessibilityLabel={product.title}
          />
          <View style={styles.body}>
            <View style={styles.header}>
              <ThemedText type="default" style={styles.title} numberOfLines={1}>
                {product.title}
              </ThemedText>
              <ThemedText type="default">{formatCurrency(product.price)}</ThemedText>
            </View>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {product.brand} · ★ {product.rating.toFixed(1)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
              {product.description}
            </ThemedText>
          </View>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Spacing.two,
  },
  body: {
    flex: 1,
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
});
