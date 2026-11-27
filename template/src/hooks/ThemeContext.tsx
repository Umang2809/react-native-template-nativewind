import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, View } from 'react-native';
import { colorScheme } from 'nativewind';
import { themes, themeVars, ThemeMode, ThemeType } from '../theme';
import { StorageKeys, StoragePreferences } from '../../constants/StoragePreferences';

/** What the user picked: a fixed mode, or follow the OS. */
export type ThemePreference = ThemeMode | 'system';

interface ThemeContextProps {
  /** Colors of the active theme (for props that need a raw color value). */
  theme: ThemeType;
  /** The mode actually shown. */
  mode: ThemeMode;
  /** The user's choice, persisted in MMKV. */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Switches between light and dark (pins the choice). */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Built once: switching themes only swaps which object is applied.
const cssVars: Record<ThemeMode, ReturnType<typeof themeVars>> = {
  light: themeVars(themes.light),
  dark: themeVars(themes.dark),
};

const readSystemMode = (): ThemeMode => (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

const readStoredPreference = (): ThemePreference => {
  const stored = StoragePreferences.getString(StorageKeys.THEME_MODE);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemMode, setSystemMode] = useState<ThemeMode>(readSystemMode);
  // MMKV is synchronous, so the saved choice applies on the first frame.
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  const mode: ThemeMode = preference === 'system' ? systemMode : preference;

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme: scheme }) => {
      if (scheme === 'light' || scheme === 'dark') {
        setSystemMode(scheme);
      }
    });
    return () => listener.remove();
  }, []);

  // Keeps NativeWind's `dark:` variants (and native UI like the keyboard) in
  // step. colorScheme.set('light' | 'dark') pins the app's Appearance, which
  // stops system changes from arriving, so only pin for a fixed preference.
  useEffect(() => {
    colorScheme.set(preference);
  }, [preference]);

  const value = useMemo<ThemeContextProps>(() => {
    const setPreference = (next: ThemePreference) => {
      if (next === 'system') {
        StoragePreferences.remove(StorageKeys.THEME_MODE);
      } else {
        StoragePreferences.setString(StorageKeys.THEME_MODE, next);
      }
      setPreferenceState(next);
    };

    return {
      theme: themes[mode],
      mode,
      preference,
      setPreference,
      toggleTheme: () => setPreference(mode === 'light' ? 'dark' : 'light'),
    };
  }, [mode, preference]);

  return (
    <ThemeContext.Provider value={value}>
      {/* Publishes --color-* variables so `bg-background`, `text-text` etc. follow the theme. */}
      <View style={cssVars[mode]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
