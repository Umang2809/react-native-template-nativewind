import { vars } from 'nativewind';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export type ThemeType = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';

export const themes: Record<ThemeMode, ThemeType> = {
  light: lightTheme,
  dark: darkTheme,
};

/** `onPrimary` -> `--color-on-primary` */
export const tokenToCssVar = (token: string) =>
  `--color-${token.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;

/** `#4045EF` -> `64 69 239` (the format Tailwind's `<alpha-value>` needs). */
export const hexToRgbChannels = (hex: string) => {
  const value = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Theme colors must be 6-digit hex, got "${hex}"`);
  }
  return [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16)).join(' ');
};

/** NativeWind CSS variables for every token of a theme. */
export const themeVars = (theme: ThemeType) =>
  vars(
    Object.fromEntries(
      Object.entries(theme).map(([token, hex]) => [tokenToCssVar(token), hexToRgbChannels(hex)]),
    ),
  );
