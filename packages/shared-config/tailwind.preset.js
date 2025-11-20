/** Tailwind preset shared across apps */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#ff5a1f',
          secondary: '#111827',
          accent: '#fbbf24'
        }
      },
      borderRadius: {
        xl: '1.2rem'
      }
    }
  },
  plugins: []
};
