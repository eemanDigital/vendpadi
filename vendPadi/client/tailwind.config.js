/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1A1A2E',
        'navy-light': '#252542',
        'padi-green': '#25C866',
        'padi-green-dark': '#1fa652',
        gold: '#F5A623',
        'gold-light': '#FFD180'
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
