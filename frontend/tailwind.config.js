/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Classy light theme palette
        paper: {
          DEFAULT: '#fbfaf6', // warm off-white page background
          100: '#ffffff',
          200: '#f3f0e9',
        },
        ink: {
          900: '#26241f', // primary text, near-black with warmth
          700: '#54514a', // body text
          500: '#8a877e', // muted text
          300: '#c9c4b8', // disabled / subtle text
          200: '#e6e1d6', // borders
          100: '#f1ede4', // subtle fills, hover backgrounds
        },
        signal: {
          DEFAULT: '#1f6f5c', // deep emerald
          dim: '#16524a',
          light: '#e4efe9',
        },
        alarm: {
          DEFAULT: '#8e2536', // deep wine red
          dim: '#6c1c29',
          light: '#f4e4e7',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
