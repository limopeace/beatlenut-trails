'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes, faImages, faVideo, faLeaf } from '@fortawesome/free-solid-svg-icons';

const VaaniGallery = () => {
  const [activeTab, setActiveTab] = useState('estate');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const tabs = [
    { id: 'estate', label: 'Estate Views' },
    { id: 'production', label: 'Tea Production' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'activities', label: 'Activities' }
  ];
  
  const galleryItems = {
    estate: [
      {
        id: 'e1',
        type: 'image',
        src: 'https://picsum.photos/id/137/800/600',
        alt: 'Aerial view of Vaani Greens tea gardens',
        caption: 'Aerial view of our estate during monsoon season'
      },
      {
        id: 'e2',
        type: 'image',
        src: 'https://picsum.photos/id/164/800/600',
        alt: 'Morning mist over tea plantation',
        caption: 'Morning mist gently rising over the tea gardens'
      },
      {
        id: 'e3',
        type: 'image',
        src: 'https://picsum.photos/id/1063/800/600',
        alt: 'Workers harvesting tea leaves',
        caption: 'Our skilled tea pluckers selecting only the finest leaves'
      },
      {
        id: 'e4',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - would be a real tea estate video
        thumbnail: 'https://picsum.photos/id/1053/800/600',
        alt: 'Video tour of the estate',
        caption: 'Take a virtual tour through our sprawling tea plantation'
      },
      {
        id: 'e5',
        type: 'image',
        src: 'https://picsum.photos/id/225/800/600',
        alt: 'Tea plantation landscape',
        caption: 'Perfectly manicured tea gardens stretching to the horizon'
      },
      {
        id: 'e6',
        type: 'image',
        src: 'https://picsum.photos/id/493/800/600',
        alt: 'Tea plants close-up',
        caption: 'Close-up view of our premium tea plant varieties'
      }
    ],
    production: [
      {
        id: 'p1',
        type: 'image',
        src: 'https://picsum.photos/id/433/800/600',
        alt: 'Tea leaves withering',
        caption: 'Freshly plucked leaves in the withering troughs'
      },
      {
        id: 'p2',
        type: 'image',
        src: 'https://picsum.photos/id/1060/800/600',
        alt: 'Tea rolling process',
        caption: 'Traditional rolling of tea leaves to release essential oils'
      },
      {
        id: 'p3',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://picsum.photos/id/1053/800/600',
        alt: 'Tea manufacturing process',
        caption: 'Watch our artisanal tea production process'
      },
      {
        id: 'p4',
        type: 'image',
        src: 'https://picsum.photos/id/137/800/600',
        alt: 'Tea sorting and grading',
        caption: 'Expert sorting and grading of finished tea'
      }
    ],
    accommodation: [
      {
        id: 'a1',
        type: 'image',
        src: 'https://picsum.photos/id/1053/800/600',
        alt: 'Heritage Bungalow Exterior',
        caption: 'Our colonial-era heritage bungalow'
      },
      {
        id: 'a2',
        type: 'image',
        src: 'https://picsum.photos/id/225/800/600',
        alt: 'Luxury Suite',
        caption: 'Spacious luxury suite with garden views'
      },
      {
        id: 'a3',
        type: 'image',
        src: 'https://picsum.photos/id/164/800/600',
        alt: 'Dining Room',
        caption: 'Elegant dining room serving tea-infused cuisine'
      }
    ],
    activities: [
      {
        id: 'ac1',
        type: 'image',
        src: 'https://picsum.photos/id/1063/800/600',
        alt: 'Tea Tasting Session',
        caption: 'Professional tea tasting session with our Tea Master'
      },
      {
        id: 'ac2',
        type: 'image',
        src: 'https://picsum.photos/id/1060/800/600',
        alt: 'Plucking Experience',
        caption: 'Visitors trying their hand at tea plucking'
      },
      {
        id: 'ac3',
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://picsum.photos/id/137/800/600',
        alt: 'Cultural Performance',
        caption: 'Traditional Assamese cultural performance'
      },
      {
        id: 'ac4',
        type: 'image',
        src: 'https://picsum.photos/id/493/800/600',
        alt: 'Nature Walk',
        caption: 'Guided nature walk around the estate'
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <FontAwesomeIcon icon={faImages} className="text-green-600 w-5 h-5" />
              <span className="text-green-600 font-serif italic text-xl">Visual Tour</span>
            </div>
            <h2 className="text-4xl font-serif font-medium text-green-800 mb-4 text-center">
              Experience Vaani Greens
            </h2>
            <div className="w-24 h-0.5 bg-green-600 mx-auto mb-6"></div>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
              Take a visual journey through our tea estate, from vibrant tea gardens to
              our meticulous production process and luxurious accommodations.
            </p>
          </motion.div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
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
            <motion.div
              key={item.id}
              className="relative rounded-xl overflow-hidden shadow-lg group h-64 md:h-80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
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
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <a 
                      href={item.src} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-full text-sm inline-flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
                    >
                      <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
                      Watch Video
                    </a>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <p className="text-white text-sm">{item.caption}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* "View More" Button */}
        <div className="mt-16 text-center">
          <a 
            href="/vaani-test/gallery"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faImages} className="w-4 h-4" />
            View Complete Gallery
          </a>
        </div>
      </div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
              <motion.img 
                key={images[activeImageIndex].id}
                src={images[activeImageIndex].src}
                alt={images[activeImageIndex].alt}
                className="max-w-full max-h-[85vh] object-contain mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="text-center mt-4 text-white">
                <p>{images[activeImageIndex].caption}</p>
                <p className="text-white/60 text-sm mt-2">
                  {activeImageIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Virtual Tour Badge */}
      <div className="fixed bottom-6 left-6 z-20 hidden md:block">
        <a 
          href="/vaani-test/virtual-tour"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-colors"
        >
          <FontAwesomeIcon icon={faLeaf} className="w-4 h-4" />
          <span className="font-medium">Take a Virtual Tour</span>
        </a>
      </div>
    </section>
  );
};

export default VaaniGallery;