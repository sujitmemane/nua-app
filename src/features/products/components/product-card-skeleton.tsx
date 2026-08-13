import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/skeleton';
import { Spacing } from '@/constants/theme';

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton style={styles.image} />
      <Skeleton style={styles.price} />
      <Skeleton style={styles.title} />
      <Skeleton style={styles.meta} />
    </View>
  );
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  const rows = [];

  for (let index = 0; index < count; index += 3) {
    rows.push(
      <View key={index} style={styles.row}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
    );
  }

  return <View style={styles.grid}>{rows}</View>;
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  card: {
    flex: 1,
    gap: 6,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  price: {
    height: 18,
    width: '62%',
    borderRadius: 4,
    marginTop: Spacing.two,
  },
  title: {
    height: 12,
    width: '92%',
    borderRadius: 4,
  },
  meta: {
    height: 12,
    width: '44%',
    borderRadius: 4,
  },
});
