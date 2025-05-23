# Frontend Architecture Documentation

**Last Updated: 20 May 2025**

## Overview

The Beatlenuts-GR frontend is built using Next.js, a React framework that provides server-side rendering, routing, and other powerful features. The frontend consists of three main sections:

1. **Travel Website**: Focused on showcasing travel experiences in Northeast India
2. **ESM Marketplace**: Platform for Ex-Servicemen to offer products and services
3. **Admin Panel**: Complete administrative interface for managing the platform

## Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form (planned)
- **API Integration**: Fetch API / Axios (planned)

## Directory Structure

```
frontend/
├── public/               # Static assets
│   ├── fonts/           # Custom fonts
│   └── images/          # Static images
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── about/       # About page
│   │   ├── contact/     # Contact page
│   │   ├── esm-portal/  # ESM Marketplace pages
│   │   ├── services/    # Services page
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   │   ├── common/      # Shared UI components
│   │   ├── layout/      # Layout components
│   │   ├── marketplace/ # ESM Marketplace components
│   │   └── travel/      # Travel website components
│   ├── styles/          # Global styles
│   └── types.d.ts       # TypeScript type definitions
└── config files         # Next.js, Tailwind, TypeScript configs
```

## Key Components

### Common Components

These are reusable UI components used throughout the application:

- **Button**: Multi-purpose button component with various styles
  - Props: variant, href, onClick, className, children, etc.
  - Variants: primary, secondary, tertiary

- **Card**: Content card with image, title, description
  - Props: title, description, imageSrc, href, footer, etc.

- **SectionTitle**: Consistent section headings with title and subtitle
  - Props: title, subtitle, className

### Layout Components

Components that define the overall page structure:

- **Header**: Global navigation with links to main sections
- **Footer**: Site-wide footer with links and contact information

### Travel Components

Components specific to the travel website section:

- **Hero**: Hero section with background image and call-to-action
- **SearchBar**: Travel search functionality
- **FeaturedDestinations**: Showcase of featured travel destinations
- **FeaturedServices**: Display of travel services offered
- **AboutSnippet**: Brief about section for the homepage
- **Testimonial**: Customer testimonials display
- **CallToAction**: Call-to-action section for conversions

### ESM Marketplace Components

Components specific to the ESM Marketplace:

- **ProductCard**: Card display for marketplace products
- **ServiceCard**: Card display for marketplace services
- **FilterSidebar**: Filter controls for product/service listings
- **SellerProfile**: ESM seller information display
- **RegistrationForm**: Multi-step form for seller registration

## Page Structure

### Travel Website Pages

- **Home Page** (`/`): Landing page showcasing travel offerings
  - Hero section
  - Search functionality
  - Featured destinations and services
  - About snippet
  - Testimonials
  - ESM promotion section
  - Call-to-action

- **About Page** (`/about`): Information about the company
  - Company history and mission
  - Team profiles
  - Core values
  - Timeline of company milestones

- **Services Page** (`/services`): Detailed travel services
  - Service listings with filtering
  - Service details with features
  - Custom experience section
  - Testimonials
  - Call-to-action

- **Contact Page** (`/contact`): Contact information and form
  - Contact form
  - Office information
  - FAQ section
  - Map integration (placeholder)

### ESM Marketplace Pages

- **ESM Portal Home** (`/esm-portal`): Marketplace landing page
  - Hero section with marketplace introduction
  - Featured products and services
  - Category browsing
  - How it works section
  - Testimonials from sellers
  - Call-to-action

- **Products Page** (`/esm-portal/products`): Product listings
  - Filter sidebar with category, price, seller filters
  - Product grid with search and sorting
  - Pagination controls
  - Call-to-action for seller registration

- **Services Page** (`/esm-portal/services`): Service listings
  - Filter sidebar with category, location filters
  - Service listings with search and sorting
  - Specialized service categories
  - Call-to-action for service providers

- **Seller Registration** (`/esm-portal/register`): Registration form
  - Multi-section form for personal info, military service, seller info
  - Document upload for verification
  - Registration process explanation
  - Support information

## Styling Architecture

The project uses Tailwind CSS with a customized theme:

### Custom Colors

```javascript
colors: {
  'deep-forest-green': '#2A4030',
  'earthy-brown': '#6D5D4B',
  'sunrise-orange': '#D97706',
  'misty-blue': '#A8B0B8',
  'vibrant-teal': '#14B8A6',
  'golden-ochre': '#F59E0B',
  'off-white': '#F8F6F2',
  'light-grey': '#E5E7EB',
  'dark-grey': '#374151',
}
```

### Custom Font Family

```javascript
fontFamily: {
  montserrat: ['Montserrat', 'sans-serif'],
  opensans: ['Open Sans', 'sans-serif'],
  merriweather: ['Merriweather', 'serif'],
}
```

### Component Classes

Tailwind CSS utility classes are organized into component classes in the `globals.css` file:

```css
@layer components {
  .btn {
    @apply px-6 py-3 rounded font-montserrat font-semibold transition-all duration-300 inline-block text-center;
  }
  
  .container-custom {
    @apply container mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden;
  }
  
  .section {
    @apply py-16 md:py-24;
  }
}
```

## Responsive Design

The frontend is fully responsive with multiple breakpoints:

- **Mobile**: Default styling (< 640px)
- **Small (sm)**: ≥ 640px
- **Medium (md)**: ≥ 768px
- **Large (lg)**: ≥ 1024px
- **Extra Large (xl)**: ≥ 1280px

Components use responsive classes to adapt to different screen sizes, primarily using Tailwind's responsive prefixes (sm:, md:, lg:, xl:).

## Future Enhancements

### Planned Components

1. **Authentication Components**:
   - Login form
   - Registration form
   - Password reset
   - Profile management

2. **E-commerce Components**:
   - Shopping cart
   - Checkout process
   - Order confirmation
   - Order history

3. **Interactive Elements**:
   - Image carousel
   - Modal dialogs
   - Toast notifications
   - Rating system

### Performance Optimizations

1. **Image Optimization**:
   - Implement Next.js Image component for all images
   - Configure proper image sizing and formats

2. **Component Splitting**:
   - Implement code splitting for larger components
   - Use dynamic imports for less frequently used components

3. **State Management**:
   - Implement context providers for global state
   - Add React Query for server state management

## Development Guidelines

1. **Component Creation**:
   - Create functional components with TypeScript
   - Use proper typing for all props
   - Export components as default

2. **Styling Approach**:
   - Use Tailwind utility classes directly in components
   - Create component classes in globals.css for repeating patterns
   - Use className props for component variations

3. **Responsive Design**:
   - Design mobile-first
   - Add responsive variants for larger screens
   - Test all components across breakpoints

4. **Accessibility**:
   - Include proper ARIA attributes
   - Ensure keyboard navigation
   - Maintain proper contrast ratios
   - Test with screen readers