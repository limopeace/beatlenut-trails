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
        // Primary forest green palette (monotone)
        'forest': {
          'deep': '#1A3129',
          'medium': '#2C4A3E',
          'light': '#4D6B5F',
        },
        // Accent colors
        'moss': '#8CA892',
        'fern': '#657F6F',
        'bark': '#5C4B3E',
        // Neutral colors
        'stone': '#F5F2ED',
        'pebble': '#E3E1DD',
        'slate': '#4D5456',
        'charcoal': '#2A2C2D',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
      height: {
        'screen-75': '75vh',
        'screen-85': '85vh',
        'screen-90': '90vh',
      },
      maxWidth: {
        'prose-wide': '80ch',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'soft': '0.25rem',
        'medium': '0.5rem',
      },
      boxShadow: {
        'soft': '0 4px 8px rgba(0, 0, 0, 0.05)',
        'medium': '0 6px 12px rgba(0, 0, 0, 0.08)',
        'strong': '0 10px 20px rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      backgroundImage: {
        'forest-gradient-v': 'linear-gradient(to bottom, rgba(26, 49, 41, 0.1), rgba(26, 49, 41, 0.9))',
        'forest-gradient-h': 'linear-gradient(to right, rgba(26, 49, 41, 0.8), rgba(26, 49, 41, 0.3))',
        'overlay-dark': 'linear-gradient(to bottom, transparent, rgba(26, 49, 41, 0.85))',
        'overlay-light': 'linear-gradient(to bottom, rgba(245, 242, 237, 0.85), transparent)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-in-out',
        'zoom-in': 'zoomIn 0.4s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
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
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate'),
            a: {
              color: theme('colors.forest.medium'),
              '&:hover': {
                color: theme('colors.forest.deep'),
              },
            },
            h1: {
              color: theme('colors.forest.deep'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.forest.medium'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.forest.medium'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '500',
            },
            h4: {
              color: theme('colors.forest.medium'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '500',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}