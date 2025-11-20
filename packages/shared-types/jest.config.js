const path = require('path');
const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: '@myfood/shared-types',
  rootDir: path.resolve(__dirname, '../..'),
  testMatch: ['<rootDir>/packages/shared-types/**/?(*.)+(spec|test).[tj]s?(x)']
};
