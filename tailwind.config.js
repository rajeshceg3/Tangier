/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chalk-white': '#fdfbf7',
        'muted-indigo': '#3b4d61',
        'sandstone-beige': '#e6dfcf',
        'pale-atlantic-blue': '#aabbc3',
        'soft-dusk-amber': '#dcbfa6',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Placeholder for Humanist sans-serif
      },
    },
  },
  plugins: [],
}
