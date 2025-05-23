# Website Redesign - Color Implementation Guide

This document outlines how we'll implement the new color palette to improve visual appeal, user engagement, and information hierarchy across key pages.

## Color Palette

| Color | Hex Code | Description | Primary Usage |
|-------|----------|-------------|---------------|
| Pale Straw | #EDF1D6 | Lightest - soft, warm beige | Primary light backgrounds, replacing white space |
| Moss Green | #9DC08B | Light Green - earthy, natural | Secondary/alternating section backgrounds, accents |
| Forest Green | #609966 | Medium Green - vibrant, lush | Primary CTAs, active states, important headlines |
| Deep Forest | #40513B | Darkest Green - rich, grounding | Primary text on light backgrounds, dark section backgrounds |

## General Design Principles

### Color Application
- **No more pure white backgrounds** - Replace with `pale-straw` (#EDF1D6) for all main content areas
- **Section alternation** - Alternate between `pale-straw` and `moss-green` backgrounds for visual rhythm
- **Text contrast** - Use `deep-forest` for text on light backgrounds, and `pale-straw` for text on dark backgrounds
- **Call-to-action buttons** - Primary: `forest-green`, Secondary: `deep-forest` with white/pale text
- **Dark sections** - Use `deep-forest` for footer and strong emphasis sections

### Visual Hierarchy
- **Primary headings** - `deep-forest` on light backgrounds, `pale-straw` on dark backgrounds
- **Secondary headings** - `forest-green` for emphasis
- **Important callouts** - Use `forest-green` background with `pale-straw` text

## Page-Specific Implementation

### Homepage
1. **VideoHero section** 
   - Keep video background with darker overlay
   - Update text to `pale-straw` for better contrast
   - Change CTA button to `forest-green`

2. **Featured Destinations**
   - Change background to `pale-straw`
   - Section heading in `deep-forest`
   - Cards with white background, `deep-forest` headings, and `forest-green` accents

3. **Marquee Text**
   - Background: `moss-green`
   - Text: `deep-forest`
   - Highlighted text: `forest-green` or white

4. **About Section**
   - Background: `pale-straw`
   - Card backgrounds: White
   - Headings: `deep-forest`
   - Feature icons: `forest-green`

5. **Bike Rentals Section**
   - Background: `moss-green`
   - Heading and subtitle in `deep-forest`
   - Feature cards with white backgrounds
   - CTA in `forest-green`

6. **Services Section**
   - Background: `pale-straw`
   - Cards with white backgrounds
   - Service icons in `forest-green`

7. **Packages Section**
   - Background: `moss-green`
   - Package cards with white backgrounds
   - Pricing in `forest-green`
   - CTA buttons in `deep-forest`

8. **Gallery Section**
   - Background: `pale-straw`
   - Gallery tabs in `forest-green` (active) and `deep-forest` (inactive)

9. **Testimonials Section**
   - Background: `deep-forest`
   - Text in `pale-straw`
   - Quotes and highlights in `moss-green`

10. **Instagram Feed**
    - Background: `pale-straw`
    - "Follow" button: Replace purple with `forest-green`

11. **Final Video Section**
    - Keep black background for contrast
    - Add subtle `deep-forest` border

### Contact Page

1. **Hero Section**
   - Background: `deep-forest`
   - Text in `pale-straw`
   - Visual separation with angled divider in `moss-green`

2. **Contact Info Section**
   - Background: `pale-straw`
   - Icons in `forest-green` circles
   - Headings in `deep-forest`

3. **Contact Form**
   - Card background: White
   - Form borders: `moss-green`
   - Labels in `deep-forest`
   - Submit button in `forest-green`
   - Focus states in `forest-green`

4. **Map Section**
   - Border top and bottom: `moss-green`
   - Map markers in `forest-green`

5. **FAQ Section**
   - Background: `pale-straw`
   - Question headings in `deep-forest`
   - FAQ cards with white backgrounds
   - Accent elements in `forest-green`

### About Page

1. **Hero Section**
   - Background: `deep-forest`
   - Text in `pale-straw`
   - Overlay gradient incorporating `moss-green`

2. **Our Journey Section**
   - Background: `pale-straw`
   - Timeline in `forest-green`
   - Milestone dots in `forest-green`
   - Year headings in `deep-forest`

3. **Team Section**
   - Background: `moss-green`
   - Team cards with white backgrounds
   - Names in `deep-forest`
   - Roles in `forest-green`

4. **Values Section**
   - Background: `deep-forest`
   - Value cards with semi-transparent `pale-straw` backgrounds
   - Headings in `pale-straw`
   - Icons in `moss-green`

5. **Mission/Vision Section**
   - Background: `pale-straw`
   - Headings in `deep-forest`
   - List icons in `forest-green`

6. **Call to Action**
   - Background: `forest-green`
   - Text in `pale-straw`
   - Buttons in `deep-forest` and white

## Component-Level Styling

### Buttons
- **Primary**: `forest-green` background with `pale-straw` text
- **Secondary**: `deep-forest` background with `pale-straw` text
- **Tertiary/Outline**: `forest-green` border with `forest-green` text, `pale-straw` hover background

### Cards
- White background
- `deep-forest` headings
- `forest-green` accents and icons
- Subtle shadows and hover effects

### Forms
- Input borders: `moss-green` (light)
- Focus states: `forest-green`
- Error states: Reddish tone
- Success messages: `forest-green` background with `pale-straw` text

### Navigation
- Background: `deep-forest`
- Text: `pale-straw`
- Active/hover: `forest-green`

## Implementation Strategy

1. First implement global color changes in the main layout and shared components
2. Then update each page section by section, starting with the homepage
3. Finally, refine component-level styling for consistent look and feel