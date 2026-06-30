/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["'Noto Kufi Arabic'", "'IBM Plex Sans Arabic'", 'sans-serif'],
        latin: ["'Inter'", 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand — fresh green food market
        brand: {
          50:  '#f0faf0',
          100: '#dcf0dc',
          200: '#bbe1bb',
          300: '#8ccb8c',
          400: '#57af57',
          500: '#2d9b5a', // primary accent
          600: '#1a6b3a', // primary dark
          700: '#15522d',
          800: '#0d2a0d',
          900: '#061406',
        },
        gold: {
          400: '#e0bf50',
          500: '#d4af37',
          600: '#c9a227', // accent gold
        },
        cream: {
          50:  '#fefdf7',
          100: '#faf6e8',
          200: '#f3ecd0',
        },
        ink: {
          900: '#0d1a0d',
          700: '#1a2a1a',
          500: '#4a6a4a',
          400: '#5a8a5a',
          300: '#7a9a7a',
        },
        danger:  '#c0392b',
        info:    '#3a7ab0',
      },
      boxShadow: {
        card:    '0 4px 24px rgba(29,107,58,0.08)',
        cardHov: '0 12px 40px rgba(29,107,58,0.18)',
        hero:    '0 32px 80px rgba(29,107,58,0.15)',
        ring:    '0 0 0 3px rgba(45,155,90,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg,#1a6b3a,#2d9b5a)',
        'gradient-gold':    'linear-gradient(135deg,#c9a227,#e0bf50)',
        'gradient-meadow':  'linear-gradient(180deg,#dcf0dc 0%,#f0faf0 60%,#fefdf7 100%)',
      },
      keyframes: {
        'fade-up':   { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in':   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'bounce-y':  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'spin-slow': { 'to': { transform: 'rotate(360deg)' } },
        'pulse':     { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
        'pulse-slow':{ '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
        'shimmer':   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'sway':      { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
        'drift':     { '0%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(8px,-12px)' }, '100%': { transform: 'translate(0,0)' } },
      },
      animation: {
        'fade-up':   'fade-up 0.7s ease both',
        'fade-in':   'fade-in 0.5s ease both',
        'bounce-y':  'bounce-y 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'pulse':     'pulse 2s infinite',
        'pulse-slow':'pulse-slow 3s ease-in-out infinite',
        'shimmer':   'shimmer 1.5s infinite',
        'sway':      'sway 8s ease-in-out infinite',
        'drift':     'drift 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
