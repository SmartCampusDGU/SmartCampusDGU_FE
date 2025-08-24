/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        white: '#FFFFFF',
        'white-02': '#F6F6F6',
        black: '#000000',
        gray: '#7C7C7C',
        orange: '#DA5B00',
      },
    },
  },
  plugins: [],
}