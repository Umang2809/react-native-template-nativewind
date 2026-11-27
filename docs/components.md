# Components (UI kit)

Reusable primitives live in `src/components/ui/` and are exported from one barrel:

```ts
import { AppText, Button, Card, Loader, TextField } from '../components/ui';
```

They're styled with NativeWind and theme tokens, so they follow light/dark mode with no extra work. Each one accepts a `className` that's merged last with [`cn()`](./helpers.md#class-names-cnts), so a caller can override any class:

```tsx
<Button label="Save" onPress={onSave} className="mt-6 w-full" />
```

## `AppText`

Text with a type-scale variant and a default theme color.

| Variant | Classes |
| --- | --- |
| `header` · `title1` · `title2` · `title3` · `headline` | matching `text-*` size + `text-text` |
| `body` (default) | `text-body1 text-text` |
| `subhead` | `text-subhead text-text` |
| `secondary` | `text-body2 text-muted` |
| `footnote` · `caption` | `text-footnote` / `text-caption1` + `text-muted` |
| `overline` | `text-overline uppercase text-muted` |
| `error` | `text-footnote text-error` |

```tsx
<AppText variant="title1">Welcome back</AppText>
<AppText variant="secondary" className="mt-2 text-center">Sign in to continue</AppText>
```

Accepts every `TextProps` (`numberOfLines`, `maxFontSizeMultiplier` ...).

## `Button`

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` | required |
| `onPress` | `() => void` | required |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'danger' \| 'ghost'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` (36 / 48 / 56 dp) | `'md'` |
| `loading` | `boolean`: shows a spinner and disables the button | `false` |
| `disabled` | `boolean` | `false` |
| `startIcon`, `endIcon` | `ReactNode` | |
| `className` | container classes | |
| `labelClassName` | label classes | |

```tsx
<Button label="Sign in" onPress={handleSubmit(onSubmit)} loading={isPending} />
<Button label="Log out" variant="outline" labelClassName="text-error" onPress={onLogout} />
```

## `TextField`

A text input wired to [react-hook-form](https://react-hook-form.com/) through a built-in `Controller`. It renders the label (with `*` when required), the input, the error message, and a primary/error border on focus/error.

| Prop | Description |
| --- | --- |
| `control`, `name` | From `useForm()` |
| `label`, `isRequired` | Label above the input |
| `isPassword` | Hides the text and adds a Show/Hide toggle |
| `isLast` | Sets `returnKeyType="done"` |
| `startIcon`, `endIcon` | Icons inside the box (`endIcon` is replaced by the toggle when `isPassword`) |
| `className` | Wrapper classes (margins) |
| `inputClassName` | Input box classes |
| …`TextInputProps` | `placeholder`, `keyboardType`, `autoComplete`, `onSubmitEditing` ... |

```tsx
const { control, handleSubmit } = useForm<LoginForm>({
  resolver: yupResolver(loginSchema),
  mode: 'onTouched',
  defaultValues: { email: '', password: '' },
});

<TextField control={control} name="email" label={AppString.email} keyboardType="email-address" isRequired />
<TextField control={control} name="password" label={AppString.password} isPassword isLast />
```

Form types go in `src/redux/types.d.ts`, schemas in `utils/schema.ts` (typed as `yup.ObjectSchema<LoginForm>`), and messages in `constants/AppString.ts`.

## `Card`

A surface with `rounded-2xl border border-border bg-card p-4`. Pass `onPress` to make it pressable (adds `active:opacity-80` and `accessibilityRole="button"`).

```tsx
<Card onPress={() => openTodo(item.id)} className="flex-row items-center gap-3">
  <AppText variant="headline">{item.title}</AppText>
</Card>
```

## `Loader`

| Prop | Description |
| --- | --- |
| `isLoading` | Renders nothing when `false` |
| `variant` | `'overlay'` (default) covers the parent with `bg-background/60` and blocks touches; `'inline'` is a padded centered spinner |

```tsx
<Loader isLoading={isPending} />                                   // last child of a screen
<Loader variant="inline" isLoading={isFetchingNextPage} />         // FlatList footer
```

## Snackbars

`SnackbarHost` is mounted once in `App.tsx`. Show messages from anywhere:

```ts
import { showSnackbar, showErrorSnackbar, getErrorMessage } from '../helper/common-functions';

showSnackbar('Saved');                          // success; optional 2nd argument is a detail line
showErrorSnackbar(getErrorMessage(error));      // error; no argument shows the generic message
```

One message shows at a time (the newest replaces the previous one) for 3 seconds, or until tapped. It sits above the bottom safe area and animates in and out with Reanimated. The store is in `src/helper/snackbar.ts` (`pushSnackbar(title, { message, type, duration })` for custom durations).

## Adding a component

Follow `Button.tsx`:

1. Typed `interface Props`, with `className?: string`.
2. Variants as a typed class map (`const sizes = { sm: '...', md: '...' } as const`), never built class names (`` `h-${size}` ``).
3. Merge with `cn(base, map[variant], condition && '...', className)`.
4. Raw colors (spinner, icon, placeholder) from `useTheme().theme`.
5. Accessibility props (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`).
6. Add it to `src/components/ui/index.ts` if it's a general primitive; feature components (`TodoCard`) live in `src/components/` and are wrapped in `React.memo` when used in lists.
