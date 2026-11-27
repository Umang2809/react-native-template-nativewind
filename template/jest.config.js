module.exports = {
  preset: 'react-native',
  // Packages shipped as untranspiled ESM/JSX that Jest must run through Babel.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-[a-z-]+)?|@react-native(-community)?|@react-navigation|nativewind|react-redux|redux-persist|@reduxjs/toolkit|immer|@tanstack)/)',
  ],
  setupFiles: ['react-native-gesture-handler/jestSetup', '<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // global.css is compiled by Metro (NativeWind); Jest only needs a stub.
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
};
