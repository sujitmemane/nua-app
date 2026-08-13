export const ANALYTICS_EVENT_TYPES = [
  'product_viewed',
  'add_to_cart',
  'search_performed',
  'app_backgrounded',
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

/** Arbitrary payload attached to an analytics event. */
export type AnalyticsMetadata = Record<string, unknown>;

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  metadata: AnalyticsMetadata;
  createdAt: string;
}
