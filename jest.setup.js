require('@testing-library/jest-dom');

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const React = require('react');
    const cloned = { ...(props ?? {}) };
    if ('unoptimized' in cloned) {
      delete cloned.unoptimized;
    }
    return React.createElement('img', cloned);
  }
}));
