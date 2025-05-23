'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations';

const activities = [
  {
    id: 1,
    title: 'Trekking & Hiking',
    description: 'Explore breathtaking trails through lush forests, living root bridges, and majestic mountain passes. From beginner-friendly paths to challenging expeditions, Northeast India offers some of the most diverse trekking experiences in the world.',
    image: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    locations: ['Dzükou Valley (Nagaland)', 'Nongriat Double Decker Root Bridge (Meghalaya)', 'Tawang (Arunachal Pradesh)'],
    difficulty: 'Moderate to Challenging',
  },
  {
    id: 2,
    title: 'River Rafting',
    description: 'Experience the thrill of white water rafting through some of India\'s most pristine rivers. The Brahmaputra, Siang, and Kameng rivers offer exhilarating rapids surrounded by stunning natural beauty.',
    image: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    locations: ['Brahmaputra River (Assam)', 'Siang River (Arunachal Pradesh)', 'Teesta River (Sikkim)'],
    difficulty: 'Moderate to Extreme',
  },
  {
    id: 3,
    title: 'Wildlife Safaris',
    description: 'Encounter rare and endangered species in their natural habitat. From one-horned rhinoceros to wild elephants and tigers, the wildlife sanctuaries of Northeast India are biodiversity hotspots.',
    image: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    locations: ['Kaziranga National Park (Assam)', 'Manas National Park (Assam)', 'Namdapha National Park (Arunachal Pradesh)'],
    bestTime: 'November to April',
  },
  {
    id: 4,
    title: 'Cultural Immersion',
    description: 'Experience the rich cultural heritage of over 200 indigenous tribes. Stay in traditional homestays, participate in local festivals, learn traditional crafts, and enjoy authentic cuisine.',
    image: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    locations: ['Ziro Valley (Arunachal Pradesh)', 'Majuli Island (Assam)', 'Mawlynnong Village (Meghalaya)'],
    highlight: 'Hornbill Festival (Nagaland) - December',
  },
  {
    id: 5,
    title: 'Caving Adventures',
    description: 'Explore some of Asia\'s longest and most complex cave systems in Meghalaya. These limestone caves feature stunning stalactite and stalagmite formations, underground rivers, and unique ecosystems.',
    image: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    locations: ['Krem Liat Prah (Meghalaya)', 'Mawsmai Cave (Meghalaya)', 'Krem Mawmluh (Meghalaya)'],
    equipment: 'Professional guides and equipment required',
  },
  {
    id: 6,
    title: 'Motorcycle Touring',
    description: 'Embark on epic motorcycle journeys through winding mountain roads, picturesque valleys, and remote villages. The Northeast offers some of the most scenic and challenging routes for motorcycle enthusiasts.',
    image: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    locations: ['Tawang Circuit (Arunachal Pradesh)', 'Cherrapunji to Mawlynnong (Meghalaya)', 'Kohima to Dzükou Valley (Nagaland)'],
    bestTime: 'October to May',
  },
  {
    id: 7,
    title: 'Photography Expeditions',
    description: 'Capture the stunning landscapes, diverse wildlife, and vibrant cultures of Northeast India. From misty valleys to living root bridges and colorful festivals, the region is a photographer\'s paradise.',
    image: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    specialFeatures: ['Misty landscapes in Meghalaya', 'Tribal portraits in Nagaland', 'Wildlife in Assam', 'Mountain panoramas in Arunachal Pradesh'],
  },
  {
    id: 8,
    title: 'Camping & Glamping',
    description: 'Experience the magic of sleeping under starlit skies in some of India\'s most pristine locations. From basic camping to luxury glamping options, the Northeast offers unforgettable outdoor stays.',
    image: '/images/real/pexels-nans1419-20519339-min.jpg',
    locations: ['Shnongpdeng (Meghalaya)', 'Dzükou Valley (Nagaland)', 'Mechuka (Arunachal Pradesh)'],
    seasons: 'Year-round in different locations',
  },
];

const ActivitiesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center mt-0">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/real/pexels-travelerchitect-18736328-min.jpg"
              alt="Northeastern Adventure Activities"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-deep-forest bg-opacity-70"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 pt-16 sm:pt-20 md:pt-24">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pale-straw mb-3 sm:mb-4 md:mb-6 animate-fadeIn font-clash leading-tight">
                Adventure Activities in Northeast India
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-pale-straw mb-6 sm:mb-8 animate-fadeInUp">
                Discover the extraordinary adventures waiting for you in the enchanting landscapes of India's Northeast
              </p>
              <Link 
                href="/travel-listings" 
                className="inline-block bg-forest-green hover:bg-moss-green text-pale-straw px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors duration-300 animate-fadeInUp shadow-md text-sm sm:text-base"
              >
                Explore Our Packages
              </Link>
            </div>
          </div>
        </section>

        {/* About the Activities */}
        <section className="py-10 sm:py-12 md:py-16 bg-pale-straw">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <FadeIn>
              <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
                <span className="text-forest-green text-lg sm:text-xl font-medium">Experiences</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-forest mt-2 mb-4 sm:mb-6 font-clash">
                  Authentic Northeastern Experiences
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-deep-forest/90">
                  Northeast India offers a treasure trove of unique activities that connect you with its pristine nature, 
                  rich cultural heritage, and thrilling adventures. From trekking across living root bridges to rafting 
                  through mighty rivers and immersing in tribal cultures, these experiences create memories that last a lifetime.
                </p>
              </div>
            </FadeIn>

            {/* Activities Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {activities.map((activity) => (
                <motion.div 
                  key={activity.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-moss-green/20 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  variants={itemVariants}
                >
                  <div className="relative h-48 sm:h-52 md:h-60">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-4 sm:p-5 md:p-6 flex-grow">
                    <h3 className="text-xl sm:text-2xl font-bold text-deep-forest mb-2 sm:mb-3 font-clash">{activity.title}</h3>
                    <p className="text-sm sm:text-base text-deep-forest/80 mb-3 sm:mb-4">{activity.description}</p>
                    
                    {activity.locations && (
                      <div className="mb-3 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-forest-green mb-1 sm:mb-2">Popular Locations:</h4>
                        <ul className="space-y-0.5 sm:space-y-1">
                          {activity.locations.map((location, index) => (
                            <li key={index} className="text-xs sm:text-sm text-deep-forest/80 flex items-start">
                              <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-forest-green mt-1.5 mr-1.5 sm:mr-2 flex-shrink-0"></span>
                              {location}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {activity.difficulty && (
                        <div className="text-xs sm:text-sm text-deep-forest/80">
                          <span className="font-semibold text-forest-green">Difficulty: </span>{activity.difficulty}
                        </div>
                      )}
                      
                      {activity.bestTime && (
                        <div className="text-xs sm:text-sm text-deep-forest/80">
                          <span className="font-semibold text-forest-green">Best Time: </span>{activity.bestTime}
                        </div>
                      )}
                      
                      {activity.highlight && (
                        <div className="text-xs sm:text-sm text-deep-forest/80">
                          <span className="font-semibold text-forest-green">Highlight: </span>{activity.highlight}
                        </div>
                      )}
                      
                      {activity.equipment && (
                        <div className="text-xs sm:text-sm text-deep-forest/80">
                          <span className="font-semibold text-forest-green">Note: </span>{activity.equipment}
                        </div>
                      )}
                      
                      {activity.seasons && (
                        <div className="text-xs sm:text-sm text-deep-forest/80">
                          <span className="font-semibold text-forest-green">Seasons: </span>{activity.seasons}
                        </div>
                      )}
                    </div>
                    
                    {activity.specialFeatures && (
                      <div className="mb-3 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-forest-green mb-1 sm:mb-2">Special Features:</h4>
                        <ul className="space-y-0.5 sm:space-y-1">
                          {activity.specialFeatures.map((feature, index) => (
                            <li key={index} className="text-xs sm:text-sm text-deep-forest/80 flex items-start">
                              <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-forest-green mt-1.5 mr-1.5 sm:mr-2 flex-shrink-0"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-3 sm:mt-4">
                      <Link
                        href="/travel-listings"
                        className="inline-flex items-center text-forest-green font-medium hover:text-moss-green transition-colors text-sm sm:text-base"
                      >
                        View Related Packages
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-deep-forest text-pale-straw relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/images/real/pexels-kanishka-211910-679492-min.jpg"
              alt="Background"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 font-clash">Ready for Your Northeast Adventure?</h2>
              <p className="text-sm sm:text-base md:text-lg text-pale-straw/90 mb-6 sm:mb-8">
                Our experienced team of guides and ex-servicemen are ready to help you plan your perfect adventure in Northeast India.
                Whether you're seeking thrilling expeditions or cultural immersion, we have the expertise to make it unforgettable.
              </p>
              <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4">
                <Link 
                  href="/travel-listings" 
                  className="w-full xs:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-forest-green hover:bg-moss-green text-pale-straw font-medium rounded-full shadow-md text-sm sm:text-base"
                >
                  Explore Packages
                </Link>
                <Link 
                  href="/contact" 
                  className="w-full xs:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-transparent border-2 border-pale-straw hover:bg-pale-straw hover:text-deep-forest text-pale-straw font-medium rounded-full transition-colors shadow-md text-sm sm:text-base"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-10 bg-forest-green/20 -z-5"></div>
          <div className="absolute top-1/4 right-10 w-20 h-20 md:w-32 md:h-32 bg-pale-straw/5 rounded-full -z-5"></div>
          <div className="absolute bottom-1/3 left-10 w-16 h-16 md:w-24 md:h-24 bg-pale-straw/5 rounded-full -z-5"></div>
        </section>
      </main>
    </div>
  );
};

export default ActivitiesPage;