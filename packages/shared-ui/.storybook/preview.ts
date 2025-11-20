import type { Preview } from '@storybook/react';
import '../src/styles/tailwind.css';
import { withThemeByClassName } from '@storybook/addon-styling';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light'
    })
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview;
