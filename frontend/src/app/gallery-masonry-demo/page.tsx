'use client';

import React from 'react';
import { PhotoSwipeMasonryGallery } from '@/components/travel/gallery';

// Sample gallery items with varying heights for better masonry effect
const galleryItems = [
  // Images with different aspect ratios
  {
    id: '1',
    src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Scenic mountain landscape',
    type: 'image' as const,
    category: 'Nature',
    aspectRatio: 0.666
  },
  {
    id: '2',
    src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Beach sunset',
    type: 'image' as const,
    category: 'Beach',
    aspectRatio: 0.666
  },
  {
    id: '3',
    src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    width: 1280,
    height: 1600, // Taller image
    alt: 'Historic temple',
    type: 'image' as const,
    category: 'Architecture',
    aspectRatio: 1.25
  },
  {
    id: '4',
    src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Vibrant city street',
    type: 'image' as const,
    category: 'Urban',
    aspectRatio: 0.666
  },
  {
    id: '5',
    src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    width: 1280,
    height: 1920, // Much taller image
    alt: 'Forest pathway',
    type: 'image' as const,
    category: 'Nature',
    aspectRatio: 1.5
  },
  {
    id: '6',
    src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Ancient ruins',
    type: 'image' as const,
    category: 'Architecture',
    aspectRatio: 0.666
  },
  {
    id: '7',
    src: '/images/real/pexels-nans1419-20519339-min.jpg',
    width: 1280,
    height: 1280, // Square image
    alt: 'Tropical beach',
    type: 'image' as const,
    category: 'Beach',
    aspectRatio: 1.0
  },
  {
    id: '8',
    src: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    width: 1280,
    height: 853,
    alt: 'City skyline',
    type: 'image' as const,
    category: 'Urban',
    aspectRatio: 0.666
  },
  
  // Video items
  {
    id: 'v1',
    src: '/images/real/pexels-travelerchitect-18736328-min.jpg', // Thumbnail image
    thumbnailSrc: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    videoSrc: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    width: 1280,
    height: 720,
    alt: 'Nature video',
    type: 'video' as const,
    category: 'Videos',
    aspectRatio: 0.563
  },
  {
    id: 'v2',
    src: '/images/real/pexels-kanishka-211910-679492-min.jpg', // Thumbnail image
    thumbnailSrc: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    videoSrc: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
    width: 1280,
    height: 720,
    alt: 'Travel video',
    type: 'video' as const,
    category: 'Videos',
    aspectRatio: 0.563
  }
];

// Define the categories
const categories = ['Nature', 'Beach', 'Architecture', 'Urban', 'Videos'];

export default function GalleryMasonryDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">PhotoSwipe Masonry Gallery Demo</h1>
      <p className="mb-8 text-gray-600">
        This gallery uses a masonry layout to create a more visually interesting grid. 
        Images with different aspect ratios are arranged to fit together like a puzzle.
      </p>
      
      <PhotoSwipeMasonryGallery 
        items={galleryItems} 
        categories={categories} 
        masonryClassName="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
        itemClassName="break-inside-avoid mb-4 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        activeButtonClassName="bg-teal-600 text-white"
        inactiveButtonClassName="bg-gray-100 text-gray-800 hover:bg-gray-200"
      />
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About the Masonry Layout</h2>
        <p className="mb-4">
          The masonry layout creates a Pinterest-like grid where items with different heights fit together without gaps. 
          This is achieved using CSS columns instead of CSS grid, allowing for a more dynamic arrangement of items.
        </p>
        <p>
          The gallery can be customized with different column counts, gap sizes, and item styles to match your design needs.
          All photos still use PhotoSwipe for the lightbox functionality when clicked.
        </p>
      </div>
    </div>
  );
}