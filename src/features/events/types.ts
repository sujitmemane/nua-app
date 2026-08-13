export interface Event {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 date-time string. */
  startsAt: string;
  location: string;
}
