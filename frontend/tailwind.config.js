/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        pastel: {
          purple: '#ede9fe',
          pink:   '#fce7f3',
          green:  '#dcfce7',
          yellow: '#fef9c3',
          blue:   '#dbeafe',
          red:    '#fee2e2',
        },
        accent: {
          purple: '#a78bfa',
          pink:   '#f0abfc',
          green:  '#6ee7b7',
          yellow: '#fbbf24',
          blue:   '#60a5fa',
          red:    '#fb7185',
        }
      },
    },
  },
  plugins: [],
}