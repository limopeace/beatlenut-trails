'use client';

import React from 'react';
import { WhatsAppButton } from '@/components/common';

// Import BeatlenutTrails components
// import BeatlenutHero from '@/components/travel/BeatlenutHero';
import VideoHero from '@/components/travel/VideoHero';
import FeaturedDestinations from '@/components/travel/FeaturedDestinations';
import FeaturedServices from '@/components/travel/FeaturedServices';
import Testimonial from '@/components/travel/Testimonial';
import TravelPackages from '@/components/travel/TravelPackages';
import PhotoSwipeGallery from '@/components/travel/PhotoSwipeGallery';
import VideoPlayer from '@/components/travel/VideoPlayer';
import BikeRentalsSection from '@/components/travel/BikeRentalsSection';
import MarqueeText from '@/components/travel/MarqueeText';
import InstagramFeed from '@/components/travel/InstagramFeed';

// Import necessary styles
import '@/styles/globals.css';
import '@/styles/beatlenut-style.css';
import '@/styles/vaani-style.css';

// Main component
const Home = () => {
  return (
    <>
      {/* Fixed WhatsApp Contact Button */}
      <WhatsAppButton 
        template="general"
        source="homepage"
        position="fixed"
        size="md"
      />
      
      {/* Hero Section */}
      <VideoHero />
      
      {/* Original Hero Section - Commented Out
      <BeatlenutHero /> */}
      
      {/* Featured Destinations Section */}
      <div id="destinations">
        <FeaturedDestinations />
      </div>
      
      {/* Horizontal scrolling text */}
      <MarqueeText 
        phrases={[
          "Discover Northeast",
          "Authentic Experiences",
          "Local Guides",
          "Unforgettable Journeys"
        ]} 
        backgroundColor="bg-green-800"
      />
      
      {/* Bike Rentals Section */}
      <BikeRentalsSection />
      
      {/* Services Section */}
      <div id="services">
        <FeaturedServices />
      </div>
      
      {/* Tour Packages Section */}
      <div id="packages">
        <TravelPackages />
      </div>
      
      {/* Gallery Section */}
      <div id="gallery">
        <PhotoSwipeGallery 
          tabs={[
            {
              label: 'Iconic Destinations',
              images: [
                {
                  src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
                  alt: 'Living Root Bridge in Meghalaya',
                  width: 1200,
                  height: 800,
                  caption: 'The famous living root bridges of Meghalaya'
                },
                {
                  src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
                  alt: 'Tawang Monastery',
                  width: 1200,
                  height: 800,
                  caption: 'The majestic Tawang Monastery in Arunachal Pradesh'
                },
                {
                  src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
                  alt: 'Majuli River Island',
                  width: 1200,
                  height: 800,
                  caption: 'Majuli - The world\'s largest river island in Assam'
                },
                {
                  src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
                  alt: 'Kaziranga National Park',
                  width: 1200,
                  height: 800,
                  caption: 'The vast grasslands of Kaziranga National Park'
                },
                {
                  src: '/images/real/pexels-nans1419-20519339-min.jpg',
                  alt: 'Dawki River',
                  width: 1200,
                  height: 800,
                  caption: 'Crystal clear waters of Dawki River in Meghalaya'
                },
                {
                  isVideo: true,
                  thumbnail: '/images/real/pexels-kanishka-211910-679492-min.jpg',
                  videoSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
                  width: 1200,
                  height: 800,
                  alt: 'Dzukou Valley',
                  caption: 'Aerial tour of the breathtaking Dzukou Valley in Nagaland'
                }
              ]
            },
            {
              label: 'Cultural Encounters',
              images: [
                {
                  src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
                  alt: 'Bihu Dance Performance',
                  width: 1200,
                  height: 800,
                  caption: 'Colorful Bihu dance performance in Assam'
                },
                {
                  src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
                  alt: 'Hornbill Festival',
                  width: 1200,
                  height: 800,
                  caption: 'The vibrant Hornbill Festival of Nagaland'
                },
                {
                  src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
                  alt: 'Khasi Traditional Attire',
                  width: 1200,
                  height: 800,
                  caption: 'Khasi women in traditional attire in Meghalaya'
                }
              ]
            },
            {
              label: 'Wildlife',
              images: [
                {
                  src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
                  alt: 'One-horned Rhinoceros',
                  width: 1200,
                  height: 800,
                  caption: 'The endangered one-horned rhinoceros in Kaziranga'
                },
                {
                  src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
                  alt: 'Hoolock Gibbon',
                  width: 1200,
                  height: 800,
                  caption: 'The rare Hoolock Gibbon in the forests of Assam'
                },
                {
                  isVideo: true,
                  thumbnail: '/images/real/pexels-travelerchitect-18736328-min.jpg',
                  videoSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
                  width: 1200,
                  height: 800,
                  alt: 'Wildlife Safari',
                  caption: 'Wildlife safari experience in Manas National Park'
                },
                {
                  src: '/images/real/pexels-nans1419-20519339-min.jpg',
                  alt: 'Elephant herd',
                  width: 1200,
                  height: 800,
                  caption: 'Wild elephant herd crossing the grasslands'
                }
              ]
            }
          ]}
        />
      </div>
      
      {/* Testimonials Section */}
      <Testimonial />
      
      {/* Instagram Feed Section */}
      <InstagramFeed accessToken="YOUR_INSTAGRAM_ACCESS_TOKEN" />
      
      {/* Video Section */}
      <section className="w-full bg-black">
        <div className="max-w-[1920px] mx-auto">
          <div className="aspect-w-16 aspect-h-9">
            <VideoPlayer 
              src="/videos/14090435-hd_1920_1080_60fps.mp4" 
              autoplay={true}
              loop={true}
              muted={true}
              controls={false}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;