# Image Handling in Beatlenuts-GR

This document explains our approach to handling images throughout the application, focusing on preventing blank screenshots and ensuring a smooth user experience. It also includes configuration for external image domains to support features like the ESM Marketplace.

## Components Overview

We've created several enhanced image components to handle various scenarios and edge cases:

### 1. NextImage

`NextImage` is our primary image component, built on top of Next.js's native Image component with additional features:

- Loading state management
- Error handling with fallback images
- Shimmer effects during loading
- Aspect ratio preservation
- Layout shift prevention

```tsx
import NextImage from '../components/common/NextImage';

// Basic usage
<NextImage
  src="/images/actual-image.jpg"
  alt="Description"
  fallbackSrc="/images/placeholder.jpg"
/>

// With additional options
<NextImage
  src="/images/actual-image.jpg"
  alt="Description"
  fallbackSrc="/images/placeholder.jpg"
  containerClassName="custom-container-class"
  aspectRatio="16/9"
  shimmer={true}
  priority={true} // for LCP images
/>
```

### 2. ImageWithFallback

A simpler alternative to `NextImage` that focuses specifically on handling image loading failures:

```tsx
import ImageWithFallback from '../components/common/ImageWithFallback';

<ImageWithFallback
  src="/images/actual-image.jpg"
  alt="Description"
  fallbackSrc="/images/placeholder.jpg"
/>
```

### 3. ContentPlaceholder

A versatile placeholder component for loading states:

```tsx
import ContentPlaceholder from '../components/common/ContentPlaceholder';

// Basic loading placeholder
<ContentPlaceholder
  width="100%"
  height="300px"
  animated={true}
/>

// Image-specific placeholder
<ContentPlaceholder
  width="100%"
  height="300px"
  imageType={true}
  text="Loading image..."
/>
```

### 4. CreatePlaceholderImage

A utility for dynamically generating placeholder images:

```tsx
import { createPlaceholderImage } from '../components/common/CreatePlaceholderImage';

// Generate a data URL for a placeholder
const placeholderDataUrl = createPlaceholderImage({
  text: 'Product Image',
  width: 800,
  height: 600,
  bgColor: '#E2E8F0',
  textColor: '#718096'
});

// Use as fallback in NextImage
<NextImage
  src="/images/actual-image.jpg"
  alt="Description"
  fallbackSrc={placeholderDataUrl}
/>
```

## Best Practices

### 1. Prioritize Critical Images

For important above-the-fold images, use the `priority` prop:

```tsx
<NextImage
  src="/hero-image.jpg"
  alt="Hero"
  priority={true}
/>
```

### 2. Prevent Layout Shifts

Always specify dimensions or aspectRatio:

```tsx
// Either use fill with a container that has dimensions
<div style={{ height: '300px', position: 'relative' }}>
  <NextImage
    src="/image.jpg"
    alt="Description"
    fill
  />
</div>

// Or specify width and height
<NextImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// Or use aspectRatio
<NextImage
  src="/image.jpg"
  alt="Description"
  aspectRatio="16/9"
/>
```

### 3. Handle SSR and Hydration

For components that use client-side features of the image components:

```tsx
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

return (
  <div>
    {isClient ? (
      <NextImage src="..." alt="..." />
    ) : (
      <div className="bg-gray-200" style={{ aspectRatio: '16/9' }}></div>
    )}
  </div>
);
```

### 4. Generate Custom Placeholders

Use the placeholder generator tool at `/dev/placeholder-generator` during development to create custom placeholder images for different sections of the site.

## Placeholder Image Strategy

1. **Generic Fallbacks**: Use `/images/placeholder.jpg` as a generic fallback
2. **Specific Fallbacks**: Create category-specific placeholders (e.g., `/images/service-placeholder.jpg`)
3. **Dynamic Fallbacks**: For highly customized needs, use the `createPlaceholderImage` utility

## Implementation Examples

### Hero Section

```tsx
<NextImage
  src="/images/hero.jpg"
  alt="Hero"
  fallbackSrc="/images/hero-placeholder.jpg"
  containerClassName="absolute inset-0"
  fill
  priority={true}
  className="object-cover object-center"
/>
```

### Card Images

```tsx
<NextImage
  src={imageSrc}
  alt={imageAlt}
  fallbackSrc="/images/card-placeholder.jpg"
  containerClassName="h-full w-full"
  aspectRatio="4/3"
  className="object-cover rounded-t-lg"
  shimmer={true}
/>
```

### Image Gallery

```tsx
<div className="grid grid-cols-3 gap-4">
  {images.map((image) => (
    <NextImage
      key={image.id}
      src={image.src}
      alt={image.alt}
      width={300}
      height={200}
      fallbackSrc="/images/gallery-placeholder.jpg"
      shimmer={true}
    />
  ))}
</div>
```

## Debugging and Testing

To test image failure handling:
1. Navigate to the page with images
2. Open browser developer tools
3. Go to Network tab
4. Right-click on any image and select "Block request URL"
5. Refresh the page to see the fallback behavior

## External Domain Configuration

The project uses Next.js Image component which requires external domains to be explicitly configured. This has been set up in `next.config.js`:

```js
images: {
  domains: [
    'localhost', 
    'beatlenut-trails.com', 
    'picsum.photos', 
    'randomuser.me',
    'sample-videos.com',
    'example.com',
    'placehold.it',
    'placekitten.com',
    'place-hold.it',
    'placeimg.com',
    'ui-avatars.com',
    'source.unsplash.com'
  ],
},
```

This configuration allows using external images in Next.js Image components, which is particularly important for:

1. **ESM Marketplace**: Product images from picsum.photos
2. **User avatars**: Profile images from services like randomuser.me or ui-avatars.com
3. **Placeholder content**: Various placeholder services during development

If you encounter the error: "Invalid src prop (https://example.com/image.jpg) on `next/image`, hostname "example.com" is not configured under images in your `next.config.js`", you'll need to add the domain to this configuration.

## Additional Resources

- [Next.js Image Documentation](https://nextjs.org/docs/api-reference/next/image)
- [Web Vitals and Image Performance](https://web.dev/articles/image-optimization-basics)
- [Cumulative Layout Shift](https://web.dev/articles/cls)