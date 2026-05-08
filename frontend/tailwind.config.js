/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8102E',
          dark: '#9B0C23',
        },
        secondary: '#1A1A2E',
        accent: '#F5A623',
      },
      fontFamily: {
        title: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
