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
          // New "Dark Oliveness" Theme
          // Base: A rich, deep mossy green/olive (not pitch black)
          base: '#202620', 
          // Card: A lighter, more visible olive tone to separate content
          card: '#2A332A', 
        },
        gold: {
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
          accent: '#E8C772', // Slightly brighter gold to pop against the green
        }
      }
    },
  },
  plugins: [],
}