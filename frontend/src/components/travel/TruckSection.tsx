'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import TruckAnimation from '@/components/animations/TruckAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faShieldAlt, faHandshake, faLeaf } from '@fortawesome/free-solid-svg-icons';

const TruckSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const featureItems = [
    {
      icon: faMapMarkedAlt,
      title: "LOCAL EXPERTISE",
      description: "Guided by locals with deep knowledge of the land"
    },
    {
      icon: faShieldAlt,
      title: "VETERAN LED",
      description: "Led by army veterans ensuring safety and professionalism"
    },
    {
      icon: faHandshake,
      title: "COMMUNITY IMPACT",
      description: "Supporting local communities across Northeast India"
    },
    {
      icon: faLeaf,
      title: "SUSTAINABLE TRAVEL",
      description: "Committed to eco-friendly and responsible tourism"
    }
  ];

  return (
    <section ref={ref} className="relative bg-white py-16 overflow-hidden">
      {/* Main content */}
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Truck animation - left side (Desktop only) */}
          <div className="relative hidden md:block h-[400px]">
            <TruckAnimation 
              src="/images/animations/truck.png"
              alt="Beatlenut Trails Transportation"
              width={600}
              height={300}
              priority
            />
          </div>

          {/* Content - right side */}
          <div>
            <div className="mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-green-800 font-clash">TRAVEL WITH CONFIDENCE</h2>
              <p className="text-gray-700 text-lg">
                At BeatlenutTrails, we handle all transportation needs with comfort and safety in mind.
                From airport pickups to remote destinations, our fleet and drivers ensure your journey
                is as memorable as the destination.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featureItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className="group bg-gray-50 rounded-lg p-5 transition-all duration-300 hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-4 group-hover:bg-green-700 group-hover:text-white transition-colors">
                    <FontAwesomeIcon icon={item.icon} className="text-xl" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-green-800 font-clash">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile truck image (only visible on mobile) */}
            <div className="mt-8 block md:hidden">
              <img
                src="/images/animations/truck.png"
                alt="Beatlenut Trails Transportation"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TruckSection;