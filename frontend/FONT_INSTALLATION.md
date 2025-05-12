# Font Installation Instructions

To complete the setup of fonts for this project, you'll need to download and install the Clash Display and Satoshi fonts.

## Font Files Needed

### Clash Display
1. Download Clash Display from [fontshare.com](https://www.fontshare.com/fonts/clash-display)
2. Extract the files from the downloaded archive
3. Place the following files in the `/public/fonts/Clash-Display/` directory:
   - ClashDisplay-Regular.woff2
   - ClashDisplay-Medium.woff2
   - ClashDisplay-Semibold.woff2
   - ClashDisplay-Bold.woff2

### Satoshi
1. Download Satoshi from [fontshare.com](https://www.fontshare.com/fonts/satoshi)
2. Extract the files from the downloaded archive
3. Place the following files in the `/public/fonts/Satoshi/` directory:
   - Satoshi-Regular.woff2
   - Satoshi-Medium.woff2
   - Satoshi-Bold.woff2

## Alternative Setup

If you're unable to download these fonts, you can modify the layout.tsx file to use similar Google Fonts instead:

```tsx
import { Inter, Outfit } from 'next/font/google';

// Use Inter as a replacement for Satoshi
const satoshi = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-satoshi',
});

// Use Outfit as a replacement for Clash Display
const clashDisplay = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-clash',
});
```

## What's Been Updated

1. Added font family definitions to Tailwind configuration
2. Set up font loading in the layout.tsx file
3. Updated all component headings to use the Clash Display font
4. Added a horizontal scrolling text component with Clash Display font
5. Fixed various styling issues throughout the application