'use client';

import React from 'react';
import { motion } from 'framer-motion';

const VaaniLocation = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif font-medium text-green-800 mb-2">Location & Directions</h2>
          <div className="w-24 h-0.5 bg-green-600 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <motion.div 
            className="rounded-lg overflow-hidden shadow-lg h-96 lg:h-auto"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://picsum.photos/id/28/800/600" 
              alt="Location map" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Directions */}
          <motion.div 
            className="p-8 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-serif font-medium text-green-800 mb-6">Getting Here</h3>
            
            <div className="mb-6">
              <h4 className="font-medium text-lg text-green-700 mb-2">Vaani Greens Tea Estate, Assam</h4>
              <p className="text-gray-700 mb-4">
                XYZ Tea Garden, Near Jorhat <br />
                Golaghat District, Assam 785107 <br />
                India
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg text-green-700 mb-2">Airport</h4>
                <p className="text-gray-700">
                  45 km from Lokpriya Gopinath Bordoloi International Airport, Guwahati (Airport Code: GAU)
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-lg text-green-700 mb-2">Local Transport</h4>
                <p className="text-gray-700">
                  SUVs and Cars from Guwahati Railway Station, Airport transportation available on request.
                </p>
              </div>
            </div>

            <button className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full inline-flex items-center transition-all duration-300 transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VaaniLocation;