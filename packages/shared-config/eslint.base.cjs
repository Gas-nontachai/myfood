module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  settings: {
    next: {
      rootDir: ['apps/*/']
    }
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};
