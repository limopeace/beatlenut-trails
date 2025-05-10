# BeatlenutTrails Frontend

A responsive Next.js frontend for BeatlenutTrails travel website and Ex-Servicemen (ESM) marketplace.

## Overview

This project is a modern, responsive web application for BeatlenutTrails, featuring:

- Travel website promoting Northeast India destinations
- Ex-Servicemen marketplace for veterans to list products and services
- Fully responsive design using Tailwind CSS
- Modern UI with interactive components

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For utility-first styling
- **React**: For building UI components

## Project Structure

```
frontend/
├── public/             # Static assets
│   └── images/         # Image assets
├── src/                # Source code
│   ├── app/            # Next.js app router pages
│   │   ├── about/      # About page
│   │   ├── contact/    # Contact page
│   │   ├── esm-portal/ # ESM marketplace portal
│   │   └── ...         # Other page routes
│   ├── components/     # React components
│   │   ├── common/     # Shared UI components
│   │   ├── layout/     # Layout components (header, footer)
│   │   ├── travel/     # Travel website specific components
│   │   └── marketplace/# ESM marketplace specific components
│   └── styles/         # Global styles
└── ...                 # Config files
```

## Pages Implemented

1. **Homepage**: Featuring hero section, services, destinations, and testimonials
2. **About**: Company history, team members, mission and values
3. **Contact**: Contact form and information
4. **ESM Portal**: Ex-Servicemen marketplace landing page

## Components

### Layout Components
- `Header`: Responsive navigation with mobile menu
- `Footer`: Site footer with contact info and links

### Common Components
- `Button`: Reusable button component with variants
- `Card`: Reusable card component for various content
- `SectionTitle`: Consistent section headings

### Travel Components
- `Hero`: Hero banner with call-to-action
- `SearchBar`: Tour search functionality
- `FeaturedServices`: Services showcase
- `FeaturedDestinations`: Destinations showcase
- `Testimonial`: Customer testimonials
- `AboutSnippet`: About company snippet
- `ESMPromotion`: ESM marketplace promotion
- `CallToAction`: CTA section

## Design System

### Colors
- Deep Forest Green: #2A4030
- Sunrise Orange: #D97706
- Vibrant Teal: #14B8A6
- Off-White: #F8F6F2
- Light Grey: #E5E7EB
- Dark Grey: #374151
- Earthy Brown: #6D5D4B
- Misty Blue: #A8B0B8
- Golden Ochre: #F59E0B

### Typography
- Headings: Montserrat (bold/semi-bold)
- Body Text: Open Sans
- Accent: Merriweather (for quotes/testimonials)

## Getting Started

### Prerequisites
- Node.js 14.x or higher
- npm 6.x or higher

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Responsive Design

The site is fully responsive with breakpoints for:
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px

Key responsive features:
- Mobile-first approach
- Collapsible navigation menu on mobile
- Flexible grid layouts
- Responsive typography
- Optimized images

## Future Enhancements

- Services, destinations, and packages detail pages
- User authentication system
- ESM portal complete functionality
- Blog section
- Reels showcase

## Credits

Design inspired by:
- TripFinder template for travel website components
- Martfury template for ESM marketplace components
- Custom design system based on Northeast India landscapes