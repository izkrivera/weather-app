const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/__tests__/mockData/',
  ],
}

module.exports = createJestConfig(customJestConfig)
