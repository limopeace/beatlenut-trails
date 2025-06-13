'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations';

interface Activity {
  id: number;
  title: string;
  description: string;
  image: string;
  locations: string[];
  bestTime?: string;
  difficulty?: string;
  specialFeatures?: string[];
  highlight?: string;
  experience?: string;
  atmosphere?: string;
  skills?: string[];
  included?: string;
  experiences?: string[];
  essence?: string;
  rituals?: string[];
  philosophy?: string;
  equipment?: string;
  seasons?: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: '🦜 Bird Watching',
    description: 'Drift through dawn with hornbills, cranes, and riverbank songbirds in Assam, Arunachal, and Phobjikha.',
    image: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    locations: ['Assam Wildlife Sanctuaries', 'Arunachal Pradesh Forests', 'Phobjikha Valley'],
    bestTime: 'Early morning hours',
  },
  {
    id: 2,
    title: '🚴‍♂️ Cycling & Soft Adventure Rides',
    description: 'Pedal along pine-scented ridges, forest trails, and monsoon-swept village roads across Meghalaya and Sikkim.',
    image: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    locations: ['Meghalaya Hills', 'Sikkim Valleys', 'Village Forest Roads'],
    difficulty: 'Easy to Moderate',
  },
  {
    id: 3,
    title: '🏍️ Motorcycle Expeditions',
    description: 'Ride from tea to temples, cloud to canyon — on routes from Assam to Bhutan and the lost kingdom of Mustang.',
    image: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    locations: ['Assam Tea Gardens', 'Bhutan Border Routes', 'Mustang Circuits'],
    specialFeatures: ['Soul routes', 'Mountain passes', 'Sacred trails'],
  },
  {
    id: 4,
    title: '🥾 Hiking & Soft Treks',
    description: 'Walk sacred forests, rhododendron valleys, and ancient village trails — from Dzukou to Dzongu.',
    image: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    locations: ['Dzukou Valley', 'Dzongu Sacred Groves', 'Rhododendron Forests'],
    highlight: 'Sacred and ancient trails',
  },
  {
    id: 5,
    title: '🧘 Meditation & Forest Retreats',
    description: 'Find silence in monastery courtyards, riverside bamboo groves, or the soft hush of a Himalayan morning.',
    image: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    locations: ['Monastery Courtyards', 'Riverside Bamboo Groves', 'Himalayan Morning Spots'],
    specialFeatures: ['Guided silence', 'Natural meditation spaces'],
  },
  {
    id: 6,
    title: '🛶 Rafting & River Drifts',
    description: 'Float gently through the Jia Bhoroli, Umngot, or Siang — with birdsong above and quiet below.',
    image: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    locations: ['Jia Bhoroli River', 'Umngot River', 'Siang River'],
    experience: 'Gentle floating with nature sounds',
  },
  {
    id: 7,
    title: '🔭 Stargazing & Night Camps',
    description: 'Lie under velvet skies in Dzuleke, Majuli, or Zapami — where campfire stories melt into constellations.',
    image: '/images/real/pexels-nans1419-20519339-min.jpg',
    locations: ['Dzuleke', 'Majuli Island', 'Zapami'],
    specialFeatures: ['Velvet skies', 'Campfire stories', 'Constellation viewing'],
  },
  {
    id: 8,
    title: '🔥 Camping & Outdoor Sleepouts',
    description: 'Sleep in tents beneath prayer flags, near tribal hearths, or beside ancient woods in Nagaland and Arunachal.',
    image: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    locations: ['Prayer Flag Sites', 'Tribal Villages', 'Ancient Forests'],
    atmosphere: 'Under prayer flags and tribal hearths',
  },
  {
    id: 9,
    title: '🍵 Tea Garden Walks & Tastings',
    description: 'Wander through Assam heritage estates, pluck leaves, and sip the story of the soil in planter bungalows.',
    image: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    locations: ['Assam Heritage Tea Estates', 'Colonial Planter Bungalows'],
    experience: 'Hands-on tea experience',
  },
  {
    id: 10,
    title: '🧵 Craft Workshops & Tribal Art',
    description: 'Carve masks in Majuli, weave bamboo in Mizoram, or thread beads with a Konyak elder in Mon.',
    image: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    locations: ['Majuli Island', 'Mizoram Villages', 'Mon (Konyak Territory)'],
    skills: ['Mask carving', 'Bamboo weaving', 'Bead threading'],
  },
  {
    id: 11,
    title: '🎣 Fishing with Locals',
    description: 'Cast your line in quiet streams with tribal guides in Zapami or Dzuleke — fire-cooked lunch included.',
    image: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    locations: ['Zapami Streams', 'Dzuleke Waters'],
    included: 'Fire-cooked lunch',
  },
  {
    id: 12,
    title: '🥘 Cooking Experiences & Local Meals',
    description: 'Learn bamboo shoot stews, tribal grilling, or monastic lentil rituals — and share it all around a slow table.',
    image: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    skills: ['Bamboo shoot stews', 'Tribal grilling', 'Monastic cooking'],
    atmosphere: 'Slow table sharing',
  },
  {
    id: 13,
    title: '🎭 Cultural Performances & Story Circles',
    description: 'From Hornbill fire dances to riverside folk songs, every rhythm reveals a world.',
    image: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    experiences: ['Hornbill fire dances', 'Riverside folk songs', 'Story circles'],
    essence: 'Every rhythm reveals a world',
  },
  {
    id: 14,
    title: '🧿 Temple Offerings & Spiritual Rituals',
    description: 'Light lamps at Sanamahi altars, chant by the Brahmaputra, or offer butter lamps at Tiger\'s Nest.',
    image: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    locations: ['Sanamahi Altars', 'Brahmaputra Banks', "Tiger's Nest"],
    rituals: ['Lamp lighting', 'River chanting', 'Butter lamp offerings'],
  },
  {
    id: 15,
    title: '🏹 Martial Art Demos & Warrior Heritage',
    description: 'Witness Thang-Ta in Manipur or Konyak lore in Nagaland — where movement meets memory.',
    image: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    locations: ['Manipur (Thang-Ta)', 'Nagaland (Konyak Territory)'],
    essence: 'Where movement meets memory',
  },
  {
    id: 16,
    title: '📸 Photography & Sketching Halts',
    description: 'Pause often — in cloud alleys, forest clearings, and dusk-lit dzongs — to capture what can\'t be spoken.',
    image: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    locations: ['Cloud Alleys', 'Forest Clearings', 'Dusk-lit Dzongs'],
    philosophy: 'Capture what cannot be spoken',
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
                🌿 Activities with Beatlenut Trails
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-pale-straw mb-6 sm:mb-8 animate-fadeInUp italic">
                "Not just things to do — ways to remember."
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
                  Activities with Beatlenut Trails
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-deep-forest/90 italic mb-4">
                  "Not just things to do — ways to remember."
                </p>
                <p className="text-sm sm:text-base md:text-lg text-deep-forest/90">
                  Each activity is carefully curated to reconnect you with the land, its people, and yourself. From dawn bird watching to starlit camping, every experience becomes a story worth telling.
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
                      
                      {activity.included && (
                        <div className="text-xs sm:text-sm text-deep-forest/80">
                          <span className="font-semibold text-forest-green">Included: </span>{activity.included}
                        </div>
                      )}
                      
                      {activity.atmosphere && (
                        <div className="text-xs sm:text-sm text-deep-forest/80">
                          <span className="font-semibold text-forest-green">Atmosphere: </span>{activity.atmosphere}
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