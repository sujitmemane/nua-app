import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { EVENT_FILTERS } from '../constants';
import type { AnalyticsEventType } from '../types';

interface EventFilterPillsProps {
  selected: AnalyticsEventType | null;
  onSelect: (type: AnalyticsEventType | null) => void;
}

export function EventFilterPills({ selected, onSelect }: EventFilterPillsProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {EVENT_FILTERS.map((filter) => {
        const isActive = selected === filter.type;
        return (
          <Pressable
            key={filter.type}
            onPress={() => onSelect(isActive ? null : filter.type)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: isActive ? theme.primary : theme.surface,
                borderColor: isActive ? theme.primary : theme.border,
              },
              pressed && styles.pressed,
            ]}>
            <ThemedText
              type="caption"
              style={[
                styles.label,
                { color: isActive ? theme.background : theme.textSecondary },
              ]}
              numberOfLines={1}>
              {filter.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.one,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
