'use client';

import React from 'react';
import Link from 'next/link';

export default function AdventureToursPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Adventure Tours</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Thrilling Adventures Await</h2>
          <p className="mb-6">
            Experience the adrenaline rush with our adventure tours across Northeast India's
            stunning landscapes and challenging terrains.
          </p>
          
          <h3 className="text-lg font-semibold mb-4">Adventure Activities:</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Trekking and Hiking expeditions</li>
            <li>River rafting in pristine waters</li>
            <li>Rock climbing and rappelling</li>
            <li>Motorcycle touring</li>
            <li>Paragliding and adventure sports</li>
          </ul>
          
          <div className="text-center">
            <Link 
              href="/travel-listings" 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Book Adventure Tours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}