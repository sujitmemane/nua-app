import {
  useNetInfo as useNetInfoState,
  type NetInfoState,
} from '@react-native-community/netinfo';

import { MOCK_OFFLINE } from '@/lib/offline-mock';

export function isNetOnline(state: Pick<NetInfoState, 'isConnected'>) {
  if (MOCK_OFFLINE) return false;
  return state.isConnected !== false;
}

export function useNetInfo() {
  const state = useNetInfoState();

  if (MOCK_OFFLINE) {
    return {
      type: state.type,
      isConnected: false,
      isInternetReachable: false,
      isOnline: false,
    };
  }

  return {
    type: state.type,
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    isOnline: isNetOnline(state),
  };
}
