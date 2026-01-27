/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      colors: {
        charcoal: {
          800: '#57534e', // stone-600 (Lighter borders)
          900: '#292524', // stone-800 (Cards - lighter than before)
          950: '#1c1917', // stone-900 (Main BG)
        },
        elegant: {
          base: '#272522', // A rich, warm dark grey
          card: '#322f2c', // Slightly lighter for cards
        },
        gold: {
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
          accent: '#E5C168', // Softer, more expensive looking gold
        }
      }
    },
  },
  plugins: [],
}