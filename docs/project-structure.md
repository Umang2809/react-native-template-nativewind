# Project Structure

```
MyApp/
├── App.tsx                    # Root component: provider tree
├── Main.tsx                   # NavigationContainer + AppStack
├── index.js                   # AppRegistry entry
├── app.json                   # App name / display name
├── babel.config.js            # RN preset + nativewind/babel (includes the Reanimated/Worklets plugin)
├── metro.config.js            # withNativeWind(..., { input: './global.css', inlineRem: 16 })
├── tailwind.config.js         # Theme color classes, fonts, type scale
├── global.css                 # @tailwind directives (imported in App.tsx)
├── nativewind-env.d.ts        # className prop types
├── tsconfig.json              # Extends @react-native/typescript-config
├── .eslintrc                  # Lint rules incl. Tailwind class checks (see code-quality.md)
├── .prettierrc.js             # Formatting (single quotes, printWidth 100)
├── jest.config.js             # Transform list for ESM packages, CSS stub
├── jest.setup.js              # Reanimated / Worklets mocks
├── __mocks__/
│   ├── react-native-mmkv.ts   # In-memory MMKV for Jest
│   └── styleMock.js           # Stub for global.css in Jest
├── __tests__/
│   ├── App.test.tsx
│   ├── helpers.test.ts        # cn(), formatters, snackbar store
│   └── theme.test.ts          # Theme tokens match tailwind.config.js
├── constants/
│   ├── API_Routes.ts          # Every endpoint path
│   ├── AppConstants.tsx       # API_BASE_URL and other app constants
│   ├── AppString.ts           # Every user-facing string
│   └── StoragePreferences.ts  # MMKV instance, redux-persist adapter, helpers
├── utils/
│   └── schema.ts              # Yup schemas for react-hook-form
├── android/  ios/             # Native projects
└── src/
    ├── api/
    │   ├── AxiosClient.ts     # Axios instance + Bearer-token interceptor
    │   ├── AxiosActions.ts    # getAPI / postAPI / putAPI / patchAPI / deleteAPI / uploadAPI
    │   ├── service.ts         # Endpoint functions (one `do*` per API call)
    │   └── queries.ts         # Every React Query hook, in one file
    ├── assets/
    │   ├── fonts/  images/  svg/
    ├── components/
    │   ├── ErrorBoundary.tsx
    │   ├── Screen.tsx         # Safe area + background + centered tablet column
    │   └── ui/                # AppText, Button, TextField, Card, Loader, SnackbarHost (see components.md)
    ├── helper/
    │   ├── cn.ts              # cn(): clsx + tailwind-merge
    │   ├── common-functions.ts# Snackbars, error messages, formatting, dates, cleanPayload
    │   ├── navigation-service.ts # navigate() etc. outside components
    │   ├── snackbar.ts        # Snackbar store used by showSnackbar
    │   └── utility-functions.ts  # Platform flags, keyboard, alerts
    ├── hooks/
    │   ├── ThemeContext.tsx   # ThemeProvider + useTheme (persisted light/dark/system)
    │   └── usePaginatedAPI.ts # Infinite-scroll helper on useInfiniteQuery
    ├── navigation/
    │   ├── AppStack.tsx       # Stack navigator built from screens.ts
    │   ├── AppStackParams.ts  # Route param types
    │   └── screens.ts         # Screen registry
    ├── redux/
    │   ├── store.ts           # Store, persistor, typed hooks
    │   ├── slice.ts           # Example "global" slice
    │   ├── slices/authSlice.ts
    │   ├── action.ts          # Empty: place for thunks if you want them
    │   └── types.d.ts         # Shared API types
    ├── screens/
    │   ├── SplashScreen.tsx
    │   ├── LoginScreen.tsx
    │   └── HomeScreen.tsx
    └── theme/
        ├── lightTheme.ts
        ├── darkTheme.ts
        └── index.ts           # themes map, ThemeType, CSS-variable helpers
```

## The provider tree

`App.tsx` wraps the app in this order (outermost first):

```
ErrorBoundary                 catches render errors anywhere below
└── QueryClientProvider       React Query cache
    └── Provider (Redux)      store
        └── PersistGate       waits for MMKV rehydration before rendering
            └── SafeAreaProvider
                └── ThemeProvider
                    ├── Main  NavigationContainer → StatusBar + AppStack
                    └── SnackbarHost  messages from showSnackbar / showErrorSnackbar
```

Why this order matters:

- `PersistGate` sits inside the Redux `Provider` and above everything that reads state, so `SplashScreen` sees the rehydrated `accessToken` on its first render.
- `ThemeProvider` is below `SafeAreaProvider` and above navigation, so every screen can call `useTheme()`. It also renders the `View` that publishes the theme's CSS variables, so `bg-background`, `text-text` etc. only work inside it.
- `ErrorBoundary` is outermost and does **not** use the theme (it must render even if a provider throws). It styles itself with fixed Tailwind colors.
- `import './global.css'` is the first line of `App.tsx`. NativeWind needs it once, before any `className` is used.

## Where new code goes

| You are adding… | Put it in |
| --- | --- |
| A screen | `src/screens/` (wrap it in `<Screen>`), then register it in `src/navigation/screens.ts` and `AppStackParams.ts` |
| A theme color, font or text size | `src/theme/*Theme.ts` + `tailwind.config.js` |
| A reusable component | `src/components/` |
| An API endpoint | `src/api/service.ts` (function) + `src/api/queries.ts` (hook) |
| Global client state | A new slice in `src/redux/slices/` |
| A custom hook | `src/hooks/` |
| A pure helper | `src/helper/` |
| A constant or env value | `constants/AppConstants.tsx` |
