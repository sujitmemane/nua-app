import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { ProductCard } from '../components/product-card';
import { useProducts } from '../queries/use-products';

export function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const { data: products, isPending, isError, error } = useProducts();

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.four, paddingBottom: BottomTabInset + Spacing.four },
        ]}
        ListHeaderComponent={
          <ThemedText type="subtitle" style={styles.title}>
            Products
          </ThemedText>
        }
        ListEmptyComponent={
          isPending ? (
            <ActivityIndicator style={styles.state} />
          ) : isError ? (
            <ThemedText themeColor="textSecondary" style={styles.state}>
              {error.message}
            </ThemedText>
          ) : (
            <ThemedText themeColor="textSecondary" style={styles.state}>
              No products yet.
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
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  title: {
    marginBottom: Spacing.two,
  },
  state: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
});
