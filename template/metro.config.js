const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), {
  input: './global.css',
  // NativeWind defaults to 1rem = 14 on native. 16 makes the Tailwind scale
  // match web and design tools: p-4 = 16, text-base = 16.
  inlineRem: 16,
});
