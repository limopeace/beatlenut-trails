'use client';

import React from 'react';
import PhotoSwipeV5Gallery from '@/components/travel/PhotoSwipeV5Gallery';

// Sample gallery items
const galleryItems = [
  // Images
  {
    id: '1',
    src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Scenic mountain landscape',
    type: 'image' as const,
    category: 'Nature'
  },
  {
    id: '2',
    src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Beach sunset',
    type: 'image' as const,
    category: 'Beach'
  },
  {
    id: '3',
    src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Historic temple',
    type: 'image' as const,
    category: 'Architecture'
  },
  {
    id: '4',
    src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Vibrant city street',
    type: 'image' as const,
    category: 'Urban'
  },
  {
    id: '5',
    src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Forest pathway',
    type: 'image' as const,
    category: 'Nature'
  },
  {
    id: '6',
    src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Ancient ruins',
    type: 'image' as const,
    category: 'Architecture'
  },
  {
    id: '7',
    src: '/images/real/pexels-nans1419-20519339-min.jpg',
    width: 1280,
    height: 853,
    alt: 'Tropical beach',
    type: 'image' as const,
    category: 'Beach'
  },
  {
    id: '8',
    src: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    width: 1280,
    height: 853,
    alt: 'City skyline',
    type: 'image' as const,
    category: 'Urban'
  },
  
  // Video items - using sample videos for demonstration
  // In a real project, you would use actual video files
  {
    id: 'v1',
    src: '/images/real/pexels-travelerchitect-18736328-min.jpg', // Thumbnail image
    thumbnailSrc: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    videoSrc: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    width: 1280,
    height: 720,
    alt: 'Nature video',
    type: 'video' as const,
    category: 'Videos'
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
    category: 'Videos'
  }
];

// Define the categories
const categories = ['Nature', 'Beach', 'Architecture', 'Urban', 'Videos'];

export default function GalleryDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">PhotoSwipe V5 Gallery Demo</h1>
      <p className="mb-8 text-gray-600">
        Click on any image or video to open the lightbox gallery. Use the category tabs to filter content.
      </p>
      
      <PhotoSwipeV5Gallery items={galleryItems} categories={categories} />
      
      <div className="mt-12 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">About This Component</h2>
        <p>
          This gallery uses PhotoSwipe v5 to create a responsive, touch-friendly gallery with lightbox functionality.
          It supports both images and videos, with category filtering and a clean grid layout.
        </p>
      </div>
    </div>
  );
}