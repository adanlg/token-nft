/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rowdies', 'sans-serif'],
      },
      width: {
        '7/8': '87.5%',
      }
  
    },
  },
  plugins: [],
}