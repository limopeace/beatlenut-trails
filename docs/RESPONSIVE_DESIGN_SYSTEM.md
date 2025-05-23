# BeatlenutTrails Responsive Design System

This document outlines the responsive design system for the BeatlenutTrails website, ensuring consistent experiences across all device sizes.

## Breakpoints

The website uses the following breakpoints, following Tailwind CSS defaults:

- **xs**: < 640px (Mobile phones)
- **sm**: 640px (Small tablets and large phones)
- **md**: 768px (Tablets and small laptops)
- **lg**: 1024px (Desktops and laptops)
- **xl**: 1280px (Large desktop screens)
- **2xl**: 1536px (Extra large screens)

## Core Principles

1. **Mobile-First Approach**: Base styles are for mobile, then enhanced for larger screens
2. **Fluid Typography**: Text scales proportionally across device sizes
3. **Responsive Spacing**: Consistent spacing scale that adjusts across breakpoints
4. **Flexible Layouts**: Grid and flex layouts that reflow appropriately for different screen sizes
5. **Accessible Navigation**: Usable navigation patterns for all device types
6. **Performance Optimization**: Optimized assets for different viewport sizes

## Implementation Guidelines

### Typography

| Element   | Mobile (Default) | Tablet (md)   | Desktop (lg)  |
|-----------|------------------|---------------|---------------|
| h1        | text-4xl (2.25rem) | text-5xl (3rem) | text-6xl (3.75rem) |
| h2        | text-3xl (1.875rem) | text-4xl (2.25rem) | text-5xl (3rem) |
| h3        | text-2xl (1.5rem) | text-3xl (1.875rem) | text-4xl (2.25rem) |
| h4        | text-xl (1.25rem) | text-2xl (1.5rem) | text-3xl (1.875rem) |
| Body text | text-base (1rem) | text-base (1rem) | text-lg (1.125rem) |
| Small     | text-sm (0.875rem) | text-sm (0.875rem) | text-base (1rem) |

### Spacing

Use consistent spacing with Tailwind classes:

- Extra small: `p-2` / `m-2` (0.5rem - 8px)
- Small: `p-4` / `m-4` (1rem - 16px)
- Medium: `p-6` / `m-6` (1.5rem - 24px)
- Large: `p-8` / `m-8` (2rem - 32px)
- Extra large: `p-12` / `m-12` (3rem - 48px)

Scale spacing down proportionally on mobile devices.

### Layout Containers

```jsx
// Main container
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content here */}
</div>
```

### Grid Layouts

Default pattern for responsive grids:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
  {/* Grid items */}
</div>
```

### Navigation

- **Mobile**: Hamburger menu with slide-in or dropdown pattern
- **Tablet/Desktop**: Horizontal menu
- Ensure touch targets are at least 44×44px on mobile

### Images

- Use `object-cover` with fixed aspect ratios
- Set appropriate width/height attributes
- Consider different resolutions with `srcset` for critical images
- Implementation: `<img className="w-full h-48 object-cover rounded-md" />`

### Components

#### Buttons

```jsx
// Primary button
<button className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-3 bg-forest-green text-pale-straw rounded-md">
  Button Text
</button>
```

#### Cards

```jsx
<div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
  <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
    <img 
      src="image.jpg" 
      alt="Description" 
      className="absolute inset-0 w-full h-full object-cover"
    />
  </div>
  <div className="p-4 sm:p-6 flex-grow">
    <h3 className="text-xl font-bold mb-2">Title</h3>
    <p className="text-gray-700">Description text</p>
  </div>
</div>
```

### Section Structure

Standard responsive section pattern:

```jsx
<section className="py-12 md:py-16 lg:py-20">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Section Title</h2>
      <p className="text-gray-600">Section description text</p>
    </div>
    
    {/* Section content */}
  </div>
</section>
```

## Page-Specific Considerations

### Home Page

- Hero: Full height on mobile with simplified content
- Features grid: 1 column on mobile, 2-3 columns on larger screens
- Testimonials: Single item on mobile, multiple on desktop

### Listing Pages

- Filter controls: Horizontal on desktop, collapsed/expandable on mobile
- Product grid: 1 column on mobile, 2-4 columns on larger screens

### Detail Pages

- Two-column layout on desktop (main content + sidebar)
- Single column stacked layout on mobile
- Image galleries: Grid on desktop, slider on mobile

### Contact Page

- Side-by-side form and contact info on desktop
- Stacked layout on mobile
- Map: Full width on all devices, but height adjusts

## Visual Example of Mobile-to-Desktop Transition

```
Mobile (<640px)         Tablet (768px-1023px)      Desktop (≥1024px)
+-----------------+     +---------------------+    +-----------------------------+
| HEADER          |     | HEADER              |    | HEADER                      |
+-----------------+     +---------------------+    +-----------------------------+
| HERO            |     | HERO                |    | HERO                        |
| Text            |     | Text                |    | Text            Image/Video |
| Button          |     | Image/Video         |    |                             |
|                 |     | Button              |    | Button                      |
+-----------------+     +---------------------+    +-----------------------------+
| Feature 1       |     | Feature 1 | Feature 2|    | Feature 1 | Feature 2 | F3 |
+-----------------+     +---------------------+    +-----------------------------+
| Feature 2       |     | Feature 3 | Feature 4|    | Feature 4 | Feature 5 | F6 |
+-----------------+     +---------------------+    +-----------------------------+
| Product Card    |     | Product   | Product  |    | Product | Product | Product|
+-----------------+     +---------------------+    +-----------------------------+
| Product Card    |     | Product   | Product  |    | Product | Product | Product|
+-----------------+     +---------------------+    +-----------------------------+
| FOOTER          |     | FOOTER              |    | FOOTER                      |
| Links           |     | Links   | Newsletter|    | About | Links | Contact | NL|
| Newsletter      |     |                     |    |                             |
+-----------------+     +---------------------+    +-----------------------------+
```

## Implementation Checklist

When implementing responsive design for each page/component:

1. Start with mobile layout
2. Add breakpoint-specific classes for larger screens
3. Test actual interactions on real devices
4. Verify text readability at all sizes
5. Ensure touch targets are adequately sized
6. Check for any horizontal scrolling issues
7. Verify images load appropriately
8. Test with throttled network conditions

## Performance Considerations

- Lazy load below-the-fold images
- Consider component-level code splitting
- Use appropriate image formats and compression
- Defer non-critical JavaScript
- Prioritize loading critical CSS

This design system will serve as the foundation for making all pages in the BeatlenutTrails website fully responsive.