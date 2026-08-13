import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { ALL_CATEGORY } from '../services/products-service';
import type { ProductCategory } from '../types';

interface CategoryTabsProps {
  categories: ProductCategory[];
  selected: string;
  onSelect: (slug: string) => void;
  activeColor: string;
  inactiveColor: string;
  underlineColor: string;
}

export function CategoryTabs({
  categories,
  selected,
  onSelect,
  activeColor,
  inactiveColor,
  underlineColor,
}: CategoryTabsProps) {
  const items = [{ slug: ALL_CATEGORY, name: 'All', url: '' }, ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {items.map((category) => {
        const isActive = selected === category.slug;
        return (
          <Pressable
            key={category.slug}
            onPress={() => onSelect(category.slug)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <ThemedText
              type="button"
              numberOfLines={1}
              style={{ color: isActive ? activeColor : inactiveColor }}>
              {category.name}
            </ThemedText>
            <View
              style={[
                styles.underline,
                { backgroundColor: isActive ? underlineColor : 'transparent' },
              ]}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.four,
    alignItems: 'flex-end',
  },
  item: {
    alignItems: 'center',
    paddingBottom: Spacing.one,
    minWidth: 44,
  },
  underline: {
    marginTop: 6,
    height: 3,
    width: '100%',
    borderRadius: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
