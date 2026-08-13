import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { EventCard } from '../components/event-card';
import { EventFilterPills } from '../components/event-filter-pills';
import { EVENT_TYPE_LABELS } from '../constants';
import { useEventsStore } from '../store/events-store';
import type { AnalyticsEventType } from '../types';

export function EventsScreen() {
  const insets = useSafeAreaInsets();
  const events = useEventsStore((state) => state.events);
  const clear = useEventsStore((state) => state.clear);
  const [filter, setFilter] = useState<AnalyticsEventType | null>(null);

  const visibleEvents = useMemo(
    () => (filter ? events.filter((event) => event.type === filter) : events),
    [events, filter]
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <ThemedText type="subtitle">Events</ThemedText>
        {events.length > 0 ? (
          <Pressable onPress={clear} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="linkPrimary">Clear</ThemedText>
          </Pressable>
        ) : null}
      </View>

      <EventFilterPills selected={filter} onSelect={setFilter} />

      <FlatList
        data={visibleEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BottomTabInset + Spacing.four },
        ]}
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            {filter
              ? `No ${EVENT_TYPE_LABELS[filter].toLowerCase()} events yet.`
              : 'No tracked events yet. Open a product, search, add to cart, or background the app.'}
          </ThemedText>
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
    paddingBottom: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  pressed: {
    opacity: 0.7,
  },
});
