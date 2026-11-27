# Code Quality & Testing

## ESLint

Config: `.eslintrc`. It extends `@react-native`, the TanStack Query recommended rules and `plugin:tailwindcss/recommended`.

```bash
npm run lint          # or: npx eslint . --fix
npx tsc --noEmit      # type check
```

Notable rules:

| Rule | Level | Why |
| --- | --- | --- |
| `react-hooks/rules-of-hooks` | error | Hooks must be called unconditionally |
| `react-hooks/exhaustive-deps` | warn | Missing effect dependencies |
| `@tanstack/query/exhaustive-deps` | error | Everything a `queryFn` uses must be in the `queryKey` |
| `@typescript-eslint/no-explicit-any` | warn | Prefer real types |
| `react-native/no-inline-styles` | warn | Literal style objects; use `className` (computed `style` is fine) |
| `tailwindcss/classnames-order` | warn | Consistent class order (auto-fixable) |
| `tailwindcss/no-contradicting-classname` | error | e.g. `p-4 p-2` in one string |
| `tailwindcss/no-custom-classname` | warn | Typos and classes that don't exist in `tailwind.config.js` |
| `tailwindcss/enforces-shorthand` | warn | `px-4 py-4` → `p-4` |
| `no-restricted-syntax` | warn | Arbitrary colors (`bg-[#...]`, `text-[#...]`); use a theme token |
| `no-console` | warn | `console.warn`, `error` and `info` are allowed |
| `eqeqeq`, `curly`, `prefer-const`, `no-var` | error | General hygiene |

The Tailwind rules read `tailwind.config.js` and check `className`, every `*ClassName` prop (`contentContainerClassName` ...) and strings passed to `cn()` / `clsx()`. Keep `eslint-plugin-tailwindcss` on **3.18.2**: later versions need Tailwind v4 and fail to load the v3 config.

Test files (`__tests__/**`, `*.test.ts(x)`) get the Jest environment, allow `any`, and skip the class-conflict rules (the `cn()` tests pass conflicting classes on purpose).

Formatting rules (quotes, semicolons, indent) are left to Prettier.

## Prettier

`.prettierrc.js`:

```js
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: true,
  printWidth: 100,
};
```

```bash
npx prettier --write .
```

## Testing

Jest runs with the React Native preset.

```bash
npm test
```

- `__tests__/App.test.tsx` renders the full app tree with `react-test-renderer`.
- `__tests__/helpers.test.ts` covers `cn()` (conflicts and the type scale), the formatters, `cleanPayload`, `getErrorMessage` and the snackbar store.
- `__tests__/theme.test.ts` checks that `lightTheme`, `darkTheme` and `THEME_COLOR_TOKENS` in `tailwind.config.js` list the same tokens, and that every color is 6-digit hex.
- `__mocks__/react-native-mmkv.ts` swaps MMKV for an in-memory `Map`, so the store and persistence run in Jest.

Example test for a slice:

```ts
import reducer, { setCredentials, clearAuth } from '../src/redux/slices/authSlice';

test('login then logout', () => {
  let state = reducer(undefined, setCredentials({ user: { id: '1' }, accessToken: 't' }));
  expect(state.accessToken).toBe('t');
  state = reducer(state, clearAuth());
  expect(state).toEqual({ user: null, accessToken: null });
});
```

### Jest configuration

`jest.config.js` does three things beyond the React Native preset:

| Setting | Why |
| --- | --- |
| `transformIgnorePatterns` | Runs `react-native-*`, `@react-navigation`, `nativewind`, `react-redux`, `redux-persist`, `@reduxjs/toolkit`, `immer` and `@tanstack` through Babel, since they ship ESM or JSX. Add a package here if Jest reports "Cannot use import statement outside a module" for it. |
| `setupFiles: ['react-native-gesture-handler/jestSetup', '<rootDir>/jest.setup.js']` | Gesture Handler's native mocks (used by the stack navigator), and `jest.setup.js`, which swaps Reanimated and Worklets for their JS mocks |
| `moduleNameMapper` `\.css$` | Stubs `global.css`, which only Metro can compile |

`App.test.tsx` unmounts the app at the end so the splash timer is cleared and Jest exits cleanly.

Other native modules you add later may need their own Jest mocks. Most libraries document a `jest/setup` file to add under `setupFiles`.
