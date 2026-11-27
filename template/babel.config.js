module.exports = {
  // `nativewind/babel` adds the className transform and the Reanimated plugin
  // (which forwards to react-native-worklets), so the worklets plugin must not
  // be listed again here.
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
};
