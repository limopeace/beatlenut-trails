'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Import new components
import HeroNew from '@/components/travel/HeroNew';
import MarqueeTextNew from '@/components/travel/MarqueeTextNew';
import FeaturedDestinationsNew from '@/components/travel/FeaturedDestinationsNew';

// Animation variants for page elements
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const fadeInStaggered = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Define the services data
const services = [
  {
    id: 1,
    title: 'Guided Tours',
    description: 'Expert-led adventures through hidden trails and captivating destinations.',
    imageSrc: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    href: '/services/guided-tours',
    icon: '🧭',
  },
  {
    id: 2,
    title: 'Cultural Immersion',
    description: 'Authentic experiences with local tribes and traditional communities.',
    imageSrc: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    href: '/services/cultural-experiences',
    icon: '🏮',
  },
  {
    id: 3,
    title: 'Wildlife Expeditions',
    description: 'Discover incredible biodiversity in pristine natural habitats.',
    imageSrc: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    href: '/services/wildlife-expeditions',
    icon: '🦏',
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    content: "Our journey through Meghalaya with BeatlenutTrails was absolutely magical. Their expert guides revealed hidden gems we would never have discovered on our own.",
    author: "Priya Sharma",
    location: "Mumbai",
    imageSrc: '/images/real/pexels-kanishka-211910-679492-min.jpg',
  },
  {
    id: 2,
    content: "As a solo traveler, safety was my priority. BeatlenutTrails' ex-Army team made me feel secure while exploring remote areas of Arunachal Pradesh.",
    author: "Rajiv Mehta",
    location: "Bangalore",
    imageSrc: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
  }
];

// Stats data
const stats = [
  { value: '7+', label: 'States Covered' },
  { value: '50+', label: 'Destinations' },
  { value: '5000+', label: 'Happy Travelers' },
  { value: '95%', label: '5-Star Reviews' }
];

export default function NewDesign() {
  // Phrases for the marquee component
  const marqueeTexts = [
    "JOURNEY THROUGH WILDERNESS. DISCOVER YOURSELF.",
    "EXPLORE NORTHEAST. EXPERIENCE CULTURE.",
    "PRISTINE NATURE. AUTHENTIC ADVENTURES.",
    "TRAVEL RESPONSIBLY. PRESERVE BEAUTY.",
  ];

  return (
    <main className="overflow-hidden bg-stone">
      {/* Hero Section */}
      <HeroNew />

      {/* Marquee Text */}
      <MarqueeTextNew 
        phrases={marqueeTexts} 
        direction="left"
        speed="medium"
        textSize="md"
      />

      {/* Featured Destinations */}
      <FeaturedDestinationsNew />

      {/* Statistics Section */}
      <section className="py-16 bg-forest-medium text-stone">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInStaggered}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={`stat-${index}`}
                className="flex flex-col items-center"
                variants={fadeInUp}
              >
                <span className="text-4xl md:text-5xl font-montserrat font-bold mb-2">
                  {stat.value}
                </span>
                <span className="text-lg opacity-90 font-merriweather">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 md:py-24 bg-stone">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-forest-medium text-lg font-montserrat">What We Offer</span>
            <h2 className="text-3xl md:text-5xl text-forest-deep font-montserrat font-bold mt-2 mb-4">
              Extraordinary Experiences
            </h2>
            <p className="text-slate max-w-3xl mx-auto font-merriweather">
              Our thoughtfully crafted services connect you with the authentic beauty 
              and culture of Northeast India.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInStaggered}
          >
            {services.map((service) => (
              <motion.div 
                key={service.id}
                className="group relative bg-stone border border-pebble rounded-medium overflow-hidden transform transition-all duration-500 hover:shadow-medium hover:scale-[1.02]"
                variants={fadeInUp}
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={service.imageSrc} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-forest-gradient-v opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center bg-forest-medium bg-opacity-90 rounded-full text-2xl">
                    {service.icon}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-montserrat font-bold text-forest-deep mb-3 group-hover:text-forest-medium transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate mb-4 font-merriweather">
                    {service.description}
                  </p>
                  <a 
                    href={service.href} 
                    className="inline-flex items-center text-forest-medium group-hover:text-forest-deep font-montserrat"
                  >
                    Learn more
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <a 
              href="/services" 
              className="inline-block bg-forest-medium hover:bg-forest-deep text-stone px-8 py-4 rounded-soft transition-all duration-300 transform hover:scale-105 font-montserrat font-medium"
            >
              View All Services
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg"
            alt="Misty mountains in Northeast India"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-forest-deep bg-opacity-80"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-stone">
            <motion.span 
              className="text-lg font-montserrat"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Story
            </motion.span>
            
            <motion.h2 
              className="text-3xl md:text-5xl font-montserrat font-bold mt-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              The BeatlenutTrails Legacy
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl font-merriweather leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Founded by Army veterans with a deep love for Northeast India, BeatlenutTrails was born from 
              a passion to share the unparalleled beauty and rich cultural tapestry of this magnificent region.
            </motion.p>
            
            <motion.p 
              className="text-lg font-merriweather leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Our military background ensures meticulous attention to safety and logistics, 
              allowing you to immerse yourself in extraordinary experiences while we take care of everything else.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a 
                href="/about" 
                className="inline-block bg-stone hover:bg-pebble text-forest-deep px-8 py-4 rounded-soft transition-all duration-300 font-montserrat font-medium"
              >
                Our Full Story
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-pebble">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-forest-medium text-lg font-montserrat">Testimonials</span>
            <h2 className="text-3xl md:text-5xl text-forest-deep font-montserrat font-bold mt-2 mb-4">
              Traveler Stories
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-stone rounded-medium p-6 shadow-soft hover:shadow-medium transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex items-start">
                  <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded-full">
                    <img 
                      src={testimonial.imageSrc} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-slate font-merriweather leading-relaxed mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <p className="font-montserrat font-medium text-forest-deep">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-slate">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="/testimonials" 
              className="inline-flex items-center text-forest-medium hover:text-forest-deep font-montserrat"
            >
              Read more stories
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-forest-medium text-stone">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-6">
              Ready for Your Northeast Journey?
            </h2>
            <p className="text-lg md:text-xl font-merriweather opacity-90 mb-10 leading-relaxed">
              Let our expert guides take you on an unforgettable adventure through 
              the magical landscapes and rich cultures of Northeast India.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact" 
                className="bg-stone hover:bg-pebble text-forest-deep px-8 py-4 rounded-soft transition-all duration-300 font-montserrat font-medium"
              >
                Plan Your Trip
              </a>
              <a 
                href="/packages" 
                className="bg-transparent border-2 border-stone text-stone hover:bg-stone hover:text-forest-deep px-8 py-4 rounded-soft transition-all duration-300 font-montserrat font-medium"
              >
                View Packages
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}