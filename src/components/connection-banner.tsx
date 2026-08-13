import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useNetInfo } from '@/hooks/use-net-info';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

type BannerState = 'offline' | 'back' | null;

export function ConnectionBanner() {
  const theme = useTheme();
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

  if (!banner) return null;

  const offline = banner === 'offline';

  return (
    <View style={[styles.bar, { backgroundColor: offline ? theme.error : theme.success }]}>
      <ThemedText type="small" style={styles.title}>
        {offline ? 'It seems you are offline' : 'It seems we are back again'}
      </ThemedText>
      {offline ? (
        <ThemedText type="caption" style={styles.subtitle}>
          Turn on internet. You may see stale prices.
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: 10,
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
