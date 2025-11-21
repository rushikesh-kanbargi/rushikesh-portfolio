/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f', // Deep navy background
          800: '#112240', // Lighter navy for cards/sections
        },
        charcoal: {
          900: '#121212', // Deep charcoal
          800: '#1e1e1e', // Lighter charcoal
        },
        gold: {
          50: '#fbf8eb',
          100: '#f5eccd',
          200: '#ebd894',
          300: '#e0c05b',
          400: '#d4af37', // Base gold
          500: '#b59226',
          600: '#91711b',
          700: '#745718',
          800: '#604719',
          900: '#523d1a',
          950: '#2e210b',
        },
        'electric-blue': {
          50: '#eaffff',
          100: '#cbfefe',
          200: '#9efefe',
          300: '#5efdfd',
          400: '#00f3ff', // Base neon
          500: '#00d7e6',
          600: '#00a9b8',
          700: '#068693',
          800: '#0e6a76',
          900: '#115863',
          950: '#063a43',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
