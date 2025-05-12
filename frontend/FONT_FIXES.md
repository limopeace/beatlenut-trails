# Font Configuration Fixes

This document outlines the approach taken to fix font configuration issues in the BeatlenutTrails frontend.

## The Problem

The application was experiencing CSS errors related to font utility classes:

```
Error: The `font-opensans` class does not exist. 
If `font-opensans` is a custom class, make sure it is defined within a `@layer` directive.
```

## The Solution: Direct CSS Properties Instead of Tailwind Classes

Instead of using Tailwind utility classes for font families, we've implemented the following approach:

1. We removed font family definitions from `tailwind.config.js` to prevent conflicts with Next.js font module.

2. We use Next.js Font module to load and define font variables:
```tsx
// In layout.tsx
import { Montserrat, Open_Sans, Merriweather, Dancing_Script } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

// Apply font variables to the HTML element
<html lang="en" className={`${montserrat.variable} ${openSans.variable} ${merriweather.variable} ${dancingScript.variable}`}>
```

3. Apply fonts directly via CSS custom properties for base elements:
```css
/* In globals.css */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-montserrat), sans-serif;
  @apply font-bold;
}

.font-script {
  font-family: var(--font-dancing-script), cursive;
}
```

4. Apply fonts via inline styles in components (for targeted use):
```tsx
<h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
  {title}
</h3>
```

5. Apply body font via inline style in layout:
```tsx
<body className="min-h-screen flex flex-col bg-off-white text-dark-grey" 
      style={{ fontFamily: 'var(--font-opensans), sans-serif' }}>
```

## Benefits of This Approach

1. **Eliminates Tailwind Font Conflicts**: Avoids the need to configure Tailwind utility classes for fonts.
2. **Leverages Next.js Font System**: Uses Next.js font optimization for better performance.
3. **More Explicit**: Makes font usage more explicit in component code.
4. **Simpler Configuration**: Reduces complexity in Tailwind configuration.

## Components Updated

1. `src/app/layout.tsx` - Updated to use inline styles for body font
2. `src/styles/globals.css` - Updated to use CSS custom properties for fonts
3. `src/components/common/Card.tsx` - Updated to use inline styles for headings
4. `src/components/travel/FeaturedServices.tsx` - Updated to use inline styles for headings
5. `src/components/travel/FeaturedDestinations.tsx` - Updated to use inline styles for headings