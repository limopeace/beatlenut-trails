import React from 'react';
import PhotoSwipeGallery from './PhotoSwipeGallery';

// Example usage of the PhotoSwipeGallery component
const GalleryExample: React.FC = () => {
  // Sample gallery data
  const galleryTabs = [
    {
      label: 'All Destinations',
      images: [
        {
          src: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
          alt: 'Mountain landscape',
          width: 1200,
          height: 800,
          caption: 'Beautiful mountain landscape',
        },
        {
          src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
          alt: 'Beach sunset',
          width: 1200,
          height: 800,
          caption: 'Stunning beach sunset',
        },
        {
          src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
          alt: 'Desert view',
          width: 1200,
          height: 800,
          caption: 'Desert adventure',
        },
        {
          src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
          alt: 'Forest trail',
          width: 1200,
          height: 800,
          caption: 'Forest exploration',
        },
        {
          src: '/images/real/pexels-nans1419-20519339-min.jpg',
          alt: 'Tropical island',
          width: 1200,
          height: 800,
          caption: 'Tropical paradise getaway',
        },
        {
          src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg', 
          alt: 'Mountain lake',
          width: 1200,
          height: 800,
          caption: 'Pristine mountain lake',
        },
        {
          src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
          alt: 'Historic temple',
          width: 1200,
          height: 800,
          caption: 'Ancient temple ruins',
        },
        {
          src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
          alt: 'City skyline',
          width: 1200,
          height: 800,
          caption: 'Urban exploration',
        },
      ],
    },
    {
      label: 'Mountains',
      images: [
        {
          src: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
          alt: 'Mountain landscape',
          width: 1200,
          height: 800,
          caption: 'Beautiful mountain landscape',
        },
        {
          src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
          alt: 'Mountain lake',
          width: 1200,
          height: 800,
          caption: 'Pristine mountain lake',
        },
      ],
    },
    {
      label: 'Beaches',
      images: [
        {
          src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
          alt: 'Beach sunset',
          width: 1200,
          height: 800,
          caption: 'Stunning beach sunset',
        },
        {
          src: '/images/real/pexels-nans1419-20519339-min.jpg',
          alt: 'Tropical island',
          width: 1200,
          height: 800,
          caption: 'Tropical paradise getaway',
        },
      ],
    },
    {
      label: 'Cultural',
      images: [
        {
          src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
          alt: 'Historic temple',
          width: 1200,
          height: 800,
          caption: 'Ancient temple ruins',
        },
        {
          src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
          alt: 'City skyline',
          width: 1200,
          height: 800,
          caption: 'Urban exploration',
        },
      ],
    },
    {
      label: 'Videos',
      images: [
        {
          src: '/images/real/pexels-dizitalboost-11622977-min.jpg', // Thumbnail image
          alt: 'Sample video',
          width: 1280, 
          height: 720,
          caption: 'Sample travel video',
          isVideo: true,
          videoSrc: 'https://example.com/sample-video.mp4', // Replace with actual video URL
          thumbnail: '/images/real/pexels-dizitalboost-11622977-min.jpg',
        },
      ],
    },
  ];

  // Custom lightbox options
  const lightboxOptions = {
    showHideAnimationType: 'fade',
    bgOpacity: 0.9,
    arrowKeys: true,
    indexIndicatorSep: ' / ',
    preloaderDelay: 1000,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Destination Gallery</h1>
      
      <PhotoSwipeGallery 
        tabs={galleryTabs}
        className="mb-12"
        galleryId="destination-gallery"
        lightboxOptions={lightboxOptions}
      />
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Gallery Component Features</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>Responsive grid layout with consistent spacing</li>
          <li>Tabbed interface for different image categories</li>
          <li>High quality lightbox with PhotoSwipe 5</li>
          <li>Support for images and videos</li>
          <li>Image captions and hover effects</li>
          <li>Full keyboard navigation support</li>
          <li>Touch-friendly for mobile devices</li>
          <li>Customizable styling options</li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryExample;