# 🚀 React Native Base Template (NativeWind)

A React Native CLI template with the boilerplate already done: NativeWind (Tailwind CSS), Redux Toolkit, Redux Persist on MMKV, React Navigation, React Query, Axios, light/dark theming and TypeScript.

> Prefer plain `StyleSheet` styling? Use the standard template: [`@umang-thakkar/base-template`](https://www.npmjs.com/package/@umang-thakkar/base-template).

## Quick start

```sh
npx @react-native-community/cli init MyApp --template @umang-thakkar/base-template-nativewind
cd MyApp
npm start
```

Then, in another terminal, `npm run android` or `npm run ios`. Requires Node.js 22.11+.

## What's included

- **Redux Toolkit** store with typed hooks and an `auth` slice (`user` + `accessToken`)
- **Redux Persist on MMKV**: login survives app restarts
- **React Navigation 7** stack with a screen registry and a navigation service for use outside components
- **React Query 5** hooks over a layered **Axios** API (client → actions → services → queries)
- **NativeWind v4** styling: `className="bg-card text-title1 md:px-10"`, with a type scale and responsive breakpoints, plus `cn()` (clsx + tailwind-merge) for merging classes
- **UI kit** in `src/components/ui`: `AppText`, `Button` (5 variants × 3 sizes), `TextField` (react-hook-form built in), `Card`, `Loader`, and app-wide snackbars (`showSnackbar` / `showErrorSnackbar`)
- **Forms**: react-hook-form + yup, with typed schemas in `utils/schema.ts`
- **Light/dark themes**: theme colors are Tailwind classes (`bg-background`, `text-primary`) backed by CSS variables; the user's Light / Dark / System choice is saved in MMKV; `useTheme()` for color values
- **Infinite scroll** helper `usePaginatedAPI` with debounced search, and an Axios client that attaches the auth token
- Central `API_Routes` and `AppString` constants
- A `Screen` wrapper for safe area, background and a readable column on tablets
- **ErrorBoundary** with a dev-only error view
- Formatting, error-message, date, platform and navigation helpers
- ESLint with Tailwind class checks (order, conflicts, unknown classes, no hard-coded colors), Prettier, and Jest with MMKV and Reanimated mocks
- An agent skill (`.agents/skills/umang-nativewind-pattern` in the repo) describing the conventions, so AI coding agents build apps the same way

## Documentation

Full docs are in [`docs/`](./docs/README.md):

- [Getting Started](./docs/getting-started.md)
- [Project Structure](./docs/project-structure.md)
- [Styling (NativeWind)](./docs/styling.md)
- [Components (UI kit)](./docs/components.md)
- [Responsive UI](./docs/responsive.md)
- [State Management](./docs/state-management.md)
- [Storage (MMKV)](./docs/storage.md)
- [Networking](./docs/networking.md)
- [Navigation](./docs/navigation.md)
- [Theming](./docs/theming.md)
- [Helpers & Utilities](./docs/helpers.md)
- [Error Handling](./docs/error-handling.md)
- [Code Quality & Testing](./docs/code-quality.md)
- [Customization Recipes](./docs/customization.md)
- [Roadmap & Known Issues](./docs/roadmap.md)
- [Publishing the Template](./docs/publishing.md)

## Contributing

Fork it and customize it. Pull requests are welcome.

## Author

Created with ❤️ by **[Umang Thakkar](https://github.com/Umang2809)**

## License

MIT © [Umang Thakkar](https://github.com/Umang2809)
