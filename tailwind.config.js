/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ─── Semantic Color Tokens (CSS-variable backed) ──────────── */
      colors: {
        // Legacy aliases — keep for existing Tailwind classes
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',

        // Semantic tokens
        brand: {
          DEFAULT: 'var(--color-brand)',
          muted: 'var(--color-brand-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          muted: 'var(--color-accent-muted)',
          glow: 'var(--color-accent-glow)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised: 'var(--color-surface-raised)',
          overlay: 'var(--color-surface-overlay)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-fg)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
        },

        // Raw palettes
        navy: {
          900: '#0a192f',
          800: '#112240',
        },
        charcoal: {
          900: '#121212',
          800: '#1e1e1e',
        },
        gold: {
          50: '#fbf8eb',
          100: '#f5eccd',
          200: '#ebd894',
          300: '#e0c05b',
          400: '#d4af37',
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
          400: '#00f3ff',
          500: '#00d7e6',
          600: '#00a9b8',
          700: '#068693',
          800: '#0e6a76',
          900: '#115863',
          950: '#063a43',
        },
      },

      /* ─── Typography ─────────────────────────────────────────── */
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display-lg': ['clamp(2.25rem, 4.5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading-lg': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
        'heading-md': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['clamp(1rem, 1.5vw, 1.25rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'mono-xs': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },

      /* ─── Spacing (extend defaults) ──────────────────────────── */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        'section': 'var(--spacing-section)',
        'section-lg': 'var(--spacing-section-lg)',
      },

      /* ─── Border Radius Tokens ───────────────────────────────── */
      borderRadius: {
        'cyber': '2px',
        'cyber-lg': '4px',
        'panel': '8px',
      },

      /* ─── Animation Tokens ───────────────────────────────────── */
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
        'slower': '600ms',
      },

      /* ─── Keyframes ──────────────────────────────────────────── */
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
