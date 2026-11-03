/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './script.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif']
      },
      colors: {
        brand: {
          lime: '#C2F052',
          limeHover: '#A8E81A',
          purple: '#D2CEFF',
          purpleDark: '#6C5CE7',
          dark: '#141517',
          cardDark: '#1E1E22',
          bg: '#F9FAFB',
        }
      },
      boxShadow: {
        'neo': '0px 10px 30px rgba(0, 0, 0, 0.06)',
        'neo-hover': '0px 20px 40px rgba(0, 0, 0, 0.12)',
        'lime-glow': '0px 8px 25px rgba(194, 240, 82, 0.4)',
        'purple-glow': '0px 12px 30px rgba(108, 92, 231, 0.25)',
      }
    }
  },
  plugins: [],
}