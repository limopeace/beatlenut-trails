'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCompass, 
  faTree, 
  faShield,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';

const NoBotsBanner = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const benefitItems = [
    {
      icon: faCompass,
      title: "AUTHENTIC EXPERIENCES",
      description: "Curated by locals who know the land, not algorithms."
    },
    {
      icon: faTree,
      title: "LOCAL EXPERTISE",
      description: "Our guides are from Northeast India, sharing real insights."
    },
    {
      icon: faShield,
      title: "SAFETY FIRST",
      description: "Led by army veterans with security expertise."
    },
    {
      icon: faHandshake,
      title: "COMMUNITY SUPPORT",
      description: "Travel that benefits local communities directly."
    }
  ];

  return (
    <section ref={ref} className="relative bg-white py-16 overflow-hidden">
      {/* Scrolling text banner */}
      <div className="relative overflow-hidden py-2 md:py-3 lg:py-4 mb-4 md:mb-6 lg:mb-8">
        <div className="whitespace-nowrap animate-marquee-slower inline-block">
          <div className="inline-flex items-center text-[20px] sm:text-[28px] md:text-[60px] lg:text-[80px] font-bold tracking-tight leading-none font-clash">
            <span className="text-[#1A1A1A] uppercase">NO BOTS.&nbsp;</span>
            <span className="text-green-700 uppercase">NO ALGORITHMS.&nbsp;</span>
            <span className="text-[#1A1A1A] uppercase">JUST AUTHENTIC TRAVEL.&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="text-[#1A1A1A] uppercase">NO BOTS.&nbsp;</span>
            <span className="text-green-700 uppercase">NO ALGORITHMS.&nbsp;</span>
            <span className="text-[#1A1A1A] uppercase">JUST AUTHENTIC TRAVEL.&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Truck animation - left side (Desktop only) */}
          <div className="relative hidden md:block h-[400px]">
            <motion.div 
              className="absolute left-0 bottom-0 w-[150%] h-auto z-10"
              initial={{ opacity: 0, x: "-100%" }}
              animate={inView ? { opacity: 1, x: "0%" } : { opacity: 0, x: "-100%" }}
              transition={{ 
                duration: 2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3
              }}
            >
              <div className="px-2 md:px-0">
                <Image
                  src="/images/real/pexels-nans1419-20519339-min.jpg"
                  alt="Traditional boat in Northeast India"
                  width={600}
                  height={300}
                  className="w-full h-auto object-contain rounded-lg shadow-xl"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Content - right side */}
          <div>
            <div className="mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-green-800 font-clash uppercase">Human Touch in a Digital World</h2>
              <p className="text-gray-700 text-lg">
                At BeatlenutTrails, we believe real travel expertise comes from humans, not algorithms. 
                Our team of local experts and army veterans craft authentic experiences that automated 
                systems simply can't match.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefitItems.map((item, index) => (
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
                  <h3 className="text-xl font-bold mb-2 text-green-800 font-clash">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile boat image (only visible on mobile) */}
            <div className="mt-8 block md:hidden">
              <Image
                src="/images/real/pexels-nans1419-20519339-min.jpg"
                alt="Traditional boat in Northeast India"
                width={500}
                height={250}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoBotsBanner;