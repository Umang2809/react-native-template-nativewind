# Theming

The template ships a light/dark theme that drives both NativeWind classes (`bg-background`, `text-primary` …) and the `useTheme()` hook from one palette.

## Files

| File | Purpose |
| --- | --- |
| `src/theme/lightTheme.ts` | Light palette (6-digit hex) |
| `src/theme/darkTheme.ts` | Dark palette, typed against the light one |
| `src/theme/index.ts` | `themes`, `ThemeType`, `ThemeMode`, and the CSS-variable helpers |
| `src/hooks/ThemeContext.tsx` | `ThemeProvider` and `useTheme()` |
| `tailwind.config.js` | `THEME_COLOR_TOKENS`: maps each token to a Tailwind color class |

## Theme tokens

| Token | Class | Light | Dark |
| --- | --- | --- | --- |
| `background` | `bg-background` | `#FFFFFF` | `#000000` |
| `card` | `bg-card` | `#F4F4F5` | `#18181B` |
| `text` | `text-text` | `#000000` | `#FFFFFF` |
| `muted` | `text-muted` | `#71717A` | `#A1A1AA` |
| `border` | `border-border` | `#E4E4E7` | `#27272A` |
| `primary` | `bg-primary` | `#4045EF` | `#4045EF` |
| `onPrimary` | `text-on-primary` | `#FFFFFF` | `#FFFFFF` |
| `secondary` | `bg-secondary` | `#F4F4F4` | `#1A1A1A` |
| `error` | `text-error` | `#DC2626` | `#F87171` |

Every token works with any color utility (`bg-`, `text-`, `border-`, `divide-`…) and opacity modifiers (`bg-primary/10`).

## Using the theme

With classes (preferred):

```tsx
<View className="rounded-2xl border border-border bg-card p-5">
  <Text className="text-headline text-text">Title</Text>
  <Text className="text-body2 text-muted">Subtitle</Text>
</View>
```

With the hook, for props that need a color value:

```tsx
import { useTheme } from '../hooks/ThemeContext';

const { theme, mode, preference, setPreference, toggleTheme } = useTheme();
<ActivityIndicator color={theme.primary} />
```

| Value | Type | Description |
| --- | --- | --- |
| `theme` | `ThemeType` | The active palette as hex strings |
| `mode` | `'light' \| 'dark'` | The active mode |
| `preference` | `'light' \| 'dark' \| 'system'` | The user's choice (persisted) |
| `setPreference` | `(p) => void` | Sets and saves the choice; `'system'` follows the OS again |
| `toggleTheme` | `() => void` | Pins the opposite of the current mode |

`useTheme()` throws if it's called outside `ThemeProvider`.

## How it works

1. `ThemeProvider` picks the mode from the system (`Appearance`) and listens for changes.
2. It wraps the app in a `View` whose style is `vars({...})`: every token becomes a CSS variable with RGB channels, e.g. `--color-on-primary: 255 255 255`. Both sets are built once at startup.
3. `tailwind.config.js` maps each class to its variable: `on-primary: 'rgb(var(--color-on-primary) / <alpha-value>)'`.
4. It also keeps NativeWind's color scheme in step, so `dark:` variants follow the app's mode. It calls `colorScheme.set('system')` while the preference is `system`, and `colorScheme.set('light' | 'dark')` for a fixed preference. `set(mode)` pins the app's native appearance (status bar, keyboard, alerts), and while pinned the system's own changes no longer arrive.

Switching mode swaps the variable set, and every `className` using a token re-colors.

## How the mode is chosen

- The preference is read synchronously from MMKV (`StorageKeys.THEME_MODE`) on startup, so the saved choice applies on the first frame.
- With `system` (the default, and what an empty key means) the mode follows the OS live.
- `setPreference('light' | 'dark')` and `toggleTheme()` save a fixed choice; `setPreference('system')` deletes the key and follows the OS again.
- The status bar follows the mode: `Main.tsx` renders `<StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />`.

## Changing colors

Edit the hex values in `lightTheme.ts` and `darkTheme.ts`. Colors must be **6-digit hex** (`#RRGGBB`), because they're converted to RGB channels. The provider throws on other formats.

## Adding a token

1. Add it to `lightTheme.ts`, e.g. `success: '#16A34A'`.
2. Add it to `darkTheme.ts` (TypeScript errors until you do, because it's typed as `ThemeType`).
3. Add `'success'` to `THEME_COLOR_TOKENS` in `tailwind.config.js`.
4. Restart Metro with `--reset-cache`. Now `bg-success`, `text-success` etc. exist.

`__tests__/theme.test.ts` fails if the three lists get out of sync. camelCase tokens become kebab-case classes (`onPrimary` → `text-on-primary`).

## Navigation theme

`Main.tsx` builds React Navigation's theme from yours: it starts from `DarkTheme` or `DefaultTheme` to match the mode, then sets `primary`, `background`, `card`, `text`, `border` and `notification` (`error`) from your palette. Native screens and transitions use your background, with no white flash in dark mode. A token you add to the palette doesn't reach React Navigation unless you map it there too.

## Colors that don't change with the theme

The old `src/helper/colors.ts` palette was removed. For colors that must stay the same in both modes (brand logos, status badges), add a token with the same hex in both themes, or use Tailwind's built-in palette (`bg-red-500`). Arbitrary color values (`bg-[#3C5A99]`) are flagged by ESLint.
