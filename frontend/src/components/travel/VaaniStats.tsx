'use client';

import React from 'react';
import { motion } from 'framer-motion';

const VaaniStats = () => {
  const stats = [
    { value: '14%', label: 'GROWTH PRODUCTION RATE' },
    { value: '14+', label: 'INTERNATIONAL CLIENTS' },
    { value: '1+', label: 'EXPERIENCE (YEARS)' }
  ];

  return (
    <section className="py-16 bg-gray-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-opacity-5 bg-green-900 pattern-grid-lg"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3 className="text-5xl md:text-6xl font-bold text-green-700 mb-2">{stat.value}</h3>
              <div className="w-12 h-0.5 bg-green-500 mb-4"></div>
              <p className="text-center text-sm tracking-wider text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VaaniStats;