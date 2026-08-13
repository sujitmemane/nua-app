import type { AnalyticsEvent, AnalyticsEventType } from './types';

export const EVENT_FILTERS: { type: AnalyticsEventType; label: string }[] = [
  { type: 'product_viewed', label: 'Viewed' },
  { type: 'add_to_cart', label: 'Cart' },
  { type: 'search_performed', label: 'Search' },
  { type: 'app_backgrounded', label: 'Background' },
];

export const EVENT_TYPE_LABELS: Record<AnalyticsEventType, string> = {
  product_viewed: 'Product viewed',
  add_to_cart: 'Add to cart',
  search_performed: 'Search',
  app_backgrounded: 'App backgrounded',
};

export function getEventSummary(event: AnalyticsEvent): string {
  const metadata = event.metadata;

  switch (event.type) {
    case 'product_viewed':
      return String(metadata.title ?? `Product ${metadata.productId ?? ''}`).trim();
    case 'add_to_cart': {
      const title = String(metadata.title ?? `Product ${metadata.productId ?? ''}`);
      return metadata.quantity != null ? `${title} · qty ${metadata.quantity}` : title;
    }
    case 'search_performed':
      return metadata.query ? `“${metadata.query}”` : 'Search performed';
    case 'app_backgrounded':
      return 'Sent to background';
    default:
      return '';
  }
}
