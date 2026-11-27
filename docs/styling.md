# Styling with NativeWind

The template styles everything with [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native). Write `className` instead of `StyleSheet.create`.

```tsx
<View className="flex-1 items-center justify-center bg-background p-6">
  <Text className="text-title1 text-text">Hello</Text>
</View>
```

## Versions

| Package | Version | Note |
| --- | --- | --- |
| `nativewind` | `^4.2.7` | Stable line. v5 is still a release candidate. |
| `tailwindcss` | `^3.4` | **Must stay on v3.** NativeWind 4 doesn't support Tailwind v4, and a plain `npm i tailwindcss` installs v4. |
| `react-native-reanimated` | `~4.5.5` | Peer of NativeWind (used for transitions/animations) |

## Setup files

| File | What it does |
| --- | --- |
| `babel.config.js` | Adds the `nativewind/babel` preset. It also registers the Reanimated/Worklets plugin, so don't add `react-native-worklets/plugin` again. |
| `metro.config.js` | `withNativeWind(config, { input: './global.css', inlineRem: 16 })` |
| `global.css` | The three `@tailwind` directives, imported once at the top of `App.tsx` |
| `tailwind.config.js` | Content paths, `nativewind/preset`, theme colors, fonts and the type scale |
| `nativewind-env.d.ts` | Adds the `className` prop to React Native types |

`inlineRem: 16` makes `1rem = 16`, so the Tailwind spacing scale matches web and design tools (`p-4` = 16, `text-base` = 16). NativeWind's own default is 14.

> After changing `tailwind.config.js`, `babel.config.js` or `metro.config.js`, restart Metro with `npm start -- --reset-cache`.

## Theme colors

Theme colors are classes that follow light/dark mode automatically:

| Class suffix | Token | Typical use |
| --- | --- | --- |
| `background` | `background` | Screen background: `bg-background` |
| `card` | `card` | Cards, inputs: `bg-card` |
| `text` | `text` | Main text: `text-text` |
| `muted` | `muted` | Secondary text, placeholders: `text-muted` |
| `border` | `border` | Dividers, outlines: `border-border` |
| `primary` | `primary` | Brand color: `bg-primary`, `text-primary` |
| `on-primary` | `onPrimary` | Text/icons on primary: `text-on-primary` |
| `secondary` | `secondary` | Secondary surfaces |
| `error` | `error` | Errors, destructive actions: `text-error` |

Opacity modifiers work: `bg-primary/10`, `border-text/20`.

How it works: `ThemeProvider` turns each token in `src/theme/lightTheme.ts` / `darkTheme.ts` into a CSS variable holding RGB channels (`--color-primary: 64 69 239`) using NativeWind's `vars()`, and `tailwind.config.js` maps `bg-primary` to `rgb(var(--color-primary) / <alpha-value>)`. One palette drives both `className` and `useTheme()`. See [Theming](./theming.md) for adding colors.

`dark:` variants also work (`bg-white dark:bg-black`): the provider keeps NativeWind's color scheme in step with the app's mode. Prefer theme tokens, though, since they switch without writing every color twice.

### When you still need a color value

Some props take a color, not a class: `placeholderTextColor`, `ActivityIndicator color`, icon `color`. Read it from the hook:

```tsx
const { theme } = useTheme();
<TextInput placeholderTextColor={theme.muted} className="text-text" />
```

## Typography

The type scale lives in `tailwind.config.js` (`theme.extend.fontSize`). Each class sets size, line height and weight together:

| Class | Size / line height | Weight |
| --- | --- | --- |
| `text-header` | 34 / 41 | 700 |
| `text-title1` | 28 / 34 | 700 |
| `text-title2` | 22 / 28 | 700 |
| `text-title3` | 20 / 25 | 600 |
| `text-headline` | 17 / 22 | 600 |
| `text-body1` | 17 / 22 | 400 |
| `text-subhead` | 15 / 20 | 400 |
| `text-body2` | 14 / 20 | 400 |
| `text-footnote` | 13 / 18 | 400 |
| `text-caption1` | 12 / 16 | 400 |
| `text-caption2` | 11 / 13 | 400 |
| `text-overline` | 10 / 12 | 500 |

Combine freely: `text-body2 font-semibold text-muted uppercase`.

### Custom fonts

`tailwind.config.js` defines `font-sans-regular`, `font-sans-medium`, `font-sans-semibold` and `font-sans-bold` (General Sans). The font files are **not** bundled. Add and link them first (see [Helpers → Fonts](./helpers.md#fonts)), otherwise iOS reports an unknown font. On Android, `font-bold` doesn't select the bold file of a custom font, so use the family for each weight: `font-sans-bold`, not `font-sans-regular font-bold`.

## Responsive layouts

React Native sizes are already density-independent (dp). The template doesn't scale sizes by screen width. It adapts the **layout** instead, the same way vega-app does. See [Responsive UI](./responsive.md).

## Interaction states

`Pressable` supports state variants:

```tsx
<Pressable className="rounded-xl bg-primary p-4 active:opacity-80" />
<TextInput className="border border-border focus:border-primary" />
```

## Rules to remember

1. **Write complete class names.** Tailwind finds classes by scanning source text, so `` `bg-${color}` `` produces nothing. Use a map or a conditional with full names:

   ```tsx
   const tone = { info: 'bg-primary', danger: 'bg-error' };
   <View className={tone[kind]} />
   <View className={active ? 'bg-primary' : 'bg-card'} />
   ```

2. **Files must be inside the `content` paths** in `tailwind.config.js` (`App.tsx`, `Main.tsx`, `src/**`). Classes in other folders aren't generated.
3. **Third-party components** that don't accept `className` need a one-time `cssInterop` registration:

   ```ts
   import { cssInterop } from 'nativewind';
   import LinearGradient from 'react-native-linear-gradient';

   cssInterop(LinearGradient, { className: 'style' });
   ```

   `SafeAreaView` from `react-native-safe-area-context` already works out of the box.
4. **`style` and `className` can be combined.** `style` wins for the same property. Use it for computed values (animated values, measured sizes).
5. **Arbitrary values** work for one-offs: `h-[340px]`, `max-w-[560px]`, `bg-[#4045EF]`. If you repeat one, add it to the config instead.

## Merging classes: `cn()`

Components that accept a `className` merge it with `cn()` from `src/helper/cn.ts` (clsx + tailwind-merge), so conflicts resolve to the last class:

```tsx
<View className={cn('rounded-xl bg-card p-4', selected && 'border border-primary', className)} />
```

See [Helpers → Class names](./helpers.md#class-names-cnts). Adding a size to the type scale? Add it to `TYPE_SCALE` in `cn.ts` too.

## Components

Build screens from the UI kit in `src/components/ui` (`AppText`, `Button`, `TextField`, `Card`, `Loader`) instead of styling raw `Text`/`Pressable` each time. See [Components](./components.md).

## The `Screen` component

`src/components/Screen.tsx` is the standard screen wrapper: safe area, theme background, horizontal padding, and a centered content column on tablets.

```tsx
<Screen className="justify-center">…</Screen>          // all safe-area edges
<Screen edges={['top', 'left', 'right']}>…</Screen>    // a tab bar owns the bottom
<Screen fullWidth>…</Screen>                           // grids/lists that should use the full tablet width
```
