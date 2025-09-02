/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map your simple colors
        'primary': {
          DEFAULT: '#7C3AED',
          hover: '#9F67F3'
        },
        'secondary': {
          DEFAULT: '#3B82F6',
          hover: '#60A5FA'
        },
        'text': '#F3F4F6',
        'muted': '#9CA3AF',
        'border': '#2A2A2A',
        'success': '#15803d',
        'warning': '#B45309',
        'error': '#7F1D1D',
        'dark': {
          DEFAULT: '#121212',
          secondary: {
            DEFAULT: '#1E1E1E',
            hover: 'color-mix(in srgb, #121212 92%, #F3F4F6)',
          },
        },
      }
    },
  },
  plugins: [],
}
