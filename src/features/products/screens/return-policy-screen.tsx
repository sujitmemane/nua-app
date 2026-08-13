import { Stack } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Skeleton } from '@/components/skeleton';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { RETURN_POLICY_URL } from '../constants';

export function ReturnPolicyScreen() {
  const [isLoading, setIsLoading] = useState(true);

  function handleLoaded() {
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Return Policy' }} />

      {Platform.OS === 'web' ? (
        <iframe
          src={RETURN_POLICY_URL}
          style={styles.iframe}
          title="Return Policy"
          onLoad={handleLoaded}
        />
      ) : (
        <WebView
          source={{ uri: RETURN_POLICY_URL }}
          style={styles.webview}
          onLoadEnd={handleLoaded}
          onError={handleLoaded}
        />
      )}

      {isLoading ? <ReturnPolicySkeleton /> : null}
    </View>
  );
}

function ReturnPolicySkeleton() {
  return (
    <ThemedView style={styles.skeleton}>
      <Skeleton style={styles.hero} />
      <Skeleton style={styles.title} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.lineShort} />
      <Skeleton style={styles.block} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.lineShort} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  iframe: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  skeleton: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  hero: {
    width: '100%',
    height: 180,
    borderRadius: Spacing.three,
  },
  title: {
    width: '60%',
    height: 28,
  },
  line: {
    width: '100%',
    height: 14,
  },
  lineShort: {
    width: '70%',
    height: 14,
  },
  block: {
    width: '100%',
    height: 120,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
});
