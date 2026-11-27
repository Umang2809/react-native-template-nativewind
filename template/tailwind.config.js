/** @type {import('tailwindcss').Config} */

/**
 * Theme color tokens. Must match the keys of `src/theme/lightTheme.ts` and
 * `src/theme/darkTheme.ts` (a test in __tests__/theme.test.ts checks this).
 *
 * `ThemeProvider` publishes each token as a CSS variable holding "R G B"
 * (e.g. `--color-on-primary: 255 255 255`), so every class below follows the
 * active light/dark theme and supports opacity modifiers:
 *   bg-background, text-text, bg-primary/80, border-border, text-muted ...
 */
const THEME_COLOR_TOKENS = [
  'background',
  'card',
  'text',
  'muted',
  'border',
  'primary',
  'onPrimary',
  'secondary',
  'error',
];

const kebab = token => token.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);

const themeColors = Object.fromEntries(
  THEME_COLOR_TOKENS.map(token => [
    kebab(token),
    `rgb(var(--color-${kebab(token)}) / <alpha-value>)`,
  ]),
);

module.exports = {
  content: ['./App.tsx', './Main.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: themeColors,

      // Font families. Add the font files to src/assets/fonts and link them
      // (see docs/helpers.md#fonts) before using these classes: an unknown
      // font name is an error on iOS. Android needs one family per weight,
      // so pick the family for the weight (`font-sans-bold`) instead of
      // relying on `font-bold` with a custom font. The `sans-` prefix keeps
      // these from clashing with Tailwind's font-weight classes.
      fontFamily: {
        'sans-regular': ['GeneralSans-Regular'],
        'sans-medium': ['GeneralSans-Medium'],
        'sans-semibold': ['GeneralSans-Semibold'],
        'sans-bold': ['GeneralSans-Bold'],
      },

      // Type scale, usable as `text-title1`, `text-body2`, `text-caption1` ...
      fontSize: {
        header: ['34px', { lineHeight: '41px', fontWeight: '700' }],
        title1: ['28px', { lineHeight: '34px', fontWeight: '700' }],
        title2: ['22px', { lineHeight: '28px', fontWeight: '700' }],
        title3: ['20px', { lineHeight: '25px', fontWeight: '600' }],
        headline: ['17px', { lineHeight: '22px', fontWeight: '600' }],
        body1: ['17px', { lineHeight: '22px', fontWeight: '400' }],
        subhead: ['15px', { lineHeight: '20px', fontWeight: '400' }],
        body2: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        footnote: ['13px', { lineHeight: '18px', fontWeight: '400' }],
        caption1: ['12px', { lineHeight: '16px', fontWeight: '400' }],
        caption2: ['11px', { lineHeight: '13px', fontWeight: '400' }],
        overline: ['10px', { lineHeight: '12px', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};

module.exports.THEME_COLOR_TOKENS = THEME_COLOR_TOKENS;
