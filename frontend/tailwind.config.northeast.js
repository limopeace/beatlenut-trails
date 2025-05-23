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
        // Primary Colors (Nature-Inspired)
        'forest': {
          'deep': '#2A4030',      // Deep forest green - reflects dense rainforests
          'medium': '#3B5E45',    // Medium forest green - for main elements
          'light': '#4D7A5A',     // Light forest green - for hover states
        },
        'misty': {
          'dark': '#8999A6',      // Dark misty blue - mimics dense fog
          'medium': '#A8B0B8',    // Medium misty blue - for subtle accents
          'light': '#CDD3D8',     // Light misty blue - for backgrounds
        },
        'earth': {
          'dark': '#5A4B3C',      // Dark earthy brown - for deep accents
          'medium': '#6D5D4B',    // Medium earthy brown - for text and borders
          'light': '#8A7A67',     // Light earthy brown - for hover states
        },
        
        // Accent Colors (Vibrant Pops)
        'golden': {
          'dark': '#D97706',      // Dark golden - for button hover
          'medium': '#F59E0B',    // Medium golden - for CTAs, highlights
          'light': '#FBBF24',     // Light golden - for accents
        },
        'teal': {
          'dark': '#0D9488',      // Dark teal - for emphasis
          'medium': '#14B8A6',    // Medium teal - for interactive elements
          'light': '#2DD4BF',     // Light teal - for hover states
        },
        
        // Neutral Colors
        'canvas': {
          'white': '#F8F6F2',     // Off-white - for backgrounds, cards
          'light': '#E6E2D9',     // Light canvas - for subtle backgrounds
          'medium': '#D4CEC2',    // Medium canvas - for borders
        },
        'ink': {
          'light': '#4B5563',     // Light ink - for secondary text
          'medium': '#374151',    // Medium ink - for body text
          'dark': '#1F2937',      // Dark ink - for headings
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'caption': ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        'xs': '5px',
        'sm': '10px',
        'md': '20px',
        'lg': '40px',
        'xl': '60px',
        '2xl': '80px',
        '3xl': '120px',
      },
      maxWidth: {
        'prose-narrow': '45ch',
        'prose': '65ch',
        'prose-wide': '80ch',
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'medium': '0 6px 12px rgba(0, 0, 0, 0.08)',
        'strong': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'teal-glow': '0 0 15px rgba(20, 184, 166, 0.5)',
        'golden-glow': '0 0 15px rgba(245, 158, 11, 0.5)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      backgroundImage: {
        'misty-overlay': 'linear-gradient(to bottom, rgba(168, 176, 184, 0.3), transparent)',
        'forest-overlay': 'linear-gradient(to bottom, rgba(42, 64, 48, 0.1), rgba(42, 64, 48, 0.9))',
        'forest-overlay-light': 'linear-gradient(to bottom, rgba(42, 64, 48, 0.01), rgba(42, 64, 48, 0.2))',
        'leaf-pattern': 'radial-gradient(#2A4030 2px, transparent 2px)',
        'paper-texture': 'url("/textures/paper-texture.png")',
        'watercolor': 'linear-gradient(to bottom, rgba(248, 246, 242, 0.9), rgba(109, 93, 75, 0.1))',
        'horizontal-divider': 'linear-gradient(to right, transparent, #A8B0B8, transparent)',
      },
      height: {
        'hero': '85vh',
        'hero-tall': '95vh',
        'card-img': '250px',
        'card-img-lg': '350px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'slide-left': 'slideLeft 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
        'zoom-in': 'zoomIn 0.6s ease-out forwards',
        'zoom-out': 'zoomOut 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'misty-fade': 'mistyFade 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        zoomOut: {
          '0%': { transform: 'scale(1.05)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        mistyFade: {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 0.9 },
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur-sm': 'blur(4px)',
        'blur': 'blur(8px)',
        'blur-md': 'blur(12px)',
        'blur-lg': 'blur(16px)',
        'blur-xl': 'blur(24px)',
        'blur-2xl': 'blur(40px)',
        'blur-3xl': 'blur(64px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}