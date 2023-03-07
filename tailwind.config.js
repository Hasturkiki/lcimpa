/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      "sidebar-logo": '#159'
    })
  },
  plugins: [],
}
