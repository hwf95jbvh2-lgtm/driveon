/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pearl: {
          50: 'var(--color-pearl-50, #FBF6E9)',
          100: 'var(--color-pearl-100, #F4E4C5)',
          200: 'var(--color-pearl-200, #EBD4A4)',
          300: 'var(--color-pearl-300, #E0C283)',
          400: 'var(--color-pearl-400, #D4B063)',
        },
        teal: {
          50: 'var(--color-teal-50, #EAF5F2)',
          100: 'var(--color-teal-100, #D3EBE6)',
          200: 'var(--color-teal-200, #A8D6CD)',
          300: 'var(--color-teal-300, #9CC8BD)',
          400: 'var(--color-teal-400, #82B8AB)',
          500: 'var(--color-teal-500, #6FAC9F)',
          600: 'var(--color-teal-600, #5A9688)',
          700: 'var(--color-teal-700, #487D70)',
          800: 'var(--color-teal-800, #376358)',
        },
        orange: {
          50: 'var(--color-orange-50, #FCEBE0)',
          100: 'var(--color-orange-100, #F9D2BA)',
          200: 'var(--color-orange-200, #F0A878)',
          300: 'var(--color-orange-300, #E0854A)',
          400: 'var(--color-orange-400, #D96821)',
          500: 'var(--color-orange-500, #BF4B00)',
          600: 'var(--color-orange-600, #A03F00)',
          700: 'var(--color-orange-700, #823300)',
          800: 'var(--color-orange-800, #5F2700)',
        },
        ink: {
          900: 'var(--color-ink-900, #1A1A17)',
          800: 'var(--color-ink-800, #2D2D27)',
          700: 'var(--color-ink-700, #42423B)',
          600: 'var(--color-ink-600, #5C5C52)',
          500: 'var(--color-ink-500, #7A7A6E)',
          400: 'var(--color-ink-400, #9C9C8E)',
          300: 'var(--color-ink-300, #C5C5B5)',
          200: 'var(--color-ink-200, #E0E0D4)',
        },
      },
      fontFamily: {
        display: ['var(--font-heading, Unbounded)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body, Inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': 'var(--radius-card, 1.25rem)',
        '3xl': 'var(--radius-card-lg, 1.75rem)',
        btn: 'var(--radius-button, 0.75rem)',
      },
      boxShadow: {
        card: 'var(--shadow-card, 0 1px 2px rgba(26,26,23,0.04), 0 8px 24px -12px rgba(26,26,23,0.12))',
        'card-hover': 'var(--shadow-card-hover, 0 2px 4px rgba(26,26,23,0.06), 0 16px 36px -14px rgba(26,26,23,0.2))',
        none: 'var(--shadow-none, none)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
