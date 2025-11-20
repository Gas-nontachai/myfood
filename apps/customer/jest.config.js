const path = require('path');
const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: '@myfood/customer',
  rootDir: path.resolve(__dirname, '../..'),
  testMatch: ['<rootDir>/apps/customer/__tests__/**/*.(spec|test).[tj]s?(x)']
};
