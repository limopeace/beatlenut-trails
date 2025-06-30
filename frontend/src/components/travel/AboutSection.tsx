'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCompass, 
  faUsers, 
  faShield, 
  faLeaf, 
  faRoute, 
  faHandshake, 
  faMountain, 
  faLightbulb,
  faBookOpen,
  faMotorcycle,
  faStar,
  faMapMarkedAlt
} from '@fortawesome/free-solid-svg-icons';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import SectionContainer from '@/components/common/SectionContainer';

const AboutSection = () => {
  // Features data array
  const features = [
    {
      icon: faCompass,
      title: 'Expert Guidance',
      description: 'Veteran-led expeditions with deep local knowledge'
    },
    {
      icon: faUsers,
      title: 'Cultural Immersion',
      description: 'Authentic interactions with local communities'
    },
    {
      icon: faShield,
      title: 'Safe Travels',
      description: 'Security and expertise from military professionals'
    },
    {
      icon: faLeaf,
      title: 'Sustainable Tourism',
      description: 'Eco-friendly practices that preserve natural beauty'
    },
    {
      icon: faHandshake,
      title: 'Community Support',
      description: 'Empowering local communities through tourism'
    },
    {
      icon: faMountain,
      title: 'Adventure Focus',
      description: 'From gentle walks to challenging treks'
    },
    {
      icon: faBookOpen,
      title: 'Rich Heritage',
      description: 'Deep insights into Northeast India\'s diverse cultures'
    },
    {
      icon: faMotorcycle,
      title: 'Unique Transport',
      description: 'Specialized vehicle options for different terrains'
    },
    {
      icon: faStar,
      title: 'Premium Service',
      description: 'Attention to detail in every aspect of your journey'
    },
    {
      icon: faMapMarkedAlt,
      title: 'Hidden Gems',
      description: 'Access to lesser-known, breathtaking locations'
    }
  ];

  return (
    <SectionContainer
      background="moss-green"
      className="relative overflow-hidden py-8 sm:py-12 md:py-16"
      id="about"
    >
      {/* Decorative elements - adjusted for better mobile appearance */}
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 text-deep-forest opacity-5 transform rotate-45">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M42.7,-73.2C55.9,-65.7,67.7,-54.9,76.6,-41.4C85.5,-28,91.5,-12,92.3,4.5C93.1,21,88.7,38,77.8,48.2C67,58.4,49.8,61.8,34.7,66.5C19.7,71.2,6.7,77.2,-7.8,79.7C-22.4,82.1,-38.4,81,-48.2,72.1C-58,63.3,-61.5,46.8,-68.9,31.7C-76.2,16.6,-87.4,3,-87.5,-10.9C-87.7,-24.8,-77,-38.9,-65.2,-49.4C-53.5,-59.9,-40.7,-66.7,-28.1,-74.2C-15.5,-81.7,-3.1,-90,8.5,-88.1C20.1,-86.2,29.5,-80.8,42.7,-73.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="px-4 sm:px-6 md:px-8">
        <FadeIn direction="up" duration={0.8} className="flex flex-col items-center mb-12 sm:mb-16 md:mb-20 relative">
          {/* Decorative script heading */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 -rotate-6 hidden md:block">
            <span className="font-serif italic text-deep-forest text-4xl opacity-40">About Us</span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-clash font-bold text-deep-forest mb-5 sm:mb-6 text-center uppercase"
          >
            The Beatlenut Trails Story
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-pale-straw mb-5 sm:mb-6"></div>
          <p className="text-center text-deep-forest max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed">
            Your journey into the heart of Northeast India begins with experienced Army Veterans
          </p>
        </FadeIn>
        
        {/* Main content with overlap - improved for mobile */}
        <div className="relative">
          <FadeIn direction="up" duration={0.8} delay={0.2} className="bg-white rounded-lg shadow-2xl overflow-hidden relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Image for mobile (top position) */}
              <div className="md:col-span-5 h-48 sm:h-56 md:h-auto block md:hidden relative">
                <FadeIn direction="right" duration={0.8} delay={0.4}>
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Color overlay and effects */}
                    <div className="absolute inset-0 bg-forest-green/20 z-10 transition-opacity duration-300 hover:opacity-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 to-transparent z-10"></div>
                    
                    <img 
                      src="/images/temp/gurpreet.jpeg" 
                      alt="Gurpreet Singh - Founder at Kaziranga" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Decorative elements - smaller on mobile */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-pale-straw/60 z-20"></div>
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-pale-straw/60 z-20"></div>
                  </div>
                </FadeIn>
              </div>

              {/* Content - 7 columns */}
              <div className="md:col-span-7 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center mt-96 md:mt-0">
                <FadeIn direction="left" duration={0.7} delay={0.3}>
                  <p className="text-deep-forest/90 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base md:text-lg">
                    <span className="font-medium text-forest-green font-clash">Beatlenut Trails</span> was born out of a simple truth: that the most memorable journeys are those that change something within us.
                  </p>
                  <p className="text-deep-forest/90 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base md:text-lg">
                    We are <strong>an adventure travel company founded by a retired Indian Army Veteran</strong> and <strong>Hame Kurbah</strong>, a hospitality expert and native of the Northeast. With decades of discipline, grit, and wanderlust between us, we left conventional careers behind to build something far more personal — a soulful, high-touch travel outfit that curates <strong>luxury expeditions, long-distance cycling and biking tours, forest immersions, and sacred trails</strong> across India and beyond.
                  </p>
                </FadeIn>
                
                {/* Top 6 reasons to choose Beatlenut Trails */}
                <FadeIn direction="up" delay={0.6} className="mb-8 sm:mb-10">
                  <h4 className="text-sm sm:text-base md:text-lg text-forest-green font-medium mb-5 font-clash">Why Choose Beatlenut Trails:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                    {features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center group transition-all duration-300 hover:transform hover:translate-x-1">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-moss-green/20 group-hover:bg-moss-green/30 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 border border-forest-green/10">
                          <FontAwesomeIcon 
                            icon={feature.icon} 
                            className="w-4 h-4 sm:w-5 sm:h-5 text-forest-green" 
                          />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base font-medium text-deep-forest font-clash">{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>

                {/* CTA buttons - improved for mobile */}
                <FadeIn direction="up" delay={0.8} className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 mt-5 sm:mt-6">
                  <a href="/packages" className="w-full xs:w-auto bg-forest-green hover:bg-moss-green text-pale-straw px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center xs:justify-start">
                    <FontAwesomeIcon icon={faRoute} className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Explore Our Packages
                  </a>
                  <a href="/about" className="w-full xs:w-auto bg-pale-straw hover:bg-white text-forest-green px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center xs:justify-start">
                    <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Meet Our Team
                  </a>
                </FadeIn>
              </div>
              
              {/* Image - 5 columns - hidden on mobile, shown on desktop */}
              <div className="md:col-span-5 order-first md:order-last md:h-auto relative hidden md:block">
                <FadeIn direction="right" duration={0.8} delay={0.4}>
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Color overlay and effects */}
                    <div className="absolute inset-0 bg-forest-green/20 z-10 transition-opacity duration-300 hover:opacity-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 to-transparent z-10"></div>
                    
                    <img 
                      src="/images/temp/gurpreet.jpeg" 
                      alt="Gurpreet Singh - Founder at Kaziranga" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 left-4 w-20 h-20 border-t-4 border-l-4 border-pale-straw/60 z-20"></div>
                    <div className="absolute bottom-4 right-4 w-20 h-20 border-b-4 border-r-4 border-pale-straw/60 z-20"></div>
                  </div>
                </FadeIn>
                
                {/* Floating badge - properly positioned bottom right */}
                <FadeIn direction="up" duration={0.6} delay={1.0} className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 hidden md:block">
                  <div className="flex items-center">
                    <div className="w-12 h-12 mr-4">
                      <img
                        src="/images/temp/beatlenut-logo-dark.png" 
                        alt="BeatlenutTrails Logo" 
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
          
          {/* Decorative circles - hidden on small screens */}
          <div className="absolute top-1/4 -left-16 w-32 h-32 bg-pale-straw/30 rounded-full z-0 hidden md:block"></div>
          <div className="absolute bottom-1/4 -right-16 w-48 h-48 bg-pale-straw/30 rounded-full z-0 hidden md:block opacity-60"></div>
        </div>
        
        
        {/* Quote section with Founder Image - improved for mobile */}
        <FadeIn direction="up" duration={1} delay={0.5} className="mt-16 sm:mt-24 md:mt-32 max-w-4xl mx-auto text-center relative px-4 sm:px-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-pale-straw text-6xl sm:text-7xl md:text-9xl font-serif">"</span>
          </div>
          <div className="relative z-10">
            <p className="text-lg sm:text-xl md:text-2xl text-deep-forest font-serif italic mb-8 sm:mb-10 leading-relaxed">
              "Every journey should challenge the body, awaken the mind, and return you a little more alive."
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center">
              {/* Founder image with effects - smaller on mobile */}
              <div className="relative group mb-8 sm:mb-10 md:mb-0 md:mr-10">
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden border-3 sm:border-4 border-pale-straw relative z-10">
                  <div className="absolute inset-0 bg-forest-green mix-blend-multiply group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 to-transparent opacity-70"></div>
                  <img 
                    src="/images/temp/gurpreet.jpeg" 
                    alt="Gurpreet Singh - Founder" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 shadow-inner ring-6 sm:ring-8 ring-forest-green/10"></div>
                </div>
                
                {/* Decorative elements - scaled for mobile */}
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-full border-2 border-dashed border-pale-straw/40 z-0"></div>
                <div className="absolute w-6 sm:w-8 h-6 sm:h-8 bg-moss-green rounded-full -right-2 top-1/2 transform -translate-y-1/2 z-10"></div>
                <div className="absolute w-4 sm:w-6 h-4 sm:h-6 bg-pale-straw/40 rounded-full -left-2 bottom-6 sm:bottom-8 z-20"></div>
              </div>
              
              <FadeIn direction="left" duration={0.6} delay={1.0} className="text-center md:text-left">
                <h4 className="font-medium text-deep-forest font-clash text-lg sm:text-xl md:text-2xl uppercase mb-2 sm:mb-3">🪖 GURPREET SINGH</h4>
                <p className="text-xs sm:text-sm md:text-base text-deep-forest/70 mb-3 sm:mb-4">Founder | Expedition Leader | Veteran</p>
                <p className="text-xs sm:text-sm md:text-base text-deep-forest/80 max-w-md leading-relaxed">
                  A retired Indian Army officer with over 30 years of leadership and outdoor experience, Gurpreet is the compass behind every Beatlenut expedition. From commanding high-altitude missions to curating soulful motorcycle and cycling routes, he brings unmatched precision, safety, and storytelling to every trail.
                </p>
              </FadeIn>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionContainer>
  );
};

export default AboutSection;