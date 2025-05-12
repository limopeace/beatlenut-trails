'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '../common/SectionTitle';
import Button from '../common/Button';
import Card from '../common/Card';

const packages = [
  {
    id: 1,
    title: 'Meghalaya Explorer',
    duration: '6 Days / 5 Nights',
    price: 32500,
    description: 'Discover living root bridges, crystal caves, and stunning waterfalls in the abode of clouds.',
    highlights: ['Cherrapunji', 'Double Decker Root Bridge', 'Dawki River', 'Mawlynnong Village'],
    imageSrc: '/images/package-placeholder-1.jpg',
    href: '/packages/meghalaya-explorer',
  },
  {
    id: 2,
    title: 'Assam Wildlife Safari',
    duration: '5 Days / 4 Nights',
    price: 28000,
    description: 'Experience thrilling wildlife encounters in the renowned national parks of Assam.',
    highlights: ['Kaziranga National Park', 'Manas National Park', 'Jeep Safaris', 'Boat Cruises'],
    imageSrc: '/images/package-placeholder-2.jpg',
    href: '/packages/assam-wildlife-safari',
  },
  {
    id: 3,
    title: 'Arunachal Monastery Circuit',
    duration: '7 Days / 6 Nights',
    price: 45000,
    description: 'Journey through spectacular mountain landscapes and ancient Buddhist monasteries.',
    highlights: ['Tawang Monastery', 'Bomdila', 'Sela Pass', 'Dirang Hot Springs'],
    imageSrc: '/images/package-placeholder-3.jpg',
    href: '/packages/arunachal-monastery-circuit',
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const TravelPackages = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <SectionTitle
          title="Popular Tour Packages"
          subtitle="All-inclusive curated packages for unforgettable Northeast experiences"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gray-200"></div>
                <div className="absolute top-4 right-4 bg-sunrise-orange text-white py-1 px-3 rounded-full text-sm font-medium z-10">
                  Featured
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-deep-forest-green">{pkg.title}</h3>
                  <div className="text-vibrant-teal font-semibold">
                    {formatPrice(pkg.price)}
                  </div>
                </div>
                
                <div className="mb-3 text-sm text-dark-grey flex items-center">
                  <svg className="w-5 h-5 mr-1 text-sunrise-orange" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {pkg.duration}
                </div>
                
                <p className="text-dark-grey mb-4">{pkg.description}</p>
                
                <div className="mb-5 flex-grow">
                  <p className="text-sm font-semibold mb-2">Highlights:</p>
                  <ul className="text-sm space-y-1">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-vibrant-teal mt-0.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={pkg.href}>
                  <Button variant="primary" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button href="/packages" variant="secondary">
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TravelPackages;