import axios from 'axios';

/**
 * Shared axios instance for the app. Feature services (e.g. products, events)
 * should use this instead of importing axios directly, so that base URL,
 * headers, and interceptors live in one place.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

/** Whether a real backend is configured. Services fall back to mock data when false. */
export const hasApiUrl = API_URL.length > 0;

// eslint-disable-next-line import/no-named-as-default-member -- axios.create is the documented factory
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});
