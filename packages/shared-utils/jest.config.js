const path = require('path');
const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: '@myfood/shared-utils',
  rootDir: path.resolve(__dirname, '../..'),
  testMatch: ['<rootDir>/packages/shared-utils/**/?(*.)+(spec|test).[tj]s?(x)']
};
