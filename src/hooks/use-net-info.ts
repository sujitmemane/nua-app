import {
  useNetInfo as useNetInfoState,
  type NetInfoState,
} from '@react-native-community/netinfo';


export function isNetOnline(state: Pick<NetInfoState, 'isConnected'>) {
  return state.isConnected !== false;
}

export function useNetInfo() {
  const state = useNetInfoState();

  return {
    type: state.type,
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    isOnline: isNetOnline(state),
  };
}
