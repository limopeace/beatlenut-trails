/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#475841',
        'mountain-stone': '#8A9389',
        'trail-path': '#D6CFC3',
        'sky-blue': '#94B0C2',
        'sunset-orange': '#E8B087',
        'night-purple': '#6B667F',
        'charcoal': '#2A2A2A',
        'slate': '#556270',
        'fog': '#F0F2F1',
        'cloud': '#FFFFFF',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
        'accent': ['Playfair Display', 'serif'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        'quick': '150ms',
        'standard': '300ms',
        'deliberate': '500ms',
        'emphasis': '800ms',
      },
    },
  },
  plugins: [],
}