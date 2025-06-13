'use client';

import React from 'react';
import Link from 'next/link';

export default function WildlifeSafarisPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Wildlife Safaris</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Discover Northeast India's Wildlife</h2>
          <p className="mb-6">
            Explore the rich biodiversity of Northeast India with our expertly guided wildlife safaris.
            From Kaziranga's one-horned rhinos to Manas National Park's diverse ecosystem.
          </p>
          
          <h3 className="text-lg font-semibold mb-4">Popular Wildlife Destinations:</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Kaziranga National Park - One-horned Rhinoceros</li>
            <li>Manas National Park - Royal Bengal Tigers</li>
            <li>Nameri National Park - Elephants and Bird Watching</li>
            <li>Dibru-Saikhowa National Park - Wild Horses</li>
          </ul>
          
          <div className="text-center">
            <Link 
              href="/travel-listings" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Wildlife Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}