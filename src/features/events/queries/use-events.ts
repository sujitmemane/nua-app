import { useQuery } from '@tanstack/react-query';

import { eventsService } from '../services/events-service';

export const eventKeys = {
  all: ['events'] as const,
  detail: (id: string) => ['events', id] as const,
};

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: eventsService.getEvents,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsService.getEventById(id),
    enabled: Boolean(id),
  });
}
