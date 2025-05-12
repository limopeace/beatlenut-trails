# Font Setup for BeatlenutTrails Frontend

## Google Fonts Implementation

To simplify development and ensure consistent rendering across all environments, we've implemented Google Fonts instead of local font files:

1. **Outfit** - Used as an elegant alternative to Clash Display for headings and titles
2. **Space Grotesk** - Used as a modern alternative to Satoshi for body text

These fonts are loaded directly from Google Fonts using Next.js's built-in font optimization system, which provides:
- Automatic optimization
- Zero layout shift
- Improved performance
- No external network requests

## Font Implementation Details

The fonts are configured in `src/app/layout.tsx`:

```tsx
import { Space_Grotesk, Outfit } from 'next/font/google';

// Define the fonts
// Use Outfit as a modern, clean alternative to Clash Display
const clashDisplay = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-clash',
});

// Use Space Grotesk as a modern, clean alternative to Satoshi
const satoshi = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-satoshi',
});
```

## Usage in Components

Fonts are applied using inline CSS rather than Tailwind classes to avoid configuration issues:

1. **Clash Display Alternative (Outfit)** - Used for all headings and titles:
   ```jsx
   <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-clash), sans-serif' }}>Heading Text</h2>
   ```

2. **Satoshi Alternative (Space Grotesk)** - Used for body text:
   ```jsx
   <p style={{ fontFamily: 'var(--font-satoshi), sans-serif' }}>Body text content</p>
   ```

## New Horizontal Scrolling Text Feature

We've added a new MarqueeText component that displays scrolling text statements like "COME TRAVEL. FEEL FREE." with Outfit (Clash alternative) font between sections on the homepage. The component:

- Uses Framer Motion for smooth animations
- Features alternating text colors (white and sunrise-orange)
- Creates a dynamic, eye-catching visual element
- Is fully responsive on all device sizes

## Further Customization

If you'd like to use actual Clash Display and Satoshi fonts in the future:

1. Download the font files from [fontshare.com](https://www.fontshare.com/)
2. Place them in the appropriate directories in `/public/fonts/`
3. Update `layout.tsx` to use `localFont` instead of Google Fonts

However, the current Google Font implementation provides an excellent visual aesthetic that closely matches the design intent while being much simpler to implement and maintain.