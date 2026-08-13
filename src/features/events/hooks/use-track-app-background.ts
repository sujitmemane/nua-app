import { useEffect } from 'react';
import { AppState } from 'react-native';

import { eventsService } from '../services/events-service';

export function useTrackAppBackground() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        eventsService.appBackgrounded({ state: nextState });
      }
    });

    return () => subscription.remove();
  }, []);
}
