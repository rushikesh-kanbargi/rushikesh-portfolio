/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
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
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'border-shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'cta-shimmer': {
          '0%': { transform: 'translateX(-130%) skewX(-18deg)' },
          '100%': { transform: 'translateX(230%) skewX(-18deg)' },
        },
      },
      animation: {
        'gradient-xy': 'gradient-xy 8s ease infinite',
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'marquee-reverse': 'marquee var(--marquee-duration, 40s) linear infinite reverse',
        'border-shimmer': 'border-shimmer 2.5s linear infinite',
        'cta-shimmer': 'cta-shimmer 2.85s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
