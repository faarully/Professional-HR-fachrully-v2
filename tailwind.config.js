/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Kita paksa Comic Sans di urutan pertama
        sans: ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}