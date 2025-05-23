# PhotoSwipe V5 Gallery Component

This directory contains a React component implementation of PhotoSwipe v5 for creating responsive, touch-friendly image and video galleries with lightbox functionality.

## Features

- Responsive grid layout with customizable columns
- Category filtering with tab navigation
- Support for both images and videos
- Custom lightbox controls and animations
- Lazy loading for better performance
- Mobile-friendly touch gestures
- Customizable styles and layouts

## Installation

The component requires the `photoswipe` package:

```bash
npm install --save photoswipe
```

## Usage

### Basic Usage

```tsx
import { PhotoSwipeV5Gallery } from '@/components/travel/gallery';

// Define your gallery items
const galleryItems = [
  {
    id: '1',
    src: '/path/to/image.jpg',
    width: 1280,
    height: 853,
    alt: 'Image description',
    type: 'image',
    category: 'Nature'
  },
  // Add more items...
];

// Define categories (optional)
const categories = ['Nature', 'Architecture', 'People'];

// Render the gallery
const GalleryPage = () => {
  return (
    <div className="container mx-auto">
      <PhotoSwipeV5Gallery 
        items={galleryItems} 
        categories={categories} 
      />
    </div>
  );
};
```

### Video Support

To include videos in your gallery:

```tsx
const galleryItems = [
  // Regular image item
  {
    id: '1',
    src: '/path/to/image.jpg',
    width: 1280,
    height: 853,
    alt: 'Image description',
    type: 'image',
    category: 'Nature'
  },
  
  // Video item
  {
    id: 'v1',
    src: '/path/to/thumbnail.jpg', // Thumbnail image
    thumbnailSrc: '/path/to/thumbnail.jpg', // Optional, fallback to src if not provided
    videoSrc: '/path/to/video.mp4',
    width: 1280,
    height: 720,
    alt: 'Video description',
    type: 'video',
    category: 'Videos'
  }
];
```

### Customization

The component accepts several props for customization:

```tsx
<PhotoSwipeV5Gallery 
  items={galleryItems} 
  categories={categories}
  gridClassName="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3" // Custom grid layout
  itemClassName="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform" // Custom item styling
  activeButtonClassName="bg-green-600 text-white" // Active category button style
  inactiveButtonClassName="bg-gray-100 text-gray-800 hover:bg-gray-200" // Inactive category button style
/>
```

## Item Interface

Each gallery item should conform to the following interface:

```typescript
interface MediaItem {
  id: string;           // Unique identifier
  src: string;          // Image source URL (or thumbnail for videos)
  width: number;        // Original width of media
  height: number;       // Original height of media
  alt: string;          // Alt text description
  type: 'image' | 'video'; // Media type
  videoSrc?: string;    // Video source URL (for video items)
  thumbnailSrc?: string; // Optional separate thumbnail (fallback to src)
  category: string;     // Category for filtering
}
```

## Examples

### Masonry Layout

For a masonry-style layout, use CSS grid or a CSS framework like Tailwind CSS with a masonry plugin:

```tsx
<PhotoSwipeV5Gallery 
  items={galleryItems}
  gridClassName="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [&>a]:mb-4 [&>a]:inline-block [&>a]:w-full"
/>
```

### Windows Explorer Style

For a Windows Explorer-like grid with uniform sizes:

```tsx
<PhotoSwipeV5Gallery 
  items={galleryItems}
  gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
  itemClassName="bg-white border border-gray-200 rounded-md overflow-hidden hover:border-blue-500 focus:border-blue-500 transition-colors"
/>
```

## Browser Support

This component is compatible with all modern browsers. It uses PhotoSwipe v5, which supports:

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Android Chrome)

## Notes

- For performance reasons, make sure to provide the correct image dimensions in the `width` and `height` props
- Use the `loading="lazy"` attribute on images (already included in the component)
- The PhotoSwipe lightbox is initialized only once per component mount and properly cleaned up on unmount