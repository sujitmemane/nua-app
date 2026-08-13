import { Image } from 'expo-image';
import { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface ProductImageCarouselProps {
  images: string[];
  accessibilityLabel: string;
  pageWidth: number;
}

export function ProductImageCarousel({
  images,
  accessibilityLabel,
  pageWidth,
}: ProductImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const uris = images.length > 0 ? images : [];

  if (uris.length === 0) {
    return null;
  }

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setIndex(nextIndex);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        style={{ width: pageWidth }}>
        {uris.map((uri) => (
          <Image
            key={uri}
            source={{ uri }}
            style={[styles.image, { width: pageWidth }]}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            accessibilityLabel={accessibilityLabel}
          />
        ))}
      </ScrollView>

      {uris.length > 1 ? (
        <View style={styles.dots}>
          {uris.map((uri, i) => (
            <ThemedView
              key={uri}
              type={i === index ? 'backgroundSelected' : 'backgroundElement'}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  image: {
    aspectRatio: 1.2,
    borderRadius: Spacing.three,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 16,
  },
});
