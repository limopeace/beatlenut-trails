# PhotoSwipeGallery Component

A responsive, tabbed photo gallery component with lightbox functionality built with PhotoSwipe v5 for Next.js applications.

## Features

- Windows Explorer style tile layout with a clean, consistent grid
- Tabbed interface for organizing images into categories
- PhotoSwipe v5 integration for an advanced lightbox experience
- Support for both images and videos
- Responsive design that works on all screen sizes
- Hover effects and image captions
- Proper cleanup in useEffect hooks
- Fully customizable via props and CSS

## Installation

The component uses PhotoSwipe v5, which should be installed in your project:

```bash
npm install photoswipe@5
```

## Usage

```tsx
import PhotoSwipeGallery from '@/components/travel/PhotoSwipeGallery';

const MyPage = () => {
  const galleryData = [
    {
      label: 'Category 1',
      images: [
        {
          src: '/path/to/image1.jpg',
          alt: 'Image description',
          width: 1200,
          height: 800,
          caption: 'Optional image caption',
        },
        // More images...
      ],
    },
    {
      label: 'Category 2',
      images: [
        // Images for this category...
      ],
    },
    {
      label: 'Videos',
      images: [
        {
          src: '/path/to/thumbnail.jpg',
          alt: 'Video description',
          width: 1280,
          height: 720,
          caption: 'Video caption',
          isVideo: true,
          videoSrc: '/path/to/video.mp4',
          thumbnail: '/path/to/thumbnail.jpg',
        },
        // More videos...
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Gallery</h1>
      
      <PhotoSwipeGallery 
        tabs={galleryData}
        className="my-custom-class"
        galleryId="my-unique-gallery"
        lightboxOptions={{
          bgOpacity: 0.9,
          showHideAnimationType: 'fade',
        }}
      />
    </div>
  );
};

export default MyPage;
```

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `tabs` | Array | Array of tab objects with label and images | Required |
| `className` | String | Additional CSS classes | `''` |
| `galleryId` | String | Unique ID for the gallery | `'photo-gallery'` |
| `lightboxOptions` | Object | Options for PhotoSwipe lightbox | `{}` |

### Tab Object

```ts
{
  label: string;
  images: GalleryImage[];
}
```

### GalleryImage Object

```ts
{
  src: string;          // URL of the image
  alt: string;          // Alt text for accessibility
  width: number;        // Original image width in pixels
  height: number;       // Original image height in pixels
  caption?: string;     // Optional caption (shown in lightbox and on hover)
  isVideo?: boolean;    // Flag to indicate this is a video (default: false)
  videoSrc?: string;    // URL to the video file (used when isVideo is true)
  thumbnail?: string;   // URL to a thumbnail image for videos
}
```

## Custom Styling

The component includes default styling in `PhotoSwipeGallery.css`, which you can customize as needed. The main CSS variables are:

```css
.photo-gallery {
  --gallery-gap: 0.5rem;               /* Gap between grid items */
  --gallery-border-radius: 0.5rem;     /* Border radius of items */
  --gallery-hover-scale: 1.03;         /* Scale factor on hover */
  --gallery-transition-duration: 300ms; /* Duration of animations */
}
```

## Lightbox Options

You can pass any PhotoSwipe options through the `lightboxOptions` prop. Some common options include:

| Option | Type | Description |
|--------|------|-------------|
| `bgOpacity` | Number | Background opacity (0-1) |
| `showHideAnimationType` | String | Animation type ('fade', 'zoom', 'none') |
| `spacing` | Number | Spacing between slides |
| `loop` | Boolean | Whether to loop back to first slide |
| `pinchToClose` | Boolean | Allow pinch to close gesture |
| `closeOnVerticalDrag` | Boolean | Allow vertical drag to close |

See the [PhotoSwipe documentation](https://photoswipe.com/options/) for all available options.