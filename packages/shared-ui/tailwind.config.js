const sharedPreset = require('../shared-config/tailwind.preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [sharedPreset],
  darkMode: ['class'],
  theme: {
    extend: {}
  },
  plugins: []
};
