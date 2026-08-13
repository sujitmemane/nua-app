import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { selectCartCount, useCartStore } from '@/features/cart';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="products" href="/" asChild>
            <TabButton icon={{ ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' }}>
              Products
            </TabButton>
          </TabTrigger>
          <TabTrigger name="events" href="/events" asChild>
            <TabButton
              icon={{
                ios: 'list.bullet.rectangle.fill',
                android: 'receipt_long',
                web: 'receipt_long',
              }}>
              Events
            </TabButton>
          </TabTrigger>
          <TabTrigger name="cart" href="/cart" asChild>
            <TabButton icon={{ ios: 'cart.fill', android: 'shopping_cart', web: 'shopping_cart' }}>
              Cart
            </TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabIconName = { ios: string; android: string; web: string };

export function TabButton({
  children,
  isFocused,
  icon,
  ...props
}: TabTriggerSlotProps & { icon: TabIconName }) {
  const theme = useTheme();
  const cartCount = useCartStore(selectCartCount);
  const isCart = children === 'Cart';
  const color = isFocused ? theme.primary : theme.textMuted;

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View>
        <SymbolView name={icon} size={22} tintColor={color} />
        {isCart && cartCount > 0 ? (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <ThemedText type="caption" style={styles.badgeText}>
              {cartCount > 99 ? '99+' : String(cartCount)}
            </ThemedText>
          </View>
        ) : null}
      </View>
      <ThemedText type="caption" style={[styles.label, { color }]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <View {...props} style={[styles.tabList, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.one,
  },
  label: {
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
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
  pressed: {
    opacity: 0.7,
  },
});
