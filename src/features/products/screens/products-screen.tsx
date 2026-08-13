import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { eventsService } from '@/features/events';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { CategoryTabs } from '../components/category-tabs';
import { ProductCard } from '../components/product-card';
import {
  getCategoryHeaderTheme,
  getCategorySearchPlaceholder,
} from '../constants/category-themes';
import { useCategories, useProducts } from '../queries/use-products';
import { ALL_CATEGORY } from '../services/products-service';

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORY);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const headerTheme = getCategoryHeaderTheme(category);

  const { data: categories = [] } = useCategories();
  const {
    data: products,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useProducts(debouncedSearch, category);

  useEffect(() => {
    if (!debouncedSearch) return;
    eventsService.searchPerformed({ query: debouncedSearch, category });
  }, [debouncedSearch, category]);

  function handleSelectCategory(next: string) {
    setCategory(next);
    if (search) setSearch('');
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.headerBlock,
          { backgroundColor: headerTheme.background, paddingTop: insets.top + Spacing.two },
        ]}>
        <View style={styles.headerInner}>
          <ThemedText type="h1" style={{ color: headerTheme.foreground }}>
            Nua
          </ThemedText>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={getCategorySearchPlaceholder(category)}
            backgroundColor={headerTheme.searchBackground}
            textColor={headerTheme.searchText}
            placeholderColor={headerTheme.searchPlaceholder}
            borderColor="transparent"
          />
        </View>
        <CategoryTabs
          categories={categories}
          selected={category}
          onSelect={handleSelectCategory}
          activeColor={headerTheme.foreground}
          inactiveColor={headerTheme.muted}
          underlineColor={headerTheme.underline}
        />
      </View>

      <FlatList
        data={products}
        numColumns={3}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
        refreshing={isRefetching}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.state} /> : null}
        ListEmptyComponent={
          isPending ? (
            <ActivityIndicator style={styles.state} />
          ) : isError ? (
            <ThemedText themeColor="textSecondary" style={styles.state}>
              {error.message}
            </ThemedText>
          ) : (
            <ThemedText themeColor="textSecondary" style={styles.state}>
              {debouncedSearch
                ? `No products found for “${debouncedSearch}”.`
                : 'No products yet.'}
            </ThemedText>
          )
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBlock: {
    width: '100%',
    paddingBottom: Spacing.one,
  },
  headerInner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  content: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  row: {
    gap: Spacing.two,
  },
  state: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
});
