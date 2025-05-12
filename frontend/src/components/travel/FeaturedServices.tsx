'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const services = [
  {
    id: 1,
    title: 'Guided Tours',
    description: 'Expert-led adventures through ancient trails and hidden gems of Northeast India.',
    imageSrc: '/images/service-placeholder-1.jpg',
    href: '/services/guided-tours',
    icon: '🧭',
  },
  {
    id: 2,
    title: 'Cultural Experiences',
    description: 'Immerse yourself in the rich cultural heritage of diverse ethnic communities.',
    imageSrc: '/images/service-placeholder-2.jpg',
    href: '/services/cultural-experiences',
    icon: '🎭',
  },
  {
    id: 3,
    title: 'Wildlife Safaris',
    description: 'Explore the diverse wildlife and natural habitats of the region.',
    imageSrc: '/images/service-placeholder-3.jpg',
    href: '/services/wildlife-safaris',
    icon: '🦁',
  },
  {
    id: 4,
    title: 'Adventure Activities',
    description: 'Experience thrilling adventures from trekking to river rafting and more.',
    imageSrc: '/images/service-placeholder-4.jpg',
    href: '/services/adventure-activities',
    icon: '🏔️',
  },
];

const FeaturedServices = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-deep-forest-green text-2xl">Our Services</span>
          <h2 className="text-3xl md:text-4xl text-deep-forest-green font-semibold mb-4">Flavors of Northeast</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover the unique services we offer to make your Northeast India journey memorable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group block transform transition duration-300 hover:-translate-y-2">
              <Link href={service.href} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.imageSrc}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-deep-forest-green bg-opacity-80 flex items-center justify-center text-white text-2xl">
                      {service.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-deep-forest-green mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="text-deep-forest-green font-medium group-hover:underline inline-flex items-center">
                      Learn More 
                      <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/services" 
            className="inline-block px-8 py-3 border-2 border-deep-forest-green text-deep-forest-green font-medium rounded hover:bg-deep-forest-green hover:text-white transition duration-300"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;