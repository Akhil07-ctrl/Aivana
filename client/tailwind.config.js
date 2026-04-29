/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Aivana Brand Palette
        cream: {
          50:  '#FEFDFB',
          100: '#FAFAF8',
          200: '#F5F4F0',
          300: '#EDECEA',
        },
        rose: {
          brand: '#E8506A',
          light: '#F2819A',
          dark:  '#C13558',
        },
        ink: {
          DEFAULT: '#1A1A2E',
          light:   '#2D2D44',
          muted:   '#6B7280',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        card:   '0 2px 16px 0 rgba(26,26,46,0.07)',
        'card-hover': '0 8px 32px 0 rgba(26,26,46,0.13)',
      },
    },
  },
  plugins: [],
};
