'use client';

import React from 'react';
import Link from 'next/link';

export default function CulturalExpeditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Cultural Expeditions</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Experience Rich Cultural Heritage</h2>
          <p className="mb-6">
            Immerse yourself in the vibrant cultures of Northeast India's diverse tribal communities,
            festivals, and traditional practices.
          </p>
          
          <h3 className="text-lg font-semibold mb-4">Cultural Highlights:</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Traditional tribal village visits</li>
            <li>Handicraft workshops with local artisans</li>
            <li>Festival celebrations and ceremonies</li>
            <li>Traditional cuisine experiences</li>
            <li>Folk music and dance performances</li>
          </ul>
          
          <div className="text-center">
            <Link 
              href="/travel-listings" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Cultural Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}