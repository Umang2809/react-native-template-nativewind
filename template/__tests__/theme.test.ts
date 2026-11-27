import { lightTheme } from '../src/theme/lightTheme';
import { darkTheme } from '../src/theme/darkTheme';
import { hexToRgbChannels, tokenToCssVar } from '../src/theme';

const { THEME_COLOR_TOKENS } = require('../tailwind.config');

describe('theme tokens', () => {
  it('light, dark and tailwind.config.js list the same color tokens', () => {
    const tailwindTokens = [...THEME_COLOR_TOKENS].sort();
    expect(Object.keys(lightTheme).sort()).toEqual(tailwindTokens);
    expect(Object.keys(darkTheme).sort()).toEqual(tailwindTokens);
  });

  it('every color is 6-digit hex', () => {
    [...Object.values(lightTheme), ...Object.values(darkTheme)].forEach(hex =>
      expect(() => hexToRgbChannels(hex)).not.toThrow(),
    );
  });

  it('converts tokens and colors to CSS variable format', () => {
    expect(tokenToCssVar('onPrimary')).toBe('--color-on-primary');
    expect(hexToRgbChannels('#4045EF')).toBe('64 69 239');
  });
});
