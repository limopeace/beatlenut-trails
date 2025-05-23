'use client';

import PhotoSwipeV5Gallery from './PhotoSwipeV5Gallery';

const PhotoSwipeV5Example = () => {
  // Sample gallery data with categories
  const galleryData = [
    {
      id: 'nature',
      name: 'Nature',
      items: [
        {
          src: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
          width: 1200,
          height: 800,
          alt: 'Beautiful mountain landscape',
          caption: 'Mountain view with snow caps',
        },
        {
          src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
          width: 1200,
          height: 800,
          alt: 'Forest landscape',
          caption: 'Dense forest with beautiful lighting',
        },
        {
          src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
          width: 1200,
          height: 800,
          alt: 'Serene lake view',
          caption: 'Calm waters reflecting mountains',
        },
        {
          src: '/images/real/pexels-nans1419-20519339-min.jpg',
          width: 1200,
          height: 800,
          alt: 'Sunset over mountains',
          caption: 'Golden hour in the mountains',
        },
      ],
    },
    {
      id: 'architecture',
      name: 'Architecture',
      items: [
        {
          src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
          width: 1200,
          height: 800,
          alt: 'Modern building',
          caption: 'Contemporary architecture with glass facade',
        },
        {
          src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
          width: 1200,
          height: 800,
          alt: 'Historic building',
          caption: 'Ancient temple with intricate carvings',
        },
        {
          src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
          width: 1200,
          height: 800,
          alt: 'City skyline',
          caption: 'Urban landscape at dusk',
        },
      ],
    },
    {
      id: 'videos',
      name: 'Videos',
      items: [
        {
          src: '/images/service-placeholder-1.jpg', // Thumbnail image
          width: 1200,
          height: 800,
          alt: 'Mountain timelapse',
          caption: 'Timelapse video of mountain sunrise',
          isVideo: true,
          videoSrc: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example video URL
        },
        {
          src: '/images/service-placeholder-2.jpg', // Thumbnail image
          width: 1200,
          height: 800,
          alt: 'Wildlife documentary',
          caption: 'Documentary about local wildlife',
          isVideo: true,
          videoSrc: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example video URL
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Our Photo Gallery</h2>
      <PhotoSwipeV5Gallery 
        categories={galleryData} 
        initialCategory="nature"
      />
    </div>
  );
};

export default PhotoSwipeV5Example;