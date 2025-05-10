/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-forest-green': '#2A4030',
        'earthy-brown': '#6D5D4B',
        'sunrise-orange': '#D97706',
        'misty-blue': '#A8B0B8',
        'vibrant-teal': '#14B8A6',
        'golden-ochre': '#F59E0B',
        'off-white': '#F8F6F2',
        'light-grey': '#E5E7EB',
        'dark-grey': '#374151',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'testimonial-pattern': "url('/images/testimonial-bg.jpg')",
      },
      height: {
        'screen-75': '75vh',
        'screen-85': '85vh',
      },
    },
  },
  plugins: [],
};