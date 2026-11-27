# Helpers & Utilities

Everything in `src/helper/`. Typography and font names used to live here too; they're now in `tailwind.config.js` (see [Styling → Typography](./styling.md#typography)).

## Navigation service (`navigation-service.ts`)

`navigate`, `goBack`, `push`, `pop`, `popToTop`, `navigateAndReset`, `navigateAndSimpleReset`, for navigating outside components. See [Navigation](./navigation.md#navigation-service-outside-components).

## Class names (`cn.ts`)

`cn(...classes)` joins class names with `clsx` and resolves Tailwind conflicts with `tailwind-merge` (the last one wins). Use it whenever a component merges its own classes with a `className` prop:

```tsx
<Pressable className={cn('h-12 px-5 bg-primary', disabled && 'opacity-50', className)} />
```

`cn('px-5', 'px-2')` gives `px-2`. The custom type scale (`text-title1`, `text-body2` ...) is registered in `TYPE_SCALE`, so `cn('text-body2 text-muted')` keeps both classes. When you add a size to `theme.extend.fontSize`, add it to `TYPE_SCALE` too. The template uses `tailwind-merge` 2.x, the line that understands Tailwind v3.

## Feedback (`common-functions.ts`, `snackbar.ts`)

| Export | Description |
| --- | --- |
| `showSnackbar(title, message?)` | Success message at the bottom of the screen |
| `showErrorSnackbar(message?)` | Error message; without a message it shows `AppString.somethingWentWrong` |
| `getErrorMessage(error)` | Best readable message from a backend error body, `AxiosError`, `Error` or string |

They work from anywhere (screens, mutation callbacks, interceptors). `<SnackbarHost />` in `App.tsx` renders them. See [Components → Snackbars](./components.md#snackbars).

## Formatting & payloads (`common-functions.ts`)

| Export | Example |
| --- | --- |
| `formatWithComma(value, locale?)` | `1234567` → `"1,234,567"` |
| `formatPrice(value, locale?)` | `1234.5` → `"1,234.50"` |
| `cleanPayload(object)` | Drops `null`, `undefined` and `''` values before a request |

## Dates (`common-functions.ts`)

`toFormattedDate(isoString, formatStr)` parses an ISO string with date-fns and formats it. Returns `null` for empty or invalid input.

```ts
toFormattedDate('2026-11-20T10:30:00Z', 'dd MMM yyyy'); // "20 Nov 2026"
toFormattedDate('not a date', 'dd MMM yyyy');           // null
```

Format tokens: see the [date-fns `format` docs](https://date-fns.org/docs/format).

## Platform & device (`utility-functions.ts`)

| Export | Description |
| --- | --- |
| `isIOS`, `isAndroid` | Platform flags |
| `hideKeyboard()` | `Keyboard.dismiss()` |
| `showAlert(title, message, settingsText?, rejectText?, onSettingsPress)` | Non-cancelable two-button alert, intended for "permission denied, open Settings?" prompts |

```ts
import { Linking } from 'react-native';
import { showAlert } from '../helper/utility-functions';

showAlert(
  'Camera access needed',
  'Enable camera access in Settings to scan documents.',
  'Open Settings',
  'Not now',
  () => Linking.openSettings(),
);
```

## Removed helpers

`colors.ts` (static palette), `matrics.ts` (`horizontalScale`, `verticalScale`, `moderateScale`) and the `responsive*` / `deviceWidth` / `deviceHeight` exports were removed. Use theme tokens for colors, and fixed dp sizes with flexible layouts for sizing (see [Responsive UI](./responsive.md)). For the window size inside a component, use `useWindowDimensions()`.

## Fonts

`tailwind.config.js` defines `font-sans-regular`, `font-sans-medium`, `font-sans-semibold` and `font-sans-bold`, mapped to General Sans. The template doesn't bundle the font files. To use custom fonts:

1. Put the `.ttf`/`.otf` files in `src/assets/fonts/`.
2. Create `react-native.config.js` at the project root:

   ```js
   module.exports = {
     assets: ['./src/assets/fonts/'],
   };
   ```

3. Link them:

   ```bash
   npx react-native-asset
   ```

4. Set the names in `theme.extend.fontFamily` in `tailwind.config.js` to each font's PostScript name, then rebuild both apps.
5. Optional: make one the default by adding it to the variants in `src/components/ui/AppText.tsx`, e.g. `'text-body1 text-text font-sans-regular'`.
