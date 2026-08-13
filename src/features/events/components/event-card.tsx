import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatEventDate } from '@/utils';

import type { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="default">{event.title}</ThemedText>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {formatEventDate(event.startsAt)} · {event.location}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {event.description}
      </ThemedText>
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
