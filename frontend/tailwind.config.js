/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'clash': ['Clash Display', 'sans-serif'],
      },
      colors: {
        // Original palette
        'deep-forest-green': '#2A4030',
        'earthy-brown': '#6D5D4B',
        'sunrise-orange': '#D97706',
        'misty-blue': '#A8B0B8',
        'vibrant-teal': '#14B8A6',
        'golden-ochre': '#F59E0B',
        'off-white': '#F8F6F2',
        'light-grey': '#E5E7EB',
        'dark-grey': '#374151',
        
        // New design palette
        'pale-straw': '#EDF1D6',
        'moss-green': '#9DC08B',
        'forest-green': '#609966',
        'deep-forest': '#40513B',
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'testimonial-pattern': "url('/images/testimonial-bg.jpg')",
      },
      height: {
        'screen-75': '75vh',
        'screen-85': '85vh',
        '128': '32rem',  // 512px - for larger banners
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'fadeInUp': 'fadeInUp 0.6s ease-in-out',
        'slideInRight': 'slideInRight 0.5s ease-in-out',
        'slideInLeft': 'slideInLeft 0.5s ease-in-out',
        'marquee': 'marquee 30s linear infinite',
        'marquee-slower': 'marquee 60s linear infinite',
        'marquee-fast': 'marquee 15s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}