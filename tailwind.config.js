/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chalk-white': '#fffaf0',
        'muted-indigo': '#1e3651',
        'sandstone-beige': '#f2d3a1',
        'pale-atlantic-blue': '#4f8fc8',
        'soft-dusk-amber': '#ff9f43',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Placeholder for Humanist sans-serif
      },
    },
  },
  plugins: [],
}
