/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  passWithNoTests: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: { jsx: 'react-jsx' }
      }
    ]
  },
  moduleNameMapper: {
    '^@myfood/shared-ui/(.*)$': '<rootDir>/packages/shared-ui/src/$1',
    '^@myfood/shared-utils/(.*)$': '<rootDir>/packages/shared-utils/src/$1',
    '^@myfood/shared-types/(.*)$': '<rootDir>/packages/shared-types/src/$1'
  }
};
