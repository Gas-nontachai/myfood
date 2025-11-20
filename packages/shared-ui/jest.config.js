const path = require('path');
const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: '@myfood/shared-ui',
  rootDir: path.resolve(__dirname, '../..'),
  testMatch: ['<rootDir>/packages/shared-ui/**/?(*.)+(spec|test).[tj]s?(x)']
};
