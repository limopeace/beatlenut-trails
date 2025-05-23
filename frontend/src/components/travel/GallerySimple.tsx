'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes, faImages, faVideo, faMountain } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const GallerySimple = () => {
  const [activeTab, setActiveTab] = useState('destinations');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const tabs = [
    { id: 'destinations', label: 'Iconic Destinations' },
    { id: 'experiences', label: 'Unique Experiences' },
    { id: 'culture', label: 'Cultural Encounters' },
    { id: 'wildlife', label: 'Wildlife' }
  ];
  
  const galleryItems = {
    destinations: [
      {
        id: 'd1',
        type: 'image',
        src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
        alt: 'Living Root Bridge in Meghalaya',
        caption: 'The famous living root bridges of Meghalaya'
      },
      {
        id: 'd2',
        type: 'image',
        src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
        alt: 'Tawang Monastery',
        caption: 'The majestic Tawang Monastery in Arunachal Pradesh'
      },
      {
        id: 'd3',
        type: 'image',
        src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
        alt: 'Majuli River Island',
        caption: 'Majuli - The world\'s largest river island in Assam'
      },
      {
        id: 'd4',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - would be a real travel video
        thumbnail: '/images/real/pexels-kanishka-211910-679492-min.jpg',
        alt: 'Dzukou Valley video tour',
        caption: 'Aerial tour of the breathtaking Dzukou Valley in Nagaland'
      },
      {
        id: 'd5',
        type: 'image',
        src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
        alt: 'Kaziranga National Park',
        caption: 'The vast grasslands of Kaziranga National Park, home to the one-horned rhinoceros'
      },
      {
        id: 'd6',
        type: 'image',
        src: '/images/real/pexels-nans1419-20519339-min.jpg',
        alt: 'Dawki River',
        caption: 'Crystal clear waters of Dawki River in Meghalaya'
      }
    ],
    experiences: [
      {
        id: 'e1',
        type: 'image',
        src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
        alt: 'Camping in Dzukou Valley',
        caption: 'Camping under the stars in Dzukou Valley'
      },
      {
        id: 'e2',
        type: 'image',
        src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
        alt: 'River Rafting in Arunachal Pradesh',
        caption: 'White water rafting in the mighty Brahmaputra river'
      },
      {
        id: 'e3',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnail: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
        alt: 'Tea garden tour',
        caption: 'Tour of heritage tea estates in Assam'
      },
      {
        id: 'e4',
        type: 'image',
        src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
        alt: 'Trekking in Arunachal Pradesh',
        caption: 'Trekking through the untouched wilderness of Arunachal Pradesh'
      }
    ],
    culture: [
      {
        id: 'c1',
        type: 'image',
        src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
        alt: 'Bihu Dance Performance',
        caption: 'Colorful Bihu dance performance in Assam'
      },
      {
        id: 'c2',
        type: 'image',
        src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
        alt: 'Hornbill Festival',
        caption: 'The vibrant Hornbill Festival of Nagaland'
      },
      {
        id: 'c3',
        type: 'image',
        src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
        alt: 'Khasi Traditional Attire',
        caption: 'Khasi women in traditional attire in Meghalaya'
      }
    ],
    wildlife: [
      {
        id: 'w1',
        type: 'image',
        src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
        alt: 'One-horned Rhinoceros',
        caption: 'The endangered one-horned rhinoceros in Kaziranga'
      },
      {
        id: 'w2',
        type: 'image',
        src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
        alt: 'Hoolock Gibbon',
        caption: 'The rare Hoolock Gibbon in the forests of Assam'
      },
      {
        id: 'w3',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnail: '/images/real/pexels-travelerchitect-18736328-min.jpg',
        alt: 'Wildlife Safari',
        caption: 'Wildlife safari experience in Manas National Park'
      },
      {
        id: 'w4',
        type: 'image',
        src: '/images/real/pexels-nans1419-20519339-min.jpg',
        alt: 'Elephant herd',
        caption: 'Wild elephant herd crossing the grasslands'
      }
    ]
  };
  
  const openLightbox = (index) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = ''; // Re-enable scrolling
  };
  
  const nextImage = () => {
    const images = galleryItems[activeTab].filter(item => item.type === 'image');
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    const images = galleryItems[activeTab].filter(item => item.type === 'image');
    setActiveImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const images = galleryItems[activeTab].filter(item => item.type === 'image');
  const currentItems = galleryItems[activeTab];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FontAwesomeIcon icon={faImages} className="text-green-600 w-5 h-5" />
              <span className="text-green-600 font-serif italic text-xl">Photo Gallery</span>
            </div>
            <h2 className="text-3xl md:text-4xl text-green-800 font-semibold mb-4">
              Explore Northeast India
            </h2>
            <div className="w-24 h-0.5 bg-green-600 mx-auto mb-6"></div>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
              Take a visual tour through the breathtaking landscapes, vibrant cultures, and unforgettable experiences awaiting you in Northeast India.
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item, index) => (
            <div
              key={item.id}
              className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-80"
            >
              {item.type === 'image' ? (
                <>
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
                    onClick={() => openLightbox(images.findIndex(img => img.id === item.id))}
                  >
                    <p className="text-white text-sm mb-2">{item.caption}</p>
                    <button className="bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-full text-sm inline-flex items-center justify-center gap-2 w-full hover:bg-white/30 transition-colors">
                      <FontAwesomeIcon icon={faImages} className="w-4 h-4" />
                      View Larger
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img 
                    src={item.thumbnail} 
                    alt={item.alt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faVideo} className="text-white w-16 h-16 opacity-80" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                    <p className="text-white text-sm mb-2">{item.caption}</p>
                    <button className="bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-full text-sm inline-flex items-center justify-center gap-2 w-full hover:bg-white/30 transition-colors">
                      <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
                      Play Video
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* "View More" Button */}
        <div className="mt-12 text-center">
          <Link 
            href="/gallery"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faImages} className="w-4 h-4" />
            View Complete Gallery
          </Link>
        </div>
      </div>
      
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button 
            className="absolute top-4 right-4 text-white p-2 z-10"
            onClick={closeLightbox}
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
            onClick={prevImage}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
            onClick={nextImage}
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
          </button>
          
          <div className="max-w-6xl max-h-full p-4 overflow-hidden">
            <img 
              src={images[activeImageIndex].src}
              alt={images[activeImageIndex].alt}
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
            
            <div className="text-center mt-4 text-white">
              <p>{images[activeImageIndex].caption}</p>
              <p className="text-white/60 text-sm mt-2">
                {activeImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Virtual Tour Badge */}
      <div className="fixed bottom-6 left-6 z-20 hidden md:block">
        <Link 
          href="/virtual-tour"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-colors"
        >
          <FontAwesomeIcon icon={faMountain} className="w-4 h-4" />
          <span className="font-medium">Take a Virtual Tour</span>
        </Link>
      </div>
    </section>
  );
};

export default GallerySimple;