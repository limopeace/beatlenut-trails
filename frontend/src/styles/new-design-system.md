# New Design System for BeatlenutTrails

## Color Palette

### Primary Colors
- `forest-deep: #1A3129` - Deep, rich forest green (darker base)
- `forest-medium: #2C4A3E` - Medium forest green (main brand color)
- `forest-light: #4D6B5F` - Lighter forest green (secondary)

### Accent Colors
- `moss-green: #8CA892` - Soft moss green for subtle accents
- `fern-green: #657F6F` - Muted fern green for text and secondary elements
- `bark-brown: #5C4B3E` - Deep bark brown for natural contrast

### Neutral Colors
- `stone-white: #F5F2ED` - Warm off-white for backgrounds
- `pebble-gray: #E3E1DD` - Subtle pebble gray for cards and sections
- `slate-gray: #4D5456` - Slate gray for text and borders
- `charcoal: #2A2C2D` - Deep charcoal for dark accents and text

### Transparent Gradients
- `forest-gradient-vertical: linear-gradient(to bottom, rgba(26, 49, 41, 0.1), rgba(26, 49, 41, 0.9))` 
- `forest-gradient-overlay: linear-gradient(to right, rgba(26, 49, 41, 0.8), rgba(26, 49, 41, 0.3))`

## Typography

### Primary Font: Montserrat
- Headings, Navigation, and CTAs
- Weights: 300 (light), 500 (medium), 700 (bold)

### Secondary Font: Merriweather
- Body text, quotes, and descriptive content
- Weights: 300 (light), 400 (regular)

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)
- 6xl: 3.75rem (60px)

## Spacing
- Consistent 8-point grid system
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)
- 4xl: 6rem (96px)

## New Component Styles

### Immersive Image Containers
- Full-width, edge-to-edge image displays
- Subtle parallax scrolling effect
- Image overlay gradients for text legibility
- Min-height: 85vh for hero sections, 50vh for featured sections

### Cards
- Subtle shadows and hover transitions
- Consistent radius: 0.5rem (8px)
- Hover scale: 1.02
- Transitions: 0.3s ease-in-out

### Buttons
- Primary: Solid forest-medium with white text
- Secondary: Transparent with border and forest-medium text
- Tertiary: Text-only with subtle underline on hover
- Border-radius: 0.25rem (4px)
- Hover states with scale and shadow effects

### Animations
- FadeIn: Subtle opacity transition with direction options
- ParallaxScroll: Varied scroll speeds for layered depth
- ImageZoom: Subtle zoom on image hover
- TextReveal: Character-by-character text reveal for headings

### Text Overlays
- Semi-transparent background panels
- Text shadow for improved readability on images
- Consistent padding: 1.5rem (24px)

### Micro-interactions
- Button hover effects with scale transformation
- Image hover effects with subtle zoom
- Form input focus states with border transitions
- Navigation hover effects with color transitions

## Component Hierarchy

### Layout Components
- FullBleedSection
- ContainedSection
- TwoColumnLayout
- ThreeColumnGrid
- ImageTextOverlay

### UI Components
- PrimaryButton / SecondaryButton
- TextInput / Select
- Card / FeatureCard
- Badge / Tag
- Testimonial
- ImageGallery
- DestinationCard
- ServiceCard
- HeroSection
- MarqueeText (Refined version)
- ScrollProgress
- NavigationBar
- ParallaxImage

## Responsive Approach
- Mobile-first with strategic breakpoints
- Consistent padding and margin adjustments
- Fluid typography scaling
- Image aspect ratio preservation
- Reduced animations on mobile for performance

## Animation Guidelines
- Subtle is better than obvious
- Shorter durations (0.3s-0.5s) for micro-interactions
- Longer durations (0.5s-1s) for page transitions
- Consistent easing functions (ease-in-out)
- Respect user preferences for reduced motion
- Performance optimization for mobile devices

## Implementation Notes
1. Use CSS variables for consistent theming
2. Implement with Tailwind custom configuration
3. Create reusable React components for consistent UI
4. Document component usage with examples
5. Ensure accessibility compliance throughout