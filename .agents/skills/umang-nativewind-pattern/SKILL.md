---
name: umang-nativewind-pattern
description: Umang's React Native app pattern from @umang-thakkar/base-template-nativewind - NativeWind (Tailwind) styling with light/dark theme tokens, cn() class merging, ui primitives (AppText, Button, TextField, Card, Loader, Snackbar), folder structure, API integration (service.ts + single queries.ts + usePaginatedAPI), Redux Toolkit + MMKV, typed navigation, react-hook-form + yup. Use when creating a new React Native app or screen, starting from this base template, or when the user says "/new-mobile-app", "create mobile app", "new react native project", or "umang pattern".
---

# Umang Mobile App Pattern (NativeWind)

Follow this pattern for every React Native app built on `@umang-thakkar/base-template-nativewind`, so every project has the same structure, the same styling system and the same conventions. The template already contains everything referenced here; **reuse it, don't re-create it.**

**Non-negotiables (read these first):**
1. Style with NativeWind `className`. No `StyleSheet.create`, no inline style objects, except for computed/animated values.
2. Colors come from theme tokens (`bg-background`, `text-text`, `bg-primary` ...). Never hex literals in components.
3. Text sizes come from the type scale (`text-title1`, `text-body2` ...). Never `text-[17px]` or `fontSize: 17`.
4. Every screen is wrapped in `<Screen>`.
5. Build screens from `src/components/ui` (AppText, Button, TextField, Card, Loader). Repeated UI becomes a component.
6. Components merge classes with `cn()` from `src/helper/cn.ts`, never with template strings.
7. Every API call goes: `constants/API_Routes.ts` → `src/api/service.ts` → `src/api/queries.ts` (single file) → screen.
8. All visible text comes from `constants/AppString.ts`.
9. No size-scaling helpers. Layout adapts; sizes stay in dp. (The old `matrics.ts`, `colors.ts` and `responsive*` helpers were removed from the template; don't bring them back.)

## Tech Stack

| Area | Library | Notes |
| --- | --- | --- |
| Runtime | React Native 0.84, React 19.2 | New Architecture, React Compiler-friendly |
| Language | TypeScript | strict types, no `any` in new code |
| Styling | **NativeWind 4.2 + Tailwind CSS 3.4** | Tailwind **must stay on v3** (NativeWind 4 doesn't support Tailwind 4) |
| Class merging | clsx 2 + tailwind-merge **2.x** | tailwind-merge 3 targets Tailwind 4, so stay on 2.x |
| Navigation | React Navigation 7 (native-stack, bottom-tabs when needed) | |
| State | Redux Toolkit + redux-persist | persisted via MMKV |
| Storage | react-native-mmkv 4 | synchronous (`createMMKV()`) |
| Server state | TanStack Query 5 | all hooks in `src/api/queries.ts` |
| HTTP | Axios | `AxiosClient.ts` + `AxiosActions.ts` |
| Forms | react-hook-form 7 + yup 1 + @hookform/resolvers 5 | via `TextField` |
| Animation | react-native-reanimated 4 + react-native-worklets | |
| Icons | react-native-svg | SVG components in `src/assets/svg/` |
| Dates | date-fns | |
| Lint/format | ESLint 8 (`@react-native` + `eslint-plugin-tailwindcss` 3.18.2) + Prettier | see section 16 |
| i18n (optional) | i18next + react-i18next | only for multi-language apps |

## Folder Structure

```
App.tsx                         # Providers + <SnackbarHost />; imports "./global.css" FIRST
Main.tsx                        # NavigationContainer (theme-synced) + StatusBar following mode
global.css                      # @tailwind base/components/utilities
tailwind.config.js              # Theme color tokens, fonts, type scale
nativewind-env.d.ts             # className types
babel.config.js                 # nativewind/babel preset (includes reanimated/worklets plugin)
metro.config.js                 # withNativeWind(..., { input: './global.css', inlineRem: 16 })
.eslintrc / .prettierrc.js      # Lint (incl. Tailwind rules) and formatting
jest.config.js / jest.setup.js  # Jest preset + Reanimated/Worklets mocks

constants/
├── API_Routes.ts               # Endpoint constants
├── AppString.ts                # All UI strings (or locales/*.json with i18n)
├── AppConstants.ts             # App-wide constants (API_BASE_URL ...)
└── StoragePreferences.ts       # MMKV instance, reduxStorage, StorageKeys, get/set helpers

utils/
└── schema.ts                   # Yup schemas typed against form types (loginSchema ...)

src/
├── api/
│   ├── AxiosClient.ts          # Axios instance; request interceptor adds the Bearer token
│   ├── AxiosActions.ts         # getAPI<T>, postAPI<T>, putAPI<T>, patchAPI<T>, deleteAPI<T>, uploadAPI<T>
│   ├── service.ts              # One `do*` function per endpoint
│   └── queries.ts              # SINGLE FILE: every useQuery / useMutation / paginated hook
├── assets/
│   ├── fonts/                  # Font files (linked natively)
│   ├── images/
│   └── svg/                    # Icon components (manual SVG conversion)
├── components/
│   ├── Screen.tsx              # Safe area + theme background + tablet-friendly column
│   ├── ErrorBoundary.tsx
│   ├── ui/                     # Primitives (import from 'components/ui')
│   │   ├── AppText.tsx         # variant → type scale + theme color
│   │   ├── Button.tsx          # variant (primary|secondary|outline|danger|ghost) × size (sm|md|lg)
│   │   ├── TextField.tsx       # react-hook-form Controller built in
│   │   ├── Card.tsx            # Surface; pressable when onPress is set
│   │   ├── Loader.tsx          # overlay | inline spinner
│   │   ├── SnackbarHost.tsx    # Renders showSnackbar / showErrorSnackbar (mounted in App.tsx)
│   │   └── index.ts            # Barrel export
│   └── *.tsx                   # Feature components: PlantCard, EventCard, CustomHeader ...
├── helper/
│   ├── cn.ts                   # cn(): clsx + tailwind-merge, knows the type scale
│   ├── common-functions.ts     # showSnackbar, showErrorSnackbar, getErrorMessage, formatWithComma,
│   │                           # formatPrice, toFormattedDate, cleanPayload
│   ├── snackbar.ts             # Snackbar store (pushSnackbar / subscribeSnackbar)
│   ├── utility-functions.ts    # isIOS, isAndroid, hideKeyboard, showAlert
│   └── navigation-service.ts   # navigationRef, navigate, navigateAndSimpleReset ...
├── hooks/
│   ├── ThemeContext.tsx        # ThemeProvider + useTheme() (theme, mode, preference, setPreference, toggleTheme)
│   └── usePaginatedAPI.ts      # Infinite-scroll helper
├── navigation/
│   ├── AppStack.tsx            # Native stack built from screens.ts
│   ├── AppStackParams.ts       # Route params types
│   └── screens.ts              # Array of { name, component, options? }
├── redux/
│   ├── store.ts                # Store, persistor, RootStore, useAppDispatch, useAppSelector
│   ├── types.d.ts              # Shared types (User, LoginForm, API bodies + responses)
│   └── slices/authSlice.ts     # setCredentials, clearAuth, selectCurrentUser ...
├── screens/
│   ├── auth/                   # LoginScreen, RegisterScreen, VerifyOTP ...
│   ├── <feature>/              # Grouped by feature
│   └── *.tsx                   # Top-level screens (SplashScreen, HomeScreen)
└── theme/
    ├── lightTheme.ts           # Token → 6-digit hex
    ├── darkTheme.ts            # Same keys as lightTheme
    └── index.ts                # themes, themeVars() (NativeWind vars), ThemeType
```

Files that use `className` must live inside the `content` paths of `tailwind.config.js` (`App.tsx`, `Main.tsx`, `src/**`). If you add a new top-level folder with components, add it there.

## 1. Styling with NativeWind

### Basics

```tsx
<View className="flex-1 items-center justify-center bg-background p-6">
  <AppText variant="title1">Hello</AppText>
</View>
```

`inlineRem: 16` is set in Metro, so the Tailwind spacing scale matches design tools: `p-4` = 16, `gap-3` = 12, `rounded-xl` = 12, `h-12` = 48.

### Theme color tokens

Defined in `src/theme/lightTheme.ts` and `darkTheme.ts`, listed in `THEME_COLOR_TOKENS` in `tailwind.config.js`. `ThemeProvider` publishes them as CSS variables, so the classes switch with light/dark automatically.

| Class suffix | Use |
| --- | --- |
| `background` | Screen background: `bg-background` |
| `card` | Cards, inputs, sheets: `bg-card` |
| `text` | Primary text: `text-text` |
| `muted` | Secondary text, placeholders, captions: `text-muted` |
| `border` | Dividers, outlines: `border-border` |
| `primary` | Brand: `bg-primary`, `text-primary`, `border-primary` |
| `on-primary` | Text/icons on primary: `text-on-primary` |
| `secondary` | Secondary surfaces / buttons |
| `error` | Errors, destructive actions: `text-error`, `border-error` |

Opacity modifiers work: `bg-primary/10`, `border-text/20`.

**Adding a token** (e.g. `success`): add it to `lightTheme.ts`, `darkTheme.ts` **and** `THEME_COLOR_TOKENS` in `tailwind.config.js` (the theme test fails otherwise), then restart Metro with `--reset-cache`. Use semantic names (`success`, `warning`, `overlay`), never color names (`green`, `blue2`).

**When a prop needs a color value** (not a class) - `placeholderTextColor`, `ActivityIndicator color`, SVG icon `color`, `RefreshControl tintColor`, Switch track colors:

```tsx
const { theme } = useTheme();
<ActivityIndicator color={theme.primary} />
<CartIcon color={theme.text} width={24} height={24} />
```

Prefer tokens over `dark:` variants. Use `dark:` only for a one-off that genuinely differs per mode and isn't worth a token.

### Typography

Type scale in `tailwind.config.js` - each class sets size, line height and weight:

| Class | Size / line height | Weight | `AppText` variant |
| --- | --- | --- | --- |
| `text-header` | 34 / 41 | 700 | `header` |
| `text-title1` | 28 / 34 | 700 | `title1` |
| `text-title2` | 22 / 28 | 700 | `title2` |
| `text-title3` | 20 / 25 | 600 | `title3` |
| `text-headline` | 17 / 22 | 600 | `headline` |
| `text-body1` | 17 / 22 | 400 | `body` (default) |
| `text-subhead` | 15 / 20 | 400 | `subhead` |
| `text-body2` | 14 / 20 | 400 | `secondary` (muted) |
| `text-footnote` | 13 / 18 | 400 | `footnote` (muted), `error` |
| `text-caption1` | 12 / 16 | 400 | `caption` (muted) |
| `text-caption2` | 11 / 13 | 400 | - |
| `text-overline` | 10 / 12 | 500 | `overline` (muted, uppercase) |

**Adding a size** to the scale: add it to `theme.extend.fontSize` in `tailwind.config.js` **and** to `TYPE_SCALE` in `src/helper/cn.ts` (otherwise `cn()` treats it as a color and drops it next to `text-muted`).

**Custom fonts:** use `font-sans-regular | font-sans-medium | font-sans-semibold | font-sans-bold`. On Android a custom font needs one family per weight, so use `font-sans-bold`, not `font-sans-regular font-bold`. Link font files before using these classes (unknown font names crash on iOS).

### Rules

1. **Complete class names only.** Tailwind scans source text; `` `bg-${color}` `` generates nothing. Use typed maps or conditionals with full names:
   ```tsx
   const tone = { info: 'bg-primary', danger: 'bg-error' } as const;
   <View className={cn('rounded-xl p-4', tone[kind], active && 'border border-primary')} />
   ```
2. **Merge with `cn()`.** Any component that takes a `className` prop merges it last: `cn(base, variantMap[variant], condition && '...', className)`. `cn` resolves conflicts, so a caller's `px-2` really replaces the component's `px-5`.
3. **Repeated class strings → constant or component.** Used twice in one file → `const xClassName = '...'`; used in two files → a component.
4. **`style` only for computed values** - animated styles, measured widths, safe-area insets. `style` wins over `className` for the same property.
5. **Interaction states via variants:** `active:opacity-80`, `active:bg-card`, `focus:border-primary`, `disabled:opacity-50`.
6. **Arbitrary values for one-off sizes only:** `h-[340px]`, `max-w-[560px]`. If repeated, add to `tailwind.config.js`. Arbitrary colors (`bg-[#123456]`) are flagged by ESLint.
7. **Third-party components without `className`** get a one-time `cssInterop` registration (in the component wrapper file):
   ```ts
   import { cssInterop } from 'nativewind';
   import LinearGradient from 'react-native-linear-gradient';
   cssInterop(LinearGradient, { className: 'style' });
   ```
8. **Reanimated `Animated.View`:** keep layout classes on a plain `View`/`Pressable` inside or around it; put `entering`/`exiting`/animated `style` on the `Animated.View` (see `SnackbarHost.tsx`).
9. **Lists use class props:** `contentContainerClassName`, `columnWrapperClassName` on FlatList / ScrollView.
10. **After editing `tailwind.config.js`, `babel.config.js` or `metro.config.js`:** `npm start -- --reset-cache`.
11. Class order is enforced by `npx eslint . --fix` (`tailwindcss/classnames-order`).

## 2. Responsive Layout

React Native units are already density-independent (dp). Keep sizes fixed and let the **layout** adapt.

- **Flex & fractions first:** `flex-1`, `flex-row`, `w-1/2`, `gap-3`, `w-full`.
- **Readable column on tablets:** `Screen` constrains content to `max-w-[560px] self-center`. Use `<Screen fullWidth>` for grids/dashboards.
- **Breakpoints** (window width, update on rotation/split-screen): `sm:` 640, `md:` 768, `lg:` 1024, `xl:` 1280. E.g. `flex-col md:flex-row`, `px-6 md:px-10`.
- **Grids:** compute the column count from `useWindowDimensions()` and a target item width; set `key={columns}` on the FlatList.
- **Media:** `aspect-video w-full`, `aspect-square`.
- **Screen-relative:** `h-[40vh]`, `w-[80vw]` for heroes/sheets.
- **Font scaling:** keep it on. Cap tight UI with `maxFontSizeMultiplier={1.3}`; never `allowFontScaling={false}` except fixed overlays.

Avoid: `Dimensions.get()` inside components (use `useWindowDimensions()`), `isTablet` checks for layout (check available width), and any width-ratio scaling of sizes.

## 3. The Screen Component

Every screen's root:

```tsx
<Screen>…</Screen>                                   // all safe-area edges
<Screen className="justify-center">…</Screen>        // extra classes on the content column
<Screen edges={['top', 'left', 'right']}>…</Screen>  // tab bar owns the bottom
<Screen fullWidth>…</Screen>                         // full width on tablets
```

It provides `SafeAreaView` + `bg-background` + `px-6 md:px-10` + tablet column. Don't re-add a background or horizontal padding inside screens. For full-bleed content (hero images, horizontal carousels), use `-mx-6 md:-mx-10` on that element.

## 4. Component Library (`src/components/ui`)

Import from the barrel: `import { AppText, Button, Card, Loader, TextField } from '../components/ui';`

Every component in `ui/` (and every new one you add):
- accepts an optional `className`, merged last with `cn()`;
- exposes variants through a typed prop + a class map (`variant="outline"`, `size="sm"`), not booleans like `isPrimary`;
- reads color values from `useTheme()` only when a prop needs a raw value;
- has typed `interface Props`, a default export, and is added to `ui/index.ts`;
- sets accessibility props (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`).

| Component | Key props | Notes |
| --- | --- | --- |
| `AppText` | `variant` (`header`·`title1-3`·`headline`·`body`·`subhead`·`secondary`·`footnote`·`caption`·`overline`·`error`), `className`, all `TextProps` | Use instead of raw `<Text>` in screens |
| `Button` | `label`, `onPress`, `variant` (`primary`·`secondary`·`outline`·`danger`·`ghost`), `size` (`sm`·`md`·`lg`), `loading`, `disabled`, `startIcon`, `endIcon`, `className`, `labelClassName` | Shows a spinner while `loading` |
| `TextField` | `control`, `name`, `label`, `isRequired`, `isPassword`, `isLast`, `startIcon`, `endIcon`, `className`, `inputClassName`, all `TextInputProps` | react-hook-form Controller built in; error message + focus/error border handled |
| `Card` | `children`, `onPress?`, `className` | `rounded-2xl border border-border bg-card p-4`; pressable when `onPress` is set |
| `Loader` | `isLoading`, `variant` (`overlay`·`inline`), `className` | Overlay goes last in a screen |
| `SnackbarHost` | - | Mounted once in `App.tsx`; don't mount it again |

```tsx
<AppText variant="secondary" className="mt-2">{AppString.signInToContinue}</AppText>
<Button label={AppString.save} onPress={onSave} loading={isPending} className="mt-6" />
<Button label={AppString.logout} variant="outline" labelClassName="text-error" onPress={onLogout} />
<Card onPress={() => openPlant(item.id)} className="flex-row gap-3">…</Card>
<Loader isLoading={isPending} />
```

### Snackbars

```ts
import { showSnackbar, showErrorSnackbar, getErrorMessage } from '../helper/common-functions';

showSnackbar(AppString.loginSuccess);            // success, optional 2nd arg = detail line
showErrorSnackbar(getErrorMessage(err));          // error; no argument = generic message
```

Callable from anywhere (screens, mutation callbacks, interceptors). Don't use `Alert.alert` for feedback messages.

### Adding a new primitive / feature component

Follow `Button.tsx` as the reference:

```tsx
import React from 'react';
import { View } from 'react-native';
import { cn } from '../../helper/cn';
import AppText from './AppText';

const tones = {
  info: 'bg-primary/10',
  danger: 'bg-error/10',
} as const;

interface Props {
  title: string;
  tone?: keyof typeof tones;
  className?: string;
}

const Badge = ({ title, tone = 'info', className }: Props) => (
  <View className={cn('self-start rounded-full px-3 py-1', tones[tone], className)}>
    <AppText variant="caption" className={tone === 'danger' ? 'text-error' : 'text-primary'}>
      {title}
    </AppText>
  </View>
);

export default Badge;
```

Other standard components to build the same way when a project needs them: `CustomHeader` (back + title + optional end icon), `CustomDialog`, `CustomBottomSheet`, `CustomDropdown`, `CustomCheckBox`, `CustomSwitch`, `ListPlaceholder` (empty state), `KeyboardAwareScrollView`, and one card per data type (`PlantCard`, `EventCard` ...) wrapped in `React.memo`.

Shadows: prefer `border border-border` (works in dark mode). If the design needs elevation, use `shadow-md` and test both platforms.

## 5. Screen Pattern

Reference implementation: `src/screens/LoginScreen.tsx`.

```tsx
import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Types
import { AppStackParams } from '../../navigation/AppStackParams';
import type { LoginForm } from '../../redux/types';

// Components
import Screen from '../../components/Screen';
import { AppText, Button, TextField } from '../../components/ui';

// Hooks / state / API
import { useLogin } from '../../api/queries';
import { useAppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';

// Helpers / constants
import { getErrorMessage, showErrorSnackbar, showSnackbar } from '../../helper/common-functions';
import { isIOS } from '../../helper/utility-functions';
import { AppString } from '../../../constants/AppString';
import { loginSchema } from '../../../utils/schema';

// ⚠️ Manual SVG conversion required
import EmailIcon from '../../assets/svg/EmailIcon';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParams, 'LoginScreen'>;
  route: RouteProp<AppStackParams, 'LoginScreen'>;
};

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const { mutate: login, isPending } = useLogin();

  // Handle API results in mutate callbacks, not in useEffect.
  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: res => {
        dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
        showSnackbar(AppString.loginSuccess);
        navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
      },
      onError: err => showErrorSnackbar(getErrorMessage(err)),
    });
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={isIOS ? 'padding' : undefined} className="flex-1 justify-center">
        <AppText variant="title1">{AppString.welcomeBack}</AppText>
        <AppText variant="secondary" className="mb-8 mt-2">
          {AppString.signInToContinue}
        </AppText>

        <View className="gap-4">
          <TextField
            control={control}
            name="email"
            label={AppString.email}
            placeholder={AppString.enterEmail}
            startIcon={<EmailIcon />}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            isRequired
          />
          <TextField
            control={control}
            name="password"
            label={AppString.password}
            placeholder={AppString.enterPassword}
            onSubmitEditing={handleSubmit(onSubmit)}
            isPassword
            isLast
            isRequired
          />
        </View>

        <Button label={AppString.login} onPress={handleSubmit(onSubmit)} loading={isPending} className="mt-6" />
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default LoginScreen;
```

Import order: React/RN → navigation → libraries → types → components → hooks/state/API → helpers/constants → assets.

Common shapes:
- **Form screen:** `Screen` → header → `TextField`s (`useForm` + `yupResolver`) → `Button` → `handleSubmit`.
- **List screen:** `Screen` → header/filters (siblings) → `FlatList` with feature card → pagination footer.
- **Detail screen:** `useQuery(id)` → `ScrollView` → media + info sections → action `Button`s → `Loader`.

## 6. API Integration

**Step 1 - endpoint in `constants/API_Routes.ts`:**
```ts
export const API_Routes = {
  login: '/auth/login',
  plants: '/plants', // used as /plants/:id too
  addCartItem: '/cart/items',
  uploadFile: '/files',
} as const;
```

**Step 2 - service function in `src/api/service.ts`** (prefix `do`, typed body + typed response via the generic):
```ts
export const doLogin = (body: LoginForm) => postAPI<LoginResponse>(API_Routes.login, body);
export const doGetPlantList = (params: PlantListParams) => getAPI<PlantListResponse>(API_Routes.plants, params);
export const doGetPlantDetails = (id: number) => getAPI<Plant>(`${API_Routes.plants}/${id}`);
export const doAddCartItem = (body: CartReqBody) => postAPI<Cart>(API_Routes.addCartItem, body);
export const doUploadFile = (body: FormData) => uploadAPI<UploadResponse>(API_Routes.uploadFile, body);
```

`AxiosActions` return `response.data` and reject with the backend's error body when present, so `getErrorMessage(err)` gives the server message. The request interceptor in `AxiosClient.ts` adds `Authorization: Bearer <accessToken>` from the auth slice; add refresh / 401 handling as a response interceptor there.

**Step 3 - hook in `src/api/queries.ts`** (single file, prefix `use`):
```ts
export const usePlantDetails = (id: number) =>
  useQuery({
    queryKey: ['plant', id],
    queryFn: () => doGetPlantDetails(id),
    enabled: !!id,
  });

export const useLogin = () => useMutation({ mutationFn: doLogin });

export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doAddCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

export const usePlantList = (plantTypeId?: number) =>
  usePaginatedAPI({
    queryKey: ['plants'],
    queryFn: ({ pageParam, limit, search, dynamicParams }) =>
      doGetPlantList({ page: pageParam, pageSize: limit, search, plantTypeId: dynamicParams?.plantTypeId }),
    select: (pages: PlantListResponse[]) => pages.flatMap(p => p.plants),
    limit: 10,
    dynamicParams: { plantTypeId },
  });
```

Rules:
- Everything a `queryFn` reads must be in the `queryKey` (enforced by `@tanstack/query/exhaustive-deps`). `usePaginatedAPI` appends `search`, `limit` and `dynamicParams` to the key for you, so pass filters through `dynamicParams`.
- Cache invalidation lives in the mutation hook (`onSuccess` in `queries.ts`); UI reactions (snackbar, navigation) live in the screen's `mutate(..., { onSuccess, onError })`.
- Never call `service.ts` functions directly from screens.

**`usePaginatedAPI`** (`src/hooks/usePaginatedAPI.ts`):

| Option | Meaning |
| --- | --- |
| `queryKey` | Base key |
| `queryFn({ pageParam, limit, search, dynamicParams })` | Fetches one page |
| `select(pages)` | Flattens pages into items |
| `limit` (10), `firstPage` (1) | Page size / first page number |
| `dynamicParams` | Filters; part of the key |
| `hasNextPage(lastPage, allPages, limit)` | Override when the API returns a total or `hasMore` (default: last page had `limit` items) |
| `staleTime`, `enabled` | Passed to React Query |

Returns `{ data, isLoading, isFetchingNextPage, isRefreshing, hasNextPage, error, handleScrollToBottom, handleRefetch, search, handleSearch, resetSearch, query }`. `handleSearch` is debounced (400 ms) before it hits the API.

## 7. Lists

```tsx
const { theme } = useTheme();
const { data, isLoading, isRefreshing, isFetchingNextPage, handleScrollToBottom, handleRefetch } = usePlantList(typeId);

<FlatList
  data={data}
  keyExtractor={item => String(item.id)}
  renderItem={({ item }) => <PlantCard item={item} onPress={() => openPlant(item.id)} />}
  contentContainerClassName="gap-3 pb-6"
  showsVerticalScrollIndicator={false}
  refreshing={isRefreshing}
  onRefresh={handleRefetch}
  onEndReached={handleScrollToBottom}
  onEndReachedThreshold={0.4}
  ListFooterComponent={<Loader variant="inline" isLoading={isFetchingNextPage} />}
  ListEmptyComponent={!isLoading ? <ListPlaceholder title={AppString.noDataFound} /> : null}
/>
```

- Grid: `numColumns` + `columnWrapperClassName="gap-3"`; compute columns from width (see Responsive).
- `ListHeaderComponent` / `ListFooterComponent` only for content tied to list behavior (pagination loader, content that must scroll with items). Static banners/titles are plain siblings above the `FlatList`.
- Don't define complex header/footer/row renderers inline in the screen; extract a component.
- Feature cards are `React.memo`; keys are stable ids, not `index`.

## 8. Theme & Dark Mode

- `useTheme()` → `{ theme, mode, preference, setPreference, toggleTheme }`.
  - `mode`: what's shown (`'light' | 'dark'`).
  - `preference`: the user's choice (`'light' | 'dark' | 'system'`), **persisted in MMKV** under `StorageKeys.THEME_MODE` and applied on the first frame.
  - `setPreference('system')` goes back to following the OS; `toggleTheme()` pins the opposite of the current mode.
- `ThemeProvider` keeps NativeWind's `colorScheme` in sync, so `dark:` variants and native UI follow.
- `Main.tsx` maps the theme into React Navigation's theme (no white flash) and renders a `StatusBar` whose `barStyle` follows `mode`. Screens don't render their own `StatusBar` unless they need a different style (e.g. a full-bleed dark hero).
- Brand change = edit `lightTheme.ts` / `darkTheme.ts`. Nothing else should need touching.
- `ErrorBoundary` sits above `ThemeProvider`, so it is the only place that uses Tailwind's built-in palette instead of tokens.

## 9. Navigation

`AppStackParams.ts`:
```ts
export type AppStackParams = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  HomeScreen: undefined;
  PlantDetailScreen: { id: number; imageUrl?: string };
};
```

`screens.ts`:
```ts
export const screens: ScreenConfig[] = [
  { name: 'SplashScreen', component: SplashScreen },
  { name: 'LoginScreen', component: LoginScreen, options: { animation: 'fade' } },
  { name: 'HomeScreen', component: HomeScreen, options: { animation: 'fade' } },
  { name: 'PlantDetailScreen', component: PlantDetailScreen },
];
```

`AppStack.tsx` maps `screens` onto `Stack.Screen`, with `defaultScreenOptions` (`headerShown: false`, `ios_from_right`, `freezeOnBlur`) and per-screen `options` on top. Adding a screen = add its params type + one entry in `screens.ts`.

- Auth transitions (`Login` ↔ `Home`) use `navigation.reset(...)` or `navigateAndSimpleReset(...)`.
- Outside components (interceptors, slices), use `navigation-service.ts`.
- Every screen types `navigation` and `route` with `NativeStackNavigationProp` / `RouteProp`. Nested components use `useNavigation<StackNavigation>()`.

## 10. Redux

- Only app/session state goes in Redux (auth, user preferences). Server data stays in React Query.
- `store.ts` persists via MMKV (`reduxStorage`) with a `whitelist` (`['auth']`).
- Use `useAppDispatch` / `useAppSelector`; export typed selectors from the slice.

```ts
// slices/authSlice.ts
import type { User } from '../types';
import type { RootStore } from '../store';

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

reducers: {
  setCredentials(state, action: PayloadAction<{ user: User; accessToken: string }>) { ... },
  setUser(state, action: PayloadAction<User | null>) { ... },
  setAccessToken(state, action: PayloadAction<string | null>) { ... },
  clearAuth(state) { ... },
}

export const selectCurrentUser = (state: RootStore) => state.auth.user;
export const selectAccessToken = (state: RootStore) => state.auth.accessToken;
export const selectIsLoggedIn = (state: RootStore) => !!state.auth.accessToken;
```

Selectors take `RootStore`, never `state: any`. Import `RootStore` with `import type` to avoid a runtime cycle.

## 11. Types

- Shared types (API request bodies, response models, `User`, form types like `LoginForm`) in `src/redux/types.d.ts`.
- Route params in `src/navigation/AppStackParams.ts`.
- Component props: `interface Props` in the component file.
- No `any` in new code; use `unknown` + narrowing (`getErrorMessage(err)` for errors).

## 12. Forms

```ts
// utils/schema.ts - typed against the form type, so the two can't drift apart
export const loginSchema: yup.ObjectSchema<LoginForm> = yup.object({
  email: yup.string().trim().email(AppString.invalidEmail).required(AppString.emailRequired),
  password: yup.string().min(6, AppString.passwordMin).required(AppString.passwordRequired),
});
```

- Form type in `types.d.ts`, schema in `utils/schema.ts`, messages in `AppString`.
- `useForm<LoginForm>({ resolver: yupResolver(loginSchema), mode: 'onTouched', defaultValues })`.
- Fields are `TextField`s; the last one gets `isLast` and `onSubmitEditing={handleSubmit(onSubmit)}`.
- For a lone input with no validation (e.g. a search box), use a controlled `TextInput` with the same classes as `TextField`.

## 13. Icons

- Icons are components in `src/assets/svg/` built with `react-native-svg`, accepting `color`, `width`, `height`.
- When generating code, import by descriptive name and add `// ⚠️ Manual SVG conversion required`.
- Pass colors from `useTheme()` (`color={theme.text}`); never hardcode hex in icon usages.

```tsx
// ⚠️ Manual SVG conversion required
import CartIcon from '../../assets/svg/CartIcon';
<CartIcon color={theme.primary} width={24} height={24} />
```

## 14. Animation

- Reanimated 4 for animations (`useSharedValue`, `useAnimatedStyle`, layout animations `entering={FadeIn}`).
- Animated styles go in `style`; static styles stay in `className` (see rule 8 in section 1).
- Don't add `react-native-worklets/plugin` to Babel - `nativewind/babel` already registers it.
- In Jest, Reanimated and Worklets are mocked in `jest.setup.js`.
- Shared element transitions (`sharedTransitionTag`) need the Reanimated feature flag; may not work across tab navigators.

## 15. Strings & Constants

- All visible text in `constants/AppString.ts` (or `locales/*.json` with i18n). No hard-coded UI strings in screens or components.
- Storage keys in `constants/StoragePreferences.ts` (`StorageKeys`); read/write through `StoragePreferences` helpers.
- Non-styling magic numbers (page size, timeouts) in `constants/AppConstants.ts`.

## 16. Tooling & Code Quality

**Commands (run all three before finishing a task):**
```bash
npx tsc --noEmit
npx eslint . --fix
npm test
```

**ESLint** (`.eslintrc`): `@react-native` + TanStack Query + `eslint-plugin-tailwindcss` (v3.18.2 - later versions need Tailwind 4). Tailwind rules check `className`, every `*ClassName` prop and strings inside `cn()` / `clsx()`:
- `tailwindcss/classnames-order` (auto-fixable), `no-contradicting-classname` (error), `no-custom-classname` (typos / unsupported classes), `enforces-shorthand`.
- Arbitrary colors (`bg-[#...]`, `text-[#...]`) are flagged via `no-restricted-syntax`.
- `react-native/no-inline-styles` stays on (literal style objects); computed `style` is fine.

**Prettier** (`.prettierrc.js`): single quotes, trailing commas, `arrowParens: 'avoid'`, `bracketSameLine`, `printWidth: 100`. Formatting rules aren't duplicated in ESLint.

**Tests** (`__tests__/`): `App.test.tsx` (renders the app), `theme.test.ts` (tokens in sync), `helpers.test.ts` (`cn`, formatters, snackbar store). Add a test when you add a helper.

**Rules:**
1. No `StyleSheet.create` / inline style objects for static styles - use `className`.
2. No hex colors or arbitrary text sizes in components.
3. No size-scaling helpers.
4. Repeated JSX or class strings → component or constant; class merging via `cn()`.
5. Type everything; no `any`.
6. React 19 / React Compiler: no `useCallback` / `useMemo` by default. Add them only when profiling shows a need or a library requires stable references (e.g. context values).
7. `React.memo` for list item components.
8. Handle API results in `mutate` callbacks, not `useEffect`.
9. Use `useWindowDimensions()`, never `Dimensions.get()` in components.
10. Accessibility: `accessibilityRole` on custom pressables, `accessibilityLabel` on icon-only buttons, touch targets ≥ 44dp (`h-11`/`h-12`, or `hitSlop`).

## 17. New Project Checklist

1. `npx @react-native-community/cli init MyApp --template @umang-thakkar/base-template-nativewind`
2. `.env` / `constants/AppConstants.ts`: `API_BASE_URL`, `ENV`
3. `app.json` / bundle IDs / app name
4. Brand colors → `src/theme/lightTheme.ts` + `darkTheme.ts`
5. Fonts → `src/assets/fonts`, link, update `fontFamily` in `tailwind.config.js`
6. Type-scale changes (if the design differs) → `tailwind.config.js` + `TYPE_SCALE` in `cn.ts`
7. `constants/API_Routes.ts`, `constants/AppString.ts`
8. Replace the demo `todos` service/queries and demo login with real endpoints
9. `AppStackParams.ts` + `screens.ts`
10. Redux slices + persist whitelist
11. `utils/schema.ts` + form types in `types.d.ts`
12. Replace placeholder SVG icons
13. Firebase (if needed): `google-services.json`, `GoogleService-Info.plist`
14. `npx tsc --noEmit && npx eslint . && npm test`
15. `npm start -- --reset-cache`, then test light + dark + system, small phone + tablet, large font size

## Final Notes

- **Single sources of truth:** theme tokens (`src/theme/*`), type scale (`tailwind.config.js` + `cn.ts`), UI primitives (`src/components/ui`), API hooks (`src/api/queries.ts`), shared types (`src/redux/types.d.ts`), strings (`constants/AppString.ts`).
- **Consistency over cleverness:** when the template already has a way to do something, use it.
- Follow this pattern for every screen and component so all apps share one structure.

## Changelog

**Applied in the template (2026-11-26):**
1. Added `usePaginatedAPI`, `showSnackbar` / `showErrorSnackbar` (+ `SnackbarHost`), `getErrorMessage`, `formatWithComma`, `formatPrice`, `cleanPayload`, `constants/API_Routes.ts`, `constants/AppString.ts`, `utils/schema.ts`, and `src/components/ui/` (AppText, Button, TextField, Card, Loader). Login/Home/Splash screens use them.
2. Added `cn()` (`clsx` + `tailwind-merge` 2.x, type scale registered); `Screen` and all primitives use it.
3. Removed `src/helper/colors.ts`, `src/helper/matrics.ts` and the `responsive*` / `deviceWidth` / `deviceHeight` helpers.
4. ESLint: dropped the missing `@react-native-community` config, the unresolvable `import/order` rule and StyleSheet-only rules; added `eslint-plugin-tailwindcss` and an arbitrary-color check. Added `.prettierrc.js`.
5. Theme preference (light / dark / system) persisted in MMKV; `setPreference` added to `useTheme()`.
6. Skill `name` matches its folder (`umang-nativewind-pattern`).
7. Single quotes + Prettier across the template; typed `RootStore` selectors and `User` type in `authSlice.ts`; typed `AxiosActions` generics (+ `patchAPI`, `uploadAPI`); Bearer-token request interceptor; MMKV v3 fallback removed.
8. `StatusBar` in `Main.tsx` follows `mode`.

**Proposed (not yet applied):** none open. Add new ideas here with a status before changing the pattern.
