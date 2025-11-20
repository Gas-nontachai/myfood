const path = require('path');
const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  displayName: '@myfood/pos',
  rootDir: path.resolve(__dirname, '../..'),
  testMatch: ['<rootDir>/apps/pos/__tests__/**/*.(spec|test).[tj]s?(x)']
};
