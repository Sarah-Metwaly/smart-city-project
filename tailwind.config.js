
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'aman-dark': '#182B31',
        'aman-teal': '#1E3A46',
        'aman-blue': '#58717D',
        'aman-light': '#B4C3CC',
        'aman-black' : '#0A0E14',
        'aman-white': '#F4FEFE',
      }
    },
  },
  plugins: [],
}
