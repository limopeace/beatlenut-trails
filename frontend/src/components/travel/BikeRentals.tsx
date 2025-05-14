'use client';

import React from 'react';
import Link from 'next/link';
import { WhatsAppButton } from '@/components/common';
import MotorcycleAnimation from '@/components/animations/MotorcycleAnimation';

// Sample bike rental data - in a real app, this would come from an API
const bikeRentals = [
  {
    id: 1,
    name: 'Kawasaki Versys 1000',
    description: 'Tour de France official motorcycle, perfect for long tours with excellent comfort and performance.',
    pricePerDay: 120,
    imageSrc: '/images/bikes/kawasaki-versys-1000.jpg',
    features: ['1000cc Engine', 'Touring Windscreen', 'Saddlebags Available', 'ABS', 'Traction Control'],
    availability: true
  },
  {
    id: 2,
    name: 'Royal Enfield Himalayan',
    description: 'Ideal for mountain trails and off-road adventures in Northeast India.',
    pricePerDay: 80,
    imageSrc: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    features: ['411cc Engine', 'Off-road Capability', 'Luggage Rack', 'Navigation System'],
    availability: true
  },
  {
    id: 3,
    name: 'KTM Duke 390',
    description: 'Sporty and agile motorcycle for thrilling rides through winding mountain roads.',
    pricePerDay: 95,
    imageSrc: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    features: ['373cc Engine', 'Lightweight', 'Aggressive Styling', 'Quick Acceleration'],
    availability: false
  }
];

const BikeRentals = () => {
  return (
    <section className="py-16 bg-pale-straw">
      <div className="container mx-auto px-4">
        {/* Header with animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div className="order-2 md:order-1">
            <div className="text-left">
              <span className="text-forest-green text-xl md:text-2xl font-serif">Adventure Awaits</span>
              <h2 className="text-3xl md:text-4xl text-deep-forest font-semibold mb-4 mt-2 font-clash">Premium Bike Rentals</h2>
              <p className="text-deep-forest/80 max-w-3xl">
                Explore Northeast India on two wheels with our premium motorcycle rental options. From adventure bikes to cruisers, we have the perfect ride for your journey.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 h-64 md:h-auto">
            <MotorcycleAnimation 
              src="/images/versys-nobg.png"
              alt="Motorcycle"
              width={500}
              height={300}
              priority={true}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bikeRentals.map((bike) => (
            <div key={bike.id} className="group block transform transition duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={bike.imageSrc}
                    alt={bike.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  {!bike.availability && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      Booked
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-forest-green text-pale-straw text-lg font-bold px-4 py-1 rounded-full">
                    ₹{bike.pricePerDay}/day
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-deep-forest mb-2 font-clash">
                    {bike.name}
                  </h3>
                  <p className="text-deep-forest/80 mb-4">{bike.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-deep-forest/80 mb-2">Features:</h4>
                    <ul className="text-deep-forest/70 text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                      {bike.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-forest-green mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {bike.availability ? (
                    <WhatsAppButton 
                      template="bikeRentals"
                      source="homepage"
                      product={bike.name}
                      className="w-full py-2 rounded-full font-medium"
                      showIcon={true}
                      showText={true}
                      text="Book Now via WhatsApp"
                    />
                  ) : (
                    <button 
                      className="w-full py-2 rounded-full font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
                      disabled
                    >
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/bike-rentals" 
            className="inline-block px-8 py-3 bg-forest-green text-pale-straw font-medium rounded-full hover:bg-moss-green transition duration-300"
          >
            View All Rentals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BikeRentals;