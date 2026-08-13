import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { isNetOnline } from '@/hooks/use-net-info';
import { MOCK_OFFLINE } from '@/lib/offline-mock';

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(isNetOnline(state));
  })
);

if (MOCK_OFFLINE) {
  onlineManager.setOnline(false);
}

const MAX_RETRIES = 5;

function shouldRetryQuery(failureCount: number, error: Error) {
  if (failureCount >= MAX_RETRIES) return false;
  if (!isAxiosError(error)) return true;

  const status = error.response?.status;
  if (status != null && status >= 400 && status < 500) return false;

  return true;
}


function exponentialBackoff(attemptIndex: number) {
  return Math.min(1000 * 2 ** attemptIndex, 8000);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: shouldRetryQuery,
      retryDelay: exponentialBackoff,
      refetchOnWindowFocus: false,
    },
  },
});
