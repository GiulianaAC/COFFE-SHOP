module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'screens/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    '!screens/**/index.js',
    '!screens/DeliveryScreen.js',
    '!screens/DetailScreen.js',
    '!screens/FavoritesScreen.js',
    '!screens/HomeScreen.js',
    '!screens/OnboardingScreen.js',
    '!screens/OrderScreen.js',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@expo|expo|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
  },
};