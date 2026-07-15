/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        }
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(139, 92, 246, 0.08), 0 2px 10px -1px rgba(139, 92, 246, 0.04)',
        'premium-hover': '0 10px 25px -3px rgba(139, 92, 246, 0.15), 0 4px 15px -2px rgba(139, 92, 246, 0.08)',
        'glass-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        'glass-dark': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
