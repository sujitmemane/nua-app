import { create } from 'zustand';

import type { AnalyticsEvent, AnalyticsEventType, AnalyticsMetadata } from '../types';

function createEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface EventsState {
  events: AnalyticsEvent[];
  track: (type: AnalyticsEventType, metadata?: AnalyticsMetadata) => void;
  clear: () => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],

  track: (type, metadata = {}) => {
    const event: AnalyticsEvent = {
      id: createEventId(),
      type,
      metadata,
      createdAt: new Date().toISOString(),
    };
    set({ events: [event, ...get().events] });
  },

  clear: () => set({ events: [] }),
}));
