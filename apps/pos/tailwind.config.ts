import type { Config } from 'tailwindcss';
import sharedPreset from '../../packages/shared-config/tailwind.preset';

const config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/shared-ui/src/**/*.{ts,tsx}'],
  presets: [sharedPreset],
  darkMode: ['class'],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;

export default config;
