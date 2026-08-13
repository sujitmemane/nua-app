import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

function applyScheme(preference: ThemePreference) {
  Appearance.setColorScheme(preference);
}

const systemPreference: ThemePreference = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: systemPreference,

      setPreference: (preference) => {
        applyScheme(preference);
        set({ preference });
      },

      toggle: () => {
        get().setPreference(get().preference === 'dark' ? 'light' : 'dark');
      },
    }),
    {
      name: 'nua-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preference: state.preference }),
      onRehydrateStorage: () => (state) => {
        if (state?.preference) applyScheme(state.preference);
      },
    }
  )
);
