'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faShoppingCart, faHeart, faShieldAlt, faAward, faBalanceScale } from '@fortawesome/free-solid-svg-icons';

const TeaCard = ({ tea, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-white rounded-xl overflow-hidden shadow-lg tea-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {tea.badge && (
        <div className="absolute top-4 left-4 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {tea.badge}
        </div>
      )}
      
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={tea.image} 
          alt={tea.name} 
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ 
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Quick Actions */}
        <div 
          className="absolute right-4 top-4 flex flex-col gap-2 transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <button className="bg-white p-2 rounded-full text-green-700 hover:bg-green-50 transition-colors shadow-md" aria-label="Add to favorites">
            <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
          </button>
          <button className="bg-white p-2 rounded-full text-green-700 hover:bg-green-50 transition-colors shadow-md" aria-label="Add to cart">
            <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
          </button>
        </div>
        
        {/* Tea Type Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${tea.typeBadgeColor}`}>
            {tea.type}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-medium text-gray-900">{tea.name}</h3>
          <div className="text-green-700 font-medium">₹{tea.price}/100g</div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < tea.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({tea.reviewCount} reviews)</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{tea.description}</p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tea.features.map((feature, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
        
        {/* Action Button */}
        <div className="pt-2">
          <a 
            href={`/vaani-test/tea-collection/${tea.id}`}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full flex items-center justify-center transition-colors gap-2 text-sm font-medium"
          >
            <FontAwesomeIcon icon={faLeaf} className="w-4 h-4" />
            View Details
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const VaaniTeaCollection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const teaCategories = [
    { id: 'all', name: 'All Teas' },
    { id: 'white', name: 'White Tea' },
    { id: 'green', name: 'Green Tea' },
    { id: 'black', name: 'Black Tea' },
    { id: 'oolong', name: 'Oolong Tea' }
  ];
  
  const teas = [
    {
      id: 'silver-needle',
      name: 'Silver Needle White Tea',
      description: 'Our finest white tea with delicate flavor notes of honey and fresh hay. Handpicked only two days each year.',
      price: 1200,
      type: 'White Tea',
      typeBadgeColor: 'bg-amber-50 text-amber-800',
      image: 'https://picsum.photos/id/1063/800/600',
      rating: 5,
      reviewCount: 24,
      features: ['Limited Edition', 'Hand-Picked', 'Low Caffeine'],
      category: 'white',
      badge: 'Rare'
    },
    {
      id: 'emerald-cloud',
      name: 'Emerald Cloud Green Tea',
      description: 'Premium green tea with refreshing notes of spring vegetables and sweet grass. Perfect for everyday drinking.',
      price: 450,
      type: 'Green Tea',
      typeBadgeColor: 'bg-green-50 text-green-800',
      image: 'https://picsum.photos/id/225/800/600',
      rating: 4,
      reviewCount: 86,
      features: ['Organic', 'Antioxidant-Rich', 'Medium Caffeine'],
      category: 'green'
    },
    {
      id: 'golden-dawn',
      name: 'Golden Dawn Breakfast Tea',
      description: 'Robust black tea with rich malty notes and a bright finish. Ideal with milk or as a strong morning brew.',
      price: 350,
      type: 'Black Tea',
      typeBadgeColor: 'bg-orange-50 text-orange-800',
      image: 'https://picsum.photos/id/433/800/600',
      rating: 5,
      reviewCount: 132,
      features: ['Full-Bodied', 'Estate Blend', 'High Caffeine'],
      category: 'black',
      badge: 'Bestseller'
    },
    {
      id: 'amber-oolong',
      name: 'Amber Mountain Oolong',
      description: 'Semi-oxidized oolong with complex floral aroma and a smooth, silky texture with hints of ripe peach.',
      price: 850,
      type: 'Oolong Tea',
      typeBadgeColor: 'bg-yellow-50 text-yellow-800',
      image: 'https://picsum.photos/id/493/800/600',
      rating: 4,
      reviewCount: 57,
      features: ['Small Batch', 'Multiple Infusions', 'Medium Caffeine'],
      category: 'oolong'
    }
  ];
  
  const filteredTeas = activeCategory === 'all' 
    ? teas 
    : teas.filter(tea => tea.category === activeCategory);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16 relative">
          {/* Decorative element */}
          <span className="absolute top-0 -mt-6 text-green-600 opacity-10 text-7xl transform -rotate-3 font-serif">Tea</span>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-green-600 font-serif italic text-xl block mb-3">Discover</span>
            <h2 className="text-4xl font-serif font-medium text-green-800 mb-4 text-center">Our Signature Teas</h2>
            <div className="w-24 h-0.5 bg-green-600 mx-auto mb-6"></div>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
              Carefully cultivated on our estate's rolling hills, each of our teas offers a unique taste experience
              that captures the essence of Assam's pristine environment.
            </p>
          </motion.div>
          
          {/* Tea Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-green-700">
                <FontAwesomeIcon icon={faShieldAlt} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-2">Health Benefits</h3>
              <p className="text-gray-600 text-sm">
                Rich in antioxidants and polyphenols that support your overall wellbeing
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-green-700">
                <FontAwesomeIcon icon={faAward} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                Handpicked and processed with care to maintain exceptional flavor profiles
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-green-700">
                <FontAwesomeIcon icon={faBalanceScale} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-green-800 mb-2">Sustainable Farming</h3>
              <p className="text-gray-600 text-sm">
                Grown using organic practices that respect nature and protect biodiversity
              </p>
            </motion.div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {teaCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tea Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeas.map((tea, index) => (
            <TeaCard key={tea.id} tea={tea} index={index} />
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-16 text-center">
          <a 
            href="/vaani-test/tea-collection"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition-colors"
          >
            View All Teas
          </a>
        </div>
      </div>
    </section>
  );
};

export default VaaniTeaCollection;