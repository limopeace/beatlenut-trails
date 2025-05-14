'use client';

import React from 'react';
import { WhatsAppButton } from '@/components/common';

// Import BeatlenutTrails components
import VideoHero from '@/components/travel/VideoHero';
import FeaturedDestinations from '@/components/travel/FeaturedDestinations';
import FeaturedServices from '@/components/travel/FeaturedServices';
import Testimonial from '@/components/travel/Testimonial';
import TravelPackages from '@/components/travel/TravelPackages';
import PhotoSwipeGallery from '@/components/travel/PhotoSwipeGallery';
import VideoPlayer from '@/components/travel/VideoPlayer';
import BikeRentals from '@/components/travel/BikeRentals';
import EnhancedMarqueeText from '@/components/travel/EnhancedMarqueeText';
import InstagramPlaceholder from '@/components/travel/InstagramPlaceholder';
import AboutSection from '@/components/travel/AboutSection';
import CallToAction from '@/components/travel/CallToAction';

// Import necessary styles
import '@/styles/globals.css';

// Main component
const Home = () => {
  // Gallery data
  const galleryTabs = [
    {
      label: 'Iconic Destinations',
      images: [
        {
          src: '/images/real/pexels-kanishka-211910-679492-min.jpg',
          alt: 'Living Root Bridge in Meghalaya',
          width: 1200,
          height: 800,
          caption: 'The famous living root bridges of Meghalaya'
        },
        {
          src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
          alt: 'Tawang Monastery',
          width: 1200,
          height: 800,
          caption: 'The majestic Tawang Monastery in Arunachal Pradesh'
        },
        {
          src: '/images/real/pexels-nans1419-20519339-min.jpg',
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
          src: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
          alt: 'Dawki River',
          width: 1200,
          height: 800,
          caption: 'Crystal clear waters of Dawki River in Meghalaya'
        },
        {
          src: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
          alt: 'Dzukou Valley',
          width: 1200,
          height: 800,
          caption: 'The breathtaking Dzukou Valley in Nagaland'
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
          src: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
          alt: 'Hornbill Festival',
          width: 1200,
          height: 800,
          caption: 'The vibrant Hornbill Festival of Nagaland'
        },
        {
          src: '/images/real/pexels-nans1419-20519339-min.jpg',
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
          src: '/images/real/pexels-dizitalboost-11622977-min.jpg',
          alt: 'One-horned Rhinoceros',
          width: 1200,
          height: 800,
          caption: 'The endangered one-horned rhinoceros in Kaziranga'
        },
        {
          src: '/images/real/pexels-travelerchitect-18736328-min.jpg',
          alt: 'Hoolock Gibbon',
          width: 1200,
          height: 800,
          caption: 'The rare Hoolock Gibbon in the forests of Assam'
        },
        {
          src: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
          alt: 'Elephant herd',
          width: 1200,
          height: 800,
          caption: 'Wild elephant herd crossing the grasslands'
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Fixed WhatsApp Contact Button */}
      <WhatsAppButton 
        template="general"
        source="homepage"
        position="fixed"
        size="md"
      />
      
      {/* Hero Section */}
      <VideoHero />
      
      {/* Featured Destinations Section */}
      <div id="destinations">
        <FeaturedDestinations />
      </div>
      
      {/* Horizontal scrolling text */}
      <EnhancedMarqueeText 
        phrases={[
          { text: "DISCOVER NORTHEAST" },
          { text: "AUTHENTIC EXPERIENCES", isHighlighted: true },
          { text: "LOCAL GUIDES" },
          { text: "UNFORGETTABLE JOURNEYS", isHighlighted: true },
          { text: "EXPLORE WILDLIFE" },
          { text: "CULTURAL IMMERSION", isHighlighted: true }
        ]}
      />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Bike Rentals Section */}
      <BikeRentals />
      
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
          tabs={galleryTabs}
          title="Our Gallery"
          subtitle="Explore breathtaking views and experiences from Northeast India"
        />
      </div>
      
      {/* Testimonials Section */}
      <Testimonial />
      
      {/* Call to Action Section */}
      <CallToAction 
        title="Ready to Explore Northeast India?"
        subtitle="Begin your journey with us today and discover the wonders of the Seven Sisters."
        buttonText="Plan Your Adventure"
        buttonLink="/contact"
        backgroundImage="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg"
      />
      
      {/* Instagram Feed Section */}
      <InstagramPlaceholder />
      
      {/* Video Section - Bottom atmospheric video loop */}
      <section className="w-full bg-deep-forest">
        <div className="max-w-[1920px] mx-auto relative">
          <div className="aspect-w-16 aspect-h-9">
            <VideoPlayer 
              src="/videos/14090435-hd_1920_1080_60fps.mp4" 
              autoplay={true}
              loop={true}
              muted={true}
              controls={false}
            />
          </div>
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-deep-forest/80 to-deep-forest/40 z-10"></div>
        </div>
      </section>
    </main>
  );
};

export default Home;