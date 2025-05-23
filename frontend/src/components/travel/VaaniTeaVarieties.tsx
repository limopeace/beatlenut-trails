'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const VaaniTeaVarieties = () => {
  const varieties = [
    {
      id: 1,
      name: "White Tea",
      description: "Our rarest offering, white tea undergoes minimal processing, preserving its delicate flavor and natural antioxidants.",
      benefits: ["Anti-aging properties", "Heart health support", "Low caffeine content"],
      image: "/images/real/pexels-kanishka-211910-679492-min.jpg",
      color: "bg-amber-50",
      textColor: "text-amber-900"
    },
    {
      id: 2,
      name: "Green Tea",
      description: "Harvested during the early morning hours and processed the same day to maintain its vibrant character and health benefits.",
      benefits: ["Metabolism boost", "Stress relief", "Rich in antioxidants"],
      image: "/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg",
      color: "bg-green-50",
      textColor: "text-green-900"
    },
    {
      id: 3,
      name: "Black Tea",
      description: "Fully oxidized to develop a rich, robust flavor profile with notes of malt, honey, and spice.",
      benefits: ["Energy boost", "Digestive aid", "Heart health"],
      image: "/images/real/pexels-travelerchitect-18736328-min.jpg",
      color: "bg-orange-50",
      textColor: "text-orange-900"
    }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      {/* Background leaf decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-green-900">
          <path d="M42.7,-73.2C55.9,-65.7,67.7,-54.9,76.6,-41.4C85.5,-28,91.5,-12,92.3,4.5C93.1,21,88.7,38,77.8,48.2C67,58.4,49.8,61.8,34.7,66.5C19.7,71.2,6.7,77.2,-7.8,79.7C-22.4,82.1,-38.4,81,-48.2,72.1C-58,63.3,-61.5,46.8,-68.9,31.7C-76.2,16.6,-87.4,3,-87.5,-10.9C-87.7,-24.8,-77,-38.9,-65.2,-49.4C-53.5,-59.9,-40.7,-66.7,-28.1,-74.2C-15.5,-81.7,-3.1,-90,8.5,-88.1C20.1,-86.2,29.5,-80.8,42.7,-73.2Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-green-900">
          <path d="M48.8,-76.4C62.8,-68.9,73.9,-55.4,79.1,-40.2C84.3,-25.1,83.6,-8.4,79.3,6.2C75,20.8,67.1,33.2,57.5,44.3C47.9,55.3,36.7,65,23.4,72.6C10.1,80.2,-5.3,85.8,-19.6,83.2C-34,80.6,-47.4,69.9,-57.3,57.2C-67.3,44.5,-73.8,29.8,-76.7,14.1C-79.5,-1.7,-78.7,-18.4,-71.4,-31C-64.2,-43.5,-50.4,-51.8,-37.2,-59.9C-23.9,-68,-11.9,-75.9,2.2,-79.6C16.4,-83.4,34.9,-83.9,48.8,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-green-600 font-serif italic text-lg block mb-3">Discover</span>
          <h2 className="text-4xl font-serif font-medium text-green-800 mb-4">Our Signature Tea Collection</h2>
          <div className="w-24 h-0.5 bg-green-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Carefully cultivated on our estate's rolling hills, Vaani Greens' signature teas capture 
            the unique terroir of Northeast India's pristine environment.
          </p>
        </motion.div>

        <div className="space-y-40 md:space-y-64 mt-20 mb-40">
          {varieties.map((variety, index) => (
            <div key={variety.id} className="relative">
              {/* Decorative circle */}
              <div 
                className={`absolute ${
                  index % 2 === 0 ? 'right-0 md:-right-20' : 'left-0 md:-left-20'
                } top-1/2 -translate-y-1/2 w-64 h-64 ${variety.color} rounded-full opacity-50 z-0`}
              ></div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                {/* Image section - alternating left/right */}
                <div className={`${index % 2 === 1 ? 'md:order-first' : 'md:order-last'}`}>
                  <div className="relative">
                    {/* Main image */}
                    <div className="relative rounded-xl overflow-hidden shadow-xl h-96">
                      <img 
                        src={variety.image}
                        alt={`${variety.name} Tea`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-left-6' : '-right-6'} w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white`}>
                      <span className="font-bold text-xl">{variety.id}</span>
                    </div>
                    
                    {/* Overlapping tag */}
                    <div 
                      className={`absolute -top-4 ${
                        index % 2 === 0 ? 'right-4' : 'left-4'
                      } bg-white px-6 py-2 rounded-full shadow-md ${variety.textColor}`}
                    >
                      <span className="font-medium">{variety.name}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content section */}
                <div className={`${variety.color} p-8 md:p-12 rounded-xl relative`}>
                  {/* Decorative leaf in background */}
                  <div className="absolute right-4 bottom-4 opacity-10 w-32 h-32">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={variety.textColor}>
                      <path fill="currentColor" d="M45.7,-77.8C59.1,-71.3,69.9,-59.2,78.7,-45.4C87.5,-31.7,94.3,-15.8,95.6,0.7C96.8,17.3,92.5,34.5,83.2,48.7C73.9,62.8,59.5,73.9,43.7,79.9C27.9,85.9,14,86.8,-0.8,88.2C-15.6,89.6,-31.2,91.5,-43.2,85.6C-55.2,79.6,-63.5,65.8,-70.6,51.6C-77.6,37.4,-83.3,22.9,-85.5,7.6C-87.8,-7.7,-86.5,-24,-79.9,-37.7C-73.3,-51.5,-61.4,-62.7,-47.5,-69C-33.6,-75.3,-17.7,-76.7,-1.2,-74.8C15.3,-72.9,32.3,-84.3,45.7,-77.8Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className={`text-3xl font-serif font-medium mb-4 ${variety.textColor}`}>{variety.name}</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">{variety.description}</p>
                    
                    <h4 className={`text-lg font-medium mb-3 ${variety.textColor}`}>Health Benefits</h4>
                    <ul className="space-y-2 mb-8">
                      {variety.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full inline-flex items-center transition-all duration-300 transform hover:scale-105">
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VaaniTeaVarieties;