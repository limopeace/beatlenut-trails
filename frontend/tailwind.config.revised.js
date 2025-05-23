/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': '#1A3C34',
        'medium-green': '#2A644A',
        'light-green': '#518270',
        'orange': '#F4A261',
        'light-gray': '#F5F5F5',
        'dark-gray': '#333333',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'h1': '36px',
        'h2': '32px',
        'h3': '24px',
        'body': '16px',
        'small': '14px',
      },
      spacing: {
        'xs': '5px',
        'sm': '10px',
        'md': '20px',
        'lg': '40px',
        'xl': '60px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        'fast': '200ms',
        'medium': '300ms',
        'slow': '500ms',
      },
      gridTemplateColumns: {
        'footer': '2fr 1fr 1fr 2fr',
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(rgba(26, 60, 52, 0.6), rgba(26, 60, 52, 0.6)), url('/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg')",
        'cta-pattern': "linear-gradient(rgba(26, 60, 52, 0.7), rgba(26, 60, 52, 0.7)), url('/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg')",
        'gradient-green': 'linear-gradient(135deg, #1A3C34 0%, #518270 100%)',
      },
      height: {
        'hero': '80vh',
        'card-img': '250px',
      },
    },
  },
  plugins: [],
}