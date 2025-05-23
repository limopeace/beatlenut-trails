'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VaaniAerialView = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-screen-70 overflow-hidden">
      {isMounted && (
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y }}
        >
          <img 
            src="https://picsum.photos/id/137/1920/1080" 
            alt="Aerial view of tea gardens" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </motion.div>
      )}
    </section>
  );
};

export default VaaniAerialView;