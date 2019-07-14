const {defaults} = require('jest-config');

module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '/testUtils/'],
  clearMocks: true, // clear info stored in mocks between tests
  coverageDirectory: './coverage/'
};