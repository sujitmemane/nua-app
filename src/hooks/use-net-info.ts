import { useNetInfo as useNetInfoState } from '@react-native-community/netinfo';


export function useNetInfo() {
  const state = useNetInfoState();

  return {
    type: state.type,
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    isOnline: state.isConnected !== false && state.isInternetReachable !== false,
  };
}
