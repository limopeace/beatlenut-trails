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
        // New color palette based on client preference
        'mint': '#EDF1D6',       // Light mint/cream
        'sage': '#9DC08B',       // Muted sage green
        'forest': '#609966',     // Medium forest green (Primary)
        'deep-forest': '#40513B', // Dark forest green
        
        // Additional variations for UI depth
        'mint-light': '#F4F7E8',
        'mint-dark': '#DFE3C8',
        'sage-light': '#AECF9A',
        'sage-dark': '#8BAF7D',
        'forest-light': '#70A878',
        'forest-dark': '#508556',
        'deep-forest-light': '#4D604A',
        'deep-forest-dark': '#33402F',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
        'outfit': ['Outfit', 'sans-serif'],      // Modern, clean sans-serif
        'playfair': ['Playfair Display', 'serif'], // Elegant, dramatic serif
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
        'xl': '1rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 8px rgba(0, 0, 0, 0.05)',
        'medium': '0 6px 12px rgba(0, 0, 0, 0.08)',
        'strong': '0 10px 20px rgba(0, 0, 0, 0.12)',
        'inner-light': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(157, 192, 139, 0.5)',
        'forest-glow': '0 0 20px rgba(96, 153, 102, 0.6)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'forest-gradient-v': 'linear-gradient(to bottom, rgba(64, 81, 59, 0.1), rgba(64, 81, 59, 0.9))',
        'forest-gradient-h': 'linear-gradient(to right, rgba(64, 81, 59, 0.8), rgba(64, 81, 59, 0.3))',
        'overlay-dark': 'linear-gradient(to bottom, transparent, rgba(64, 81, 59, 0.85))',
        'overlay-light': 'linear-gradient(to bottom, rgba(237, 241, 214, 0.85), transparent)',
        'pattern-dots': 'radial-gradient(#9DC08B 2px, transparent 2px)',
        'pattern-lines': 'repeating-linear-gradient(45deg, #EDF1D6 0, #EDF1D6 1px, transparent 0, transparent 10px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-in-out',
        'slide-down': 'slideDown 0.6s ease-in-out',
        'slide-left': 'slideLeft 0.6s ease-in-out',
        'slide-right': 'slideRight 0.6s ease-in-out',
        'zoom-in': 'zoomIn 0.4s ease-in-out',
        'zoom-out': 'zoomOut 0.4s ease-in-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s infinite',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
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
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
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
      // Enhanced typography settings
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.deep-forest'),
            a: {
              color: theme('colors.forest'),
              '&:hover': {
                color: theme('colors.deep-forest'),
              },
            },
            h1: {
              color: theme('colors.deep-forest'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.forest'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.forest'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.forest'),
              fontFamily: theme('fontFamily.montserrat'),
              fontWeight: '600',
            },
            blockquote: {
              color: theme('colors.deep-forest'),
              borderLeftColor: theme('colors.sage'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.sage'),
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