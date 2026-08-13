import { apiClient, hasApiUrl } from '@/services';
import { delay } from '@/utils';

import type { Event } from '../types';

const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Product Launch',
    description: 'Unveiling the new Aurora lineup with live demos.',
    startsAt: '2026-09-12T18:00:00Z',
    location: 'San Francisco, CA',
  },
  {
    id: 'e2',
    title: 'Community Meetup',
    description: 'Casual evening to connect with fellow makers.',
    startsAt: '2026-09-20T23:30:00Z',
    location: 'Austin, TX',
  },
  {
    id: 'e3',
    title: 'Design Workshop',
    description: 'Hands-on session on building delightful mobile UIs.',
    startsAt: '2026-10-03T16:00:00Z',
    location: 'Remote',
  },
];

/**
 * Data access for the events feature. Uses axios against the configured
 * backend, and falls back to mock data when no `EXPO_PUBLIC_API_URL` is set.
 */
export const eventsService = {
  async getEvents(): Promise<Event[]> {
    if (!hasApiUrl) {
      await delay(600);
      return MOCK_EVENTS;
    }
    const { data } = await apiClient.get<Event[]>('/events');
    return data;
  },

  async getEventById(id: string): Promise<Event | undefined> {
    if (!hasApiUrl) {
      await delay(300);
      return MOCK_EVENTS.find((event) => event.id === id);
    }
    const { data } = await apiClient.get<Event>(`/events/${id}`);
    return data;
  },
};
