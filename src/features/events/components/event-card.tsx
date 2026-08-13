import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatEventDate } from '@/utils';

import { EVENT_TYPE_LABELS, getEventSummary } from '../constants';
import type { AnalyticsEvent } from '../types';

interface EventCardProps {
  event: AnalyticsEvent;
}

function metadataEntries(metadata: AnalyticsEvent['metadata']) {
  return Object.entries(metadata).filter(([, value]) => value != null && value !== '');
}

export function EventCard({ event }: EventCardProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const summary = getEventSummary(event);
  const details = metadataEntries(event.metadata);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.top}>
        <View style={styles.heading}>
          <ThemedText type="bodyMedium">{EVENT_TYPE_LABELS[event.type]}</ThemedText>
          {summary ? (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={expanded ? 0 : 1}>
              {summary}
            </ThemedText>
          ) : null}
          <ThemedText type="caption" themeColor="textMuted">
            {formatEventDate(event.createdAt)}
          </ThemedText>
        </View>

        <Pressable
          onPress={() => setExpanded((value) => !value)}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedText type="caption" themeColor="primary" style={styles.toggle}>
            {expanded ? 'Collapse' : 'Show'}
          </ThemedText>
        </Pressable>
      </View>

      {expanded ? (
        <View style={[styles.details, { borderTopColor: theme.border }]}>
          {details.length === 0 ? (
            <ThemedText type="small" themeColor="textMuted">
              No extra details
            </ThemedText>
          ) : (
            details.map(([key, value]) => (
              <View key={key} style={styles.detailRow}>
                <ThemedText type="caption" themeColor="textMuted" style={styles.detailKey}>
                  {key}
                </ThemedText>
                <ThemedText type="small" style={styles.detailValue}>
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  heading: {
    flex: 1,
    gap: 2,
  },
  toggle: {
    fontWeight: '600',
  },
  details: {
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  detailKey: {
    width: 88,
    marginTop: 2,
  },
  detailValue: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
