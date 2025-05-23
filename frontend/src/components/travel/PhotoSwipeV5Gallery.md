# PhotoSwipeV5Gallery Component

A React component that implements PhotoSwipe v5 with a clean tile layout and category navigation.

## Features

- Uses the latest PhotoSwipe v5 API
- Windows Explorer style tile layout
- Category tabs for easy navigation
- Properly handles videos (opens in new tab)
- Responsive grid layout for different screen sizes
- Proper cleanup when component unmounts
- Keyboard navigation support
- Animated transitions between categories

## Installation

Make sure PhotoSwipe v5 is installed:

```bash
npm install photoswipe@5
```

## Usage

```tsx
import { PhotoSwipeV5Gallery } from '@/components/travel';

// Define your gallery data
const galleryData = [
  {
    id: 'nature',
    name: 'Nature',
    items: [
      {
        src: '/path/to/image.jpg',
        width: 1200,
        height: 800,
        alt: 'Description of the image',
        caption: 'Optional caption text',
      },
      // More images...
    ],
  },
  {
    id: 'videos',
    name: 'Videos',
    items: [
      {
        src: '/path/to/thumbnail.jpg',
        width: 1200,
        height: 800,
        alt: 'Video title',
        caption: 'Video description',
        isVideo: true,
        videoSrc: 'https://youtube.com/watch?v=example',
      },
      // More videos...
    ],
  },
  // More categories...
];

// Use the component in your page
const GalleryPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
      <PhotoSwipeV5Gallery 
        categories={galleryData} 
        initialCategory="nature"
        className="my-custom-class"
      />
    </div>
  );
};

export default GalleryPage;
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `categories` | `GalleryCategory[]` | Yes | Array of gallery categories with items |
| `initialCategory` | `string` | No | ID of the category to show initially |
| `className` | `string` | No | Additional CSS classes for the gallery container |

## Types

```typescript
interface GalleryItem {
  src: string;       // URL of the image
  width: number;     // Original image width (important for PhotoSwipe)
  height: number;    // Original image height (important for PhotoSwipe)
  alt: string;       // Alternative text for the image
  caption?: string;  // Optional caption text shown on hover and in lightbox
  isVideo?: boolean; // Set to true for video items
  videoSrc?: string; // URL to the video (for video items)
}

interface GalleryCategory {
  id: string;        // Unique identifier for the category
  name: string;      // Display name for the category tab
  items: GalleryItem[]; // Array of items in this category
}
```

## Example

See `PhotoSwipeV5Example.tsx` for a complete usage example.