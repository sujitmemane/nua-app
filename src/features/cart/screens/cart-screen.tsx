import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/utils';

import { CartItemRow } from '../components/cart-item-row';
import {
  selectCartActualPrice,
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from '../store/cart-store';

export function CartScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const clear = useCartStore((state) => state.clear);
  const itemCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const actualPrice = useCartStore(selectCartActualPrice);
  const saved = Math.max(0, actualPrice - subtotal);
  const tabClearance = (Platform.OS === 'ios' ? 88 : 72) + insets.bottom;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <View>
          <ThemedText type="subtitle">Cart</ThemedText>
          {itemCount > 0 ? (
            <ThemedText type="caption" themeColor="textMuted">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </ThemedText>
          ) : null}
        </View>
        {items.length > 0 ? (
          <Pressable onPress={clear} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="linkPrimary">Clear</ThemedText>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.productId)}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrement={() => increment(item.productId)}
            onDecrement={() => decrement(item.productId)}
          />
        )}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <ThemedText type="title">Your cart is empty</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyCopy}>
              Add something from Products.
            </ThemedText>
          </View>
        }
      />

      {items.length > 0 ? (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: theme.border,
              marginBottom: tabClearance,
            },
          ]}>
          <View style={styles.summary}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Subtotal
              </ThemedText>
              {saved > 0 ? (
                <ThemedText type="caption" themeColor="success">
                  Saved {formatCurrency(saved)}
                </ThemedText>
              ) : null}
            </View>
            <ThemedText type="title">{formatCurrency(subtotal)}</ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.checkout,
              { backgroundColor: theme.primary },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="button" style={styles.checkoutLabel}>
              Checkout
            </ThemedText>
          </Pressable>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexGrow: 1,
  },
  emptyWrap: {
    marginTop: Spacing.six,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyCopy: {
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkout: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutLabel: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});
