import { SymbolView } from 'expo-symbols';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, colors } from '@/constants/theme';
import { selectCartCount, useCartStore } from '@/features/cart';

import type { CategoryHeaderTheme } from '../constants/category-themes';

interface ProductsHeaderProps {
  theme: CategoryHeaderTheme;
}

export function ProductsHeader({ theme }: ProductsHeaderProps) {
  const cartCount = useCartStore(selectCartCount);

  return (
    <View style={styles.row}>
      <ThemedText type="h2" style={[styles.logo, { color: theme.foreground }]}>
        nua
      </ThemedText>

      <View style={styles.actions}>
        <Link href="/cart" asChild>
          <Pressable
            hitSlop={8}
            style={({ pressed }) => [styles.cartHit, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Cart">
            <SymbolView
              name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
              size={24}
              tintColor={theme.foreground}
            />
            {cartCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <ThemedText type="caption" style={styles.badgeText}>
                  {cartCount > 99 ? '99+' : String(cartCount)}
                </ThemedText>
              </View>
            ) : null}
          </Pressable>
        </Link>

        <Pressable
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}
          accessibilityRole="button"
          accessibilityLabel="Profile">
          <View style={[styles.avatar, { borderColor: theme.foreground }]}>
            <SymbolView
              name={{
                ios: 'person.fill',
                android: 'person',
                web: 'person',
              }}
              size={16}
              tintColor={theme.foreground}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    textTransform: 'lowercase',
    letterSpacing: -0.6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  cartHit: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pressed: {
    opacity: 0.75,
  },
});
