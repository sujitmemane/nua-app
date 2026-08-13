import { useEventsStore } from '../store/events-store';
import type { AnalyticsEventType, AnalyticsMetadata } from '../types';

/**
 * Call these from anywhere (screens, stores, listeners) — no React hook needed.
 * Uses the Zustand store via `getState()`.
 */
function track(type: AnalyticsEventType, metadata: AnalyticsMetadata = {}) {
  useEventsStore.getState().track(type, metadata);
}

export const eventsService = {
  track,

  productViewed: (metadata: AnalyticsMetadata = {}) => {
    track('product_viewed', metadata);
  },

  addToCart: (metadata: AnalyticsMetadata = {}) => {
    track('add_to_cart', metadata);
  },

  searchPerformed: (metadata: AnalyticsMetadata = {}) => {
    track('search_performed', metadata);
  },

  appBackgrounded: (metadata: AnalyticsMetadata = {}) => {
    track('app_backgrounded', metadata);
  },
};
