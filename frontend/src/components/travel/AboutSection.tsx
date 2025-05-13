'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faUsers, faShield, faMountain, faRoute, faLeaf } from '@fortawesome/free-solid-svg-icons';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import SectionContainer from '@/components/common/SectionContainer';

const AboutSection = () => {
  return (
    <SectionContainer
      background="moss-green"
      className="relative overflow-hidden"
      id="about"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 text-deep-forest opacity-5 transform rotate-45">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M42.7,-73.2C55.9,-65.7,67.7,-54.9,76.6,-41.4C85.5,-28,91.5,-12,92.3,4.5C93.1,21,88.7,38,77.8,48.2C67,58.4,49.8,61.8,34.7,66.5C19.7,71.2,6.7,77.2,-7.8,79.7C-22.4,82.1,-38.4,81,-48.2,72.1C-58,63.3,-61.5,46.8,-68.9,31.7C-76.2,16.6,-87.4,3,-87.5,-10.9C-87.7,-24.8,-77,-38.9,-65.2,-49.4C-53.5,-59.9,-40.7,-66.7,-28.1,-74.2C-15.5,-81.7,-3.1,-90,8.5,-88.1C20.1,-86.2,29.5,-80.8,42.7,-73.2Z" transform="translate(100 100)" />
        </svg>
      </div>
        <FadeIn direction="up" duration={0.8} className="flex flex-col items-center mb-12 relative">
          {/* Decorative script heading */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 -rotate-6 hidden md:block">
            <span className="font-serif italic text-deep-forest text-4xl opacity-40">About Us</span>
          </div>
          
          <h2 
            className="text-4xl font-clash font-bold text-deep-forest mb-4 text-center uppercase"
          >
            The Beatlenut-Trails Story
          </h2>
          <div className="w-24 h-0.5 bg-pale-straw mb-4"></div>
          <p className="text-center text-deep-forest max-w-3xl">
            Your journey into the heart of Northeast India begins with experienced Army Veterans
          </p>
        </FadeIn>
        
        {/* Main content with overlap */}
        <div className="relative">
          <FadeIn direction="up" duration={0.8} delay={0.2} className="bg-white rounded-lg shadow-2xl overflow-hidden relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Content - 7 columns */}
              <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                <FadeIn direction="left" duration={0.7} delay={0.3}>
                  <p className="text-deep-forest/90 mb-5 leading-relaxed">
                    <span className="font-medium text-forest-green font-clash">beatlenut-trails</span> was founded by a team of Army veterans who fell in love with Northeast India's breathtaking landscapes and vibrant cultures during their service years. Our mission is to share these hidden gems with travelers seeking authentic experiences beyond the ordinary tourist paths.
                  </p>
                  <p className="text-deep-forest/90 mb-8 leading-relaxed">
                    Our expert guides bring unparalleled knowledge of the region's terrain, cultures, and hidden treasures. From the living root bridges of Meghalaya to the monasteries of Arunachal Pradesh, we create journeys that connect travelers with the true essence of Northeast India.
                  </p>
                </FadeIn>
                
                {/* Features */}
                <StaggerContainer className="grid grid-cols-2 gap-6 mb-8" delay={0.5} staggerChildren={0.1}>
                  <StaggerItem className="flex items-start">
                    <span className="bg-moss-green/30 p-3 rounded-full text-forest-green mr-4">
                      <FontAwesomeIcon icon={faCompass} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-forest-green mb-1 font-clash uppercase text-sm">Expert Guidance</h4>
                      <p className="text-sm text-deep-forest/80">Veteran-led expeditions</p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem className="flex items-start">
                    <span className="bg-moss-green/30 p-3 rounded-full text-forest-green mr-4">
                      <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-forest-green mb-1 font-clash uppercase text-sm">Cultural Immersion</h4>
                      <p className="text-sm text-deep-forest/80">Authentic local interactions</p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem className="flex items-start">
                    <span className="bg-moss-green/30 p-3 rounded-full text-forest-green mr-4">
                      <FontAwesomeIcon icon={faShield} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-forest-green mb-1 font-clash uppercase text-sm">Safe Travels</h4>
                      <p className="text-sm text-deep-forest/80">Security with experienced guides</p>
                    </div>
                  </StaggerItem>
                  
                  <StaggerItem className="flex items-start">
                    <span className="bg-moss-green/30 p-3 rounded-full text-forest-green mr-4">
                      <FontAwesomeIcon icon={faLeaf} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-forest-green mb-1 font-clash uppercase text-sm">Sustainable Tourism</h4>
                      <p className="text-sm text-deep-forest/80">Eco-friendly practices</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
                
                {/* CTA buttons */}
                <FadeIn direction="up" delay={0.8} className="flex flex-wrap gap-4 mt-4">
                  <a href="/packages" className="bg-forest-green hover:bg-moss-green text-pale-straw px-8 py-3 rounded-md text-sm font-medium transition-all duration-300 flex items-center">
                    <FontAwesomeIcon icon={faRoute} className="w-4 h-4 mr-2" />
                    Explore Our Packages
                  </a>
                  <a href="/about" className="bg-pale-straw hover:bg-white text-forest-green px-8 py-3 rounded-md text-sm font-medium transition-all duration-300 flex items-center">
                    <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                    Meet Our Team
                  </a>
                </FadeIn>
              </div>
              
              {/* Image - 5 columns */}
              <div className="md:col-span-5 order-first md:order-last h-64 md:h-auto relative">
                <FadeIn direction="right" duration={0.8} delay={0.4}>
                  <img 
                    src="/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg" 
                    alt="Northeast India Landscape" 
                    className="w-full h-full object-cover"
                  />
                </FadeIn>
                
                {/* Floating badge - properly positioned bottom right */}
                <FadeIn direction="up" duration={0.6} delay={1.0} className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 hidden md:block">
                  <div className="flex items-center">
                    <div className="w-12 h-12 mr-4">
                      <img 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQAAQMAAABF07nAAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAABixJREFUeJztwQENAAAAwqD3T20PBxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+wcGmAAAAAElTkSuQmCC" 
                        alt="BeatlenutTrails Mountain Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 text-sm font-clash uppercase">Veteran-Led</h4>
                      <p className="text-xs text-gray-600">Authentic Adventures</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </FadeIn>
          
          {/* Decorative circle */}
          <div className="absolute top-1/4 -left-16 w-32 h-32 bg-pale-straw/30 rounded-full z-0 hidden md:block"></div>
          <div className="absolute bottom-1/4 -right-16 w-48 h-48 bg-pale-straw/30 rounded-full z-0 hidden md:block opacity-60"></div>
        </div>
        
        {/* Quote section */}
        <FadeIn direction="up" duration={1} delay={0.5} className="mt-20 max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-pale-straw text-9xl font-serif">"</span>
          </div>
          <div className="relative z-10">
            <p className="text-xl md:text-2xl text-deep-forest font-serif italic mb-6">
              "Northeast India isn't just a destination; it's a transformation. Our mission is to guide travelers safely through this magical land, creating memories that last a lifetime."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <FadeIn direction="right" duration={0.6} delay={0.9} className="w-16 h-16 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                <img 
                  src="/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg" 
                  alt="Company Founder" 
                  className="w-full h-full object-cover"
                />
              </FadeIn>
              <FadeIn direction="left" duration={0.6} delay={1.0} className="text-left">
                <h4 className="font-medium text-deep-forest font-clash">MAJOR VIKRAM SINGH (RETD.)</h4>
                <p className="text-sm text-deep-forest/70">Founder & Chief Experience Officer</p>
              </FadeIn>
            </div>
          </div>
        </FadeIn>
    </SectionContainer>
  );
};

export default AboutSection;