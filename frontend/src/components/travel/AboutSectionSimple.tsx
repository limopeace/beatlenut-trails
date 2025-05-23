'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faUsers, faShield, faMountain, faRoute, faLeaf } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const AboutSectionSimple = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-green-700 text-xl md:text-2xl font-serif">About Us</span>
          <h2 className="text-3xl md:text-4xl text-green-800 font-semibold mb-4 mt-2">
            The BeatlenutTrails Story
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Your journey into the heart of Northeast India begins with experienced Army Veterans
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-700 mb-5 leading-relaxed">
              <span className="font-medium text-green-800">BeatlenutTrails</span> was founded by a team of Army veterans who fell in love with Northeast India's breathtaking landscapes and vibrant cultures during their service years. Our mission is to share these hidden gems with travelers seeking authentic experiences beyond the ordinary tourist paths.
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Our expert guides bring unparalleled knowledge of the region's terrain, cultures, and hidden treasures. From the living root bridges of Meghalaya to the monasteries of Arunachal Pradesh, we create journeys that connect travelers with the true essence of Northeast India.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                  <FontAwesomeIcon icon={faCompass} className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Expert Guidance</h4>
                  <p className="text-sm text-gray-600">Veteran-led expeditions</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                  <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Cultural Immersion</h4>
                  <p className="text-sm text-gray-600">Authentic local interactions</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                  <FontAwesomeIcon icon={faShield} className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Safe Travels</h4>
                  <p className="text-sm text-gray-600">Security with experienced guides</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                  <FontAwesomeIcon icon={faLeaf} className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Sustainable Tourism</h4>
                  <p className="text-sm text-gray-600">Eco-friendly practices</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Link 
                href="/packages" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center"
              >
                <FontAwesomeIcon icon={faRoute} className="w-4 h-4 mr-2" />
                Explore Our Packages
              </Link>
              <Link 
                href="/about" 
                className="bg-green-100 hover:bg-green-200 text-green-800 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center"
              >
                <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                Meet Our Team
              </Link>
            </div>
          </div>
          
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img 
              src="/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg" 
              alt="Northeast India Landscape" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-4">
                  <img
                    src="/images/temp/beatlenut-logo-dark.png" 
                    alt="BeatlenutTrails Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-green-800 text-sm">Veteran-Led</h4>
                  <p className="text-xs text-gray-600">Authentic Adventures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionSimple;