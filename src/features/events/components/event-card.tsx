import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatEventDate } from '@/utils';

import type { AnalyticsEvent } from '../types';

interface EventCardProps {
  event: AnalyticsEvent;
}

export function EventCard({ event }: EventCardProps) {
  const metadata = JSON.stringify(event.metadata, null, 2);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="default">{event.type}</ThemedText>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {formatEventDate(event.createdAt)}
      </ThemedText>
      {metadata !== '{}' ? (
        <ThemedText type="code" themeColor="textSecondary">
          {metadata}
        </ThemedText>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          No metadata
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
