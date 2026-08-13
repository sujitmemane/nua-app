import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useNetInfo } from '@/hooks/use-net-info';

import { ThemedText } from './themed-text';

type BannerState = 'offline' | 'back' | null;

interface ConnectionBannerProps {
  headerColor: string;
}

export function ConnectionBanner({ headerColor }: ConnectionBannerProps) {
  const insets = useSafeAreaInsets();
  const { isOnline, isConnected } = useNetInfo();
  const [banner, setBanner] = useState<BannerState>(null);
  const wasOffline = useRef(false);
  const ready = useRef(false);

  useEffect(() => {
    if (isConnected == null) return;

    if (!ready.current) {
      ready.current = true;
      if (!isOnline) {
        wasOffline.current = true;
        setBanner('offline');
      }
      return;
    }

    if (!isOnline) {
      wasOffline.current = true;
      setBanner('offline');
      return;
    }

    if (wasOffline.current) {
      wasOffline.current = false;
      setBanner('back');
      const timeout = setTimeout(() => setBanner(null), 2800);
      return () => clearTimeout(timeout);
    }
  }, [isConnected, isOnline]);

  const offline = banner === 'offline';

  return (
    <View style={[styles.safe, { paddingTop: insets.top, backgroundColor: headerColor }]}>
      {banner ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: offline ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.1)' },
          ]}
        />
      ) : null}
      {banner ? (
        <View style={styles.bar}>
          <ThemedText type="small" style={styles.title}>
            {offline ? 'It seems you are offline' : 'It seems we are back again'}
          </ThemedText>
          {offline ? (
            <ThemedText type="caption" style={styles.subtitle}>
              Turn on internet. You may see stale prices.
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    width: '100%',
  },
  bar: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
});
