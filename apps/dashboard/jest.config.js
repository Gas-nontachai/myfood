const path = require('path');
const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: '@myfood/dashboard',
  rootDir: path.resolve(__dirname, '../..'),
  testMatch: ['<rootDir>/apps/dashboard/**/?(*.)+(spec|test).[tj]s?(x)']
};
