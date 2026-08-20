import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { ConnectionBanner } from '@/components/connection-banner';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { eventsService } from '@/features/events';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useNetInfo } from '@/hooks/use-net-info';
import { useTheme } from '@/hooks/use-theme';
import { useThrottledCallback } from '@/hooks/use-throttled-callback';
import { MOCK_SKELETON } from '@/lib/offline-mock';
import { toast } from '@/utils/toast';
import { CategoryTabs } from '../components/category-tabs';
import { ProductCard } from '../components/product-card';
import { ProductGridSkeleton } from '../components/product-card-skeleton';
import { ProductsErrorState } from '../components/products-error-state';
import { ProductsHeader } from '../components/products-header';
import {
  getCategoryHeaderTheme,
  getCategorySearchPlaceholder,
} from '../constants/category-themes';
import { useCategories, useProducts } from '../queries/use-products';
import { ALL_CATEGORY } from '../services/products-service';

export function ProductsScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORY);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const headerTheme = getCategoryHeaderTheme(category);
  const theme = useTheme();
  const { isOnline } = useNetInfo();

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

  const showSkeleton = MOCK_SKELETON || isPending;

  useEffect(() => {
    if (!debouncedSearch) return;
    eventsService.searchPerformed({ query: debouncedSearch, category });
  }, [debouncedSearch, category]);

  function handleSelectCategory(next: string) {
    setCategory(next);
  }

  const handleEndReached = useThrottledCallback(() => {
    if (showSkeleton) return;
    if (!isOnline) {
      toast.error("You're offline", "Can't load more. Please connect to the internet.");
      return;
    }
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, 800);

  return (
    <ThemedView style={styles.container}>
      <ConnectionBanner headerColor={headerTheme.background} />
      <View style={[styles.headerBlock, { backgroundColor: headerTheme.background }]}>
        <View style={styles.headerInner}>
          <ProductsHeader theme={headerTheme} />
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
        data={showSkeleton ? [] : products}
        numColumns={3}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={() => {
          if (showSkeleton) return;
          if (!isOnline) {
            toast.error("You're offline", "Can't refresh. Please connect to the internet.");
            return;
          }
          refetch();
        }}
        refreshing={isRefetching && !showSkeleton}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator color={theme.primary} style={styles.footer} /> : null
        }
        ListEmptyComponent={
          showSkeleton ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <ProductsErrorState
              offline={!isOnline}
              retrying={isRefetching}
              onRetry={() => {
                if (!isOnline) {
                  toast.error("You're offline", 'Connect to the internet and try again.');
                  return;
                }
                refetch();
              }}
            />
          ) : (
            <ThemedText themeColor="textSecondary" style={styles.state}>
              {debouncedSearch
                ? category !== ALL_CATEGORY
                  ? `No products found for “${debouncedSearch}” in this category.`
                  : `No products found for “${debouncedSearch}”.`
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
    paddingTop: Spacing.two,
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
  footer: {
    marginVertical: Spacing.three,
  },
});
