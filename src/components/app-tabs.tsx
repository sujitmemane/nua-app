import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { fontFamily } from '@/constants/theme';
import { selectCartCount, useCartStore } from '@/features/cart';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();
  const cartCount = useCartStore(selectCartCount);
  

  const labelFont = {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
  } as const;

  return (
    <NativeTabs
      backgroundColor={theme.background}
      tintColor={theme.primary}
      iconColor={{ default: theme.textMuted, selected: theme.primary }}
      labelStyle={{
        default: { ...labelFont, color: theme.textMuted },
        selected: { ...labelFont, color: theme.primary },
      }}
      badgeBackgroundColor={theme.primary}
      badgeTextColor="#FFFFFF"
      indicatorColor={theme.primaryLight}
      rippleColor={theme.primaryLight}
      shadowColor={theme.border}
      blurEffect="none"
      disableTransparentOnScrollEdge
      labelVisibilityMode="labeled">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label selectedStyle={{ ...labelFont, color: theme.primary }}>
          Products
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bag', selected: 'bag.fill' }}
          md="shopping_bag"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="events">
        <NativeTabs.Trigger.Label selectedStyle={{ ...labelFont, color: theme.primary }}>
          Events
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }}
          md="receipt_long"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Label selectedStyle={{ ...labelFont, color: theme.primary }}>
          Cart
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'cart', selected: 'cart.fill' }}
          md="shopping_cart"
        />
        {cartCount > 0 ? (
          <NativeTabs.Trigger.Badge>
            {cartCount > 99 ? '99+' : String(cartCount)}
          </NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
