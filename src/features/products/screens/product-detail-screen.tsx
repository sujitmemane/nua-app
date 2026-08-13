import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { selectItemQuantity, useCartStore } from '@/features/cart';
import { eventsService } from '@/features/events';
import { formatCurrency, getDiscountedPrice } from '@/utils';

import { ProductImageCarousel } from '../components/product-image-carousel';
import { useProduct } from '../queries/use-products';
import type { ProductReview } from '../types';

export function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const { data: product, isPending, isError, error } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const quantityInCart = useCartStore(selectItemQuantity(Number.isFinite(id) ? id : 0));

  const contentWidth = Math.min(windowWidth, MaxContentWidth) - Spacing.four * 2;
  const discountedPrice = product
    ? getDiscountedPrice(product.price, product.discountPercentage)
    : 0;

  useEffect(() => {
    if (!product) return;
    eventsService.productViewed({
      productId: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
    });
  }, [product?.id]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: product?.title ?? 'Product' }} />

      {isPending ? (
        <ActivityIndicator style={styles.state} />
      ) : isError ? (
        <ThemedText themeColor="textSecondary" style={styles.state}>
          {error.message}
        </ThemedText>
      ) : !product ? (
        <ThemedText themeColor="textSecondary" style={styles.state}>
          Product not found.
        </ThemedText>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <ProductImageCarousel
            images={product.images.length > 0 ? product.images : [product.thumbnail]}
            accessibilityLabel={product.title}
            pageWidth={contentWidth}
          />

          <View style={styles.section}>
            <ThemedText type="subtitle">{product.title}</ThemedText>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {product.brand} · {product.category}
            </ThemedText>

            <View style={styles.priceRow}>
              <ThemedText type="default">{formatCurrency(discountedPrice)}</ThemedText>
              {product.discountPercentage > 0 ? (
                <>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.originalPrice}>
                    {formatCurrency(product.price)}
                  </ThemedText>
                  <ThemedView type="backgroundElement" style={styles.discountBadge}>
                    <ThemedText type="smallBold">−{product.discountPercentage}%</ThemedText>
                  </ThemedView>
                </>
              ) : null}
            </View>

            <ThemedText type="small" themeColor="textSecondary">
              ★ {product.rating.toFixed(1)} · {product.availabilityStatus} · {product.stock} in
              stock
            </ThemedText>

            {quantityInCart > 0 ? (
              <View style={styles.cartRow}>
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => decrement(product.id)}
                    style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
                    <ThemedText type="default">−</ThemedText>
                  </Pressable>
                  <ThemedText type="smallBold">{quantityInCart} in cart</ThemedText>
                  <Pressable
                    onPress={() => increment(product.id)}
                    style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}>
                    <ThemedText type="default">+</ThemedText>
                  </Pressable>
                </View>
                <Link href="/cart" asChild>
                  <Pressable style={({ pressed }) => pressed && styles.pressed}>
                    <ThemedText type="linkPrimary">View cart</ThemedText>
                  </Pressable>
                </Link>
              </View>
            ) : (
              <Pressable
                onPress={() => addItem(product, product.minimumOrderQuantity || 1)}
                style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                <ThemedView type="backgroundSelected" style={styles.addButtonInner}>
                  <ThemedText type="smallBold">Add to cart</ThemedText>
                </ThemedView>
              </Pressable>
            )}
          </View>

          <ThemedText type="default">{product.description}</ThemedText>

          {product.tags.length > 0 ? (
            <View style={styles.tags}>
              {product.tags.map((tag) => (
                <ThemedView key={tag} type="backgroundElement" style={styles.tag}>
                  <ThemedText type="small">{tag}</ThemedText>
                </ThemedView>
              ))}
            </View>
          ) : null}

          <ThemedView type="backgroundElement" style={styles.metaCard}>
            <MetaRow label="SKU" value={product.sku} />
            <MetaRow label="Weight" value={`${product.weight} kg`} />
            <MetaRow label="Min. order" value={String(product.minimumOrderQuantity)} />
            <MetaRow
              label="Dimensions"
              value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth}`}
            />
            <MetaRow label="Warranty" value={product.warrantyInformation} />
            <MetaRow label="Shipping" value={product.shippingInformation} />
            <MetaRow label="Barcode" value={product.meta.barcode} />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.policyCard}>
            <ThemedText type="default">Return policy</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {product.returnPolicy}
            </ThemedText>
            <Link href="/return-policy" asChild>
              <Pressable style={({ pressed }) => [styles.policyButton, pressed && styles.pressed]}>
                <ThemedText type="linkPrimary">View full return policy</ThemedText>
              </Pressable>
            </Link>
          </ThemedView>

          {product.reviews.length > 0 ? (
            <View style={styles.section}>
              <ThemedText type="default">Reviews</ThemedText>
              {product.reviews.map((review, index) => (
                <ReviewRow key={`${review.reviewerEmail}-${index}`} review={review} />
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}
    </ThemedView>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="small" style={styles.metaValue}>
        {value}
      </ThemedText>
    </View>
  );
}

function ReviewRow({ review }: { review: ProductReview }) {
  return (
    <ThemedView type="backgroundElement" style={styles.review}>
      <View style={styles.reviewHeader}>
        <ThemedText type="smallBold">{review.reviewerName}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          ★ {review.rating}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {review.comment}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  state: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  section: {
    gap: Spacing.two,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: Spacing.one,
    alignSelf: 'flex-start',
  },
  addButtonInner: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  metaCard: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  metaValue: {
    flex: 1,
    textAlign: 'right',
  },
  policyCard: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  policyButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
  review: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});
