import PhotoSwipeV5Gallery from '../PhotoSwipeV5Gallery';
import PhotoSwipeVideoItem from '../PhotoSwipeVideoItem';
import PhotoSwipeMasonryGallery from '../PhotoSwipeMasonryGallery';

export {
  PhotoSwipeV5Gallery,
  PhotoSwipeVideoItem,
  PhotoSwipeMasonryGallery
};

// Types
export interface MediaItem {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  type: 'image' | 'video';
  videoSrc?: string;
  thumbnailSrc?: string;
  category: string;
  aspectRatio?: number; // Optional aspect ratio for masonry layout
}

export interface GalleryProps {
  items: MediaItem[];
  categories?: string[];
  gridClassName?: string;
  masonryClassName?: string;
  itemClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
}