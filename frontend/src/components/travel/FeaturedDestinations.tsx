'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const destinations = [
  {
    id: 1,
    name: 'Shillong',
    state: 'Meghalaya',
    description: 'The Scotland of the East with beautiful lakes and waterfalls.',
    imageSrc: '/images/hero-placeholder.jpg', // Using existing image as placeholder
    href: '/destinations/shillong',
  },
  {
    id: 2,
    name: 'Kaziranga',
    state: 'Assam',
    description: 'Home to the one-horned rhinoceros and diverse wildlife.',
    imageSrc: '/images/hero-placeholder.jpg',
    href: '/destinations/kaziranga',
  },
  {
    id: 3,
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    description: 'Buddhist monasteries amidst breathtaking Himalayan landscapes.',
    imageSrc: '/images/hero-placeholder.jpg',
    href: '/destinations/tawang',
  },
  {
    id: 4,
    name: 'Majuli',
    state: 'Assam',
    description: 'The largest river island with unique cultural heritage.',
    imageSrc: '/images/hero-placeholder.jpg',
    href: '/destinations/majuli',
  },
  {
    id: 5,
    name: 'Cherrapunji',
    state: 'Meghalaya',
    description: 'One of the wettest places on Earth with living root bridges.',
    imageSrc: '/images/hero-placeholder.jpg',
    href: '/destinations/cherrapunji',
  },
  {
    id: 6,
    name: 'Dzukou Valley',
    state: 'Nagaland',
    description: 'A hidden paradise known for its seasonal flowers and gentle hills.',
    imageSrc: '/images/hero-placeholder.jpg',
    href: '/destinations/dzukou-valley',
  },
];

const FeaturedDestinations = () => {
  return (
    <section className="py-16 bg-off-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-deep-forest-green text-2xl">Discover</span>
          <h2 className="text-3xl md:text-4xl text-deep-forest-green font-semibold mb-4">Top Destinations</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Explore the most beautiful and culturally rich destinations of Northeast India
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="group overflow-hidden rounded-lg shadow-lg bg-white transition duration-300 hover:-translate-y-2">
              <Link href={destination.href} className="block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.imageSrc}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-deep-forest-green text-white text-xs font-bold px-3 py-1 rounded">
                    {destination.state}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-deep-forest-green mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="text-deep-forest-green font-medium group-hover:underline inline-flex items-center">
                    Explore
                    <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/destinations" 
            className="inline-block px-8 py-3 bg-deep-forest-green text-white font-medium rounded shadow-md hover:bg-opacity-90 transition duration-300"
          >
            Explore All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;