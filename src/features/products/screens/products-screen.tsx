import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { eventsService } from '@/features/events';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { ProductCard } from '../components/product-card';
import { useProducts } from '../queries/use-products';

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

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
  } = useProducts(debouncedSearch);

  useEffect(() => {
    if (!debouncedSearch) return;
    eventsService.searchPerformed({ query: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <ThemedText type="subtitle" style={styles.title}>
          Products
        </ThemedText>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search products" />
      </View>

      <FlatList
        data={products}
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
              {debouncedSearch ? `No products found for “${debouncedSearch}”.` : 'No products yet.'}
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
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    marginBottom: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  state: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
});
