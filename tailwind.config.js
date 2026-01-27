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
          800: '#57534e', 
          900: '#292524', 
          950: '#1c1917', 
        },
        elegant: {
          // Lighter Olive Theme ("Dark Oliveness" but slightly lifted)
          base: '#242A24', // Lifted from #202620
          card: '#2E362E', // Lifted from #2A332A
        },
        gold: {
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
          accent: '#E8C772', 
        }
      }
    },
  },
  plugins: [],
}