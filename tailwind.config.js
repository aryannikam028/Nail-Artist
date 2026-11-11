/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFF5F8',
          100: '#FFF0F5',
          200: '#FDE2EC',
          300: '#F8C8DC', // Blush Pink
          400: '#F3ADC9',
          500: '#EFA6C8', // Soft Rose
          600: '#DE7CA7',
          700: '#BD5082',
          800: '#8E2C58',
          900: '#57243B', // Deep Burgundy
          950: '#381324',
        },
        rosegold: {
          light: '#ECC8CE',
          DEFAULT: '#B76E79', // Rose Gold
          dark: '#934E59',
          glow: 'rgba(183, 110, 121, 0.35)',
        },
        pearl: '#FFF9FC',
        champagne: '#F5E6D3',
        lavender: {
          soft: '#E9DDF8',
          DEFAULT: '#D8C6F2',
        },
        burgundy: '#57243B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cinzel"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"MonteCarlo"', '"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(183, 110, 121, 0.18)',
        'luxury-lg': '0 20px 50px -12px rgba(87, 36, 59, 0.18)',
        'pink-glow': '0 0 35px rgba(248, 200, 220, 0.65)',
        'rosegold-glow': '0 0 25px rgba(183, 110, 121, 0.45)',
        'glass': '0 8px 32px 0 rgba(183, 110, 121, 0.12)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
