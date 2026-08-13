import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils';

import { CartItemRow } from '../components/cart-item-row';
import { selectCartSubtotal, useCartStore } from '../store/cart-store';

export function CartScreen() {
  const insets = useSafeAreaInsets();
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore(selectCartSubtotal);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <ThemedText type="subtitle">Cart</ThemedText>
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
            onRemove={() => removeItem(item.productId)}
          />
        )}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BottomTabInset + Spacing.four + (items.length > 0 ? 72 : 0) },
        ]}
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            Your cart is empty. Add something from Products.
          </ThemedText>
        }
      />

      {items.length > 0 ? (
        <ThemedView
          type="backgroundElement"
          style={[styles.footer, { bottom: BottomTabInset, paddingBottom: Spacing.three }]}>
          <ThemedText type="small" themeColor="textSecondary">
            Subtotal
          </ThemedText>
          <ThemedText type="default">{formatCurrency(subtotal)}</ThemedText>
        </ThemedView>
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
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
});
