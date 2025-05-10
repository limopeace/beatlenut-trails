'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '../common/SectionTitle';
import Button from '../common/Button';

const destinations = [
  {
    id: 1,
    name: 'Shillong',
    state: 'Meghalaya',
    description: 'The Scotland of the East with beautiful lakes and waterfalls.',
    imageSrc: '/images/destination-placeholder-1.jpg',
    href: '/destinations/shillong',
  },
  {
    id: 2,
    name: 'Kaziranga',
    state: 'Assam',
    description: 'Home to the one-horned rhinoceros and diverse wildlife.',
    imageSrc: '/images/destination-placeholder-2.jpg',
    href: '/destinations/kaziranga',
  },
  {
    id: 3,
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    description: 'Buddhist monasteries amidst breathtaking Himalayan landscapes.',
    imageSrc: '/images/destination-placeholder-3.jpg',
    href: '/destinations/tawang',
  },
  {
    id: 4,
    name: 'Majuli',
    state: 'Assam',
    description: 'The largest river island with unique cultural heritage.',
    imageSrc: '/images/destination-placeholder-4.jpg',
    href: '/destinations/majuli',
  },
  {
    id: 5,
    name: 'Cherrapunji',
    state: 'Meghalaya',
    description: 'One of the wettest places on Earth with living root bridges.',
    imageSrc: '/images/destination-placeholder-5.jpg',
    href: '/destinations/cherrapunji',
  },
  {
    id: 6,
    name: 'Dzukou Valley',
    state: 'Nagaland',
    description: 'A hidden paradise known for its seasonal flowers and gentle hills.',
    imageSrc: '/images/destination-placeholder-6.jpg',
    href: '/destinations/dzukou-valley',
  },
];

const FeaturedDestinations = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <SectionTitle
          title="Top Destinations"
          subtitle="Explore the most beautiful and culturally rich destinations of Northeast India"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Link 
              key={destination.id} 
              href={destination.href}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg h-64 mb-4">
                {/* Placeholder image or actual image */}
                <div className="absolute inset-0 bg-gray-300">
                  {destination.imageSrc && (
                    <Image
                      src={destination.imageSrc}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-sm text-gray-200">{destination.state}</p>
                </div>
              </div>
              <p className="text-dark-grey">{destination.description}</p>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button href="/destinations" variant="primary">
            Explore All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;