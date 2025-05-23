# PhotoSwipe v5 Integration

This document explains how the updated PhotoSwipeGalleryV5 component works with PhotoSwipe v5.

## Overview

PhotoSwipeGalleryV5 is a React component that provides a gallery using PhotoSwipe v5. It offers:

- A tabbed interface to organize images by category
- Support for both images and videos
- Smooth transitions and animations
- Captions for all gallery items
- Responsive design for all screen sizes

## Key Changes from v4 to v5

1. **Import Structure**:
   - PhotoSwipe v5 uses a different import structure 
   - The UI component is now included directly from the `photoswipe` package
   - The CSS path has changed from `/dist/photoswipe.css` to `/style.css`

2. **Initialization**:
   - The initialization process is now handled through PhotoSwipeLightbox
   - The gallery is linked via selector rather than creating PhotoSwipe instances directly
   - Configuration options have slightly different names

3. **DOM Structure**:
   - Images now need to be wrapped in `<a>` tags
   - Required data attributes: `data-pswp-width`, `data-pswp-height`
   - Optional attributes like `data-pswp-caption` for captions

4. **Event Handling**:
   - Event handling is done via the Lightbox API
   - Custom UI elements can be registered through `uiRegister` events

## How It Works

1. The component initializes PhotoSwipeLightbox with a reference to a gallery container
2. It sets up event listeners and UI customizations
3. HTML elements are structured with the proper data attributes
4. The lightbox handles opening and closing the gallery

## Usage Example

```jsx
// Import the component
import PhotoSwipeGalleryV5 from '@/components/travel/PhotoSwipeGalleryV5';

// Use it in your page/component
const Page = () => {
  return (
    <div>
      <h1>My Gallery Page</h1>
      <PhotoSwipeGalleryV5 />
    </div>
  );
};
```

## Customizing the Gallery

You can customize the gallery by modifying:

1. The `tabs` array to change the tab categories
2. The `galleryItems` object to add or modify images and videos
3. The styling via the classes applied to the gallery elements
4. The PhotoSwipe options in the `useEffect` hook that initializes the lightbox

## Dependencies

- PhotoSwipe v5.4.4 or higher
- React 18 or higher
- FontAwesome (for icons)

## Resources

- [PhotoSwipe v5 Documentation](https://photoswipe.com/)
- [PhotoSwipe GitHub Repository](https://github.com/dimsemenov/PhotoSwipe)