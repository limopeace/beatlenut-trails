'use client';

import React, { useState } from 'react';
import Button from '../common/Button';

const SearchBar = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [travelers, setTravelers] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log({ destination, checkIn, checkOut, travelers });
  };

  return (
    <div className="container-custom -mt-20 relative z-20">
      <div className="bg-deep-forest-green rounded-lg shadow-xl p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="destination" className="block text-off-white mb-2 font-medium">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you going?"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
                required
              />
            </div>
            
            <div>
              <label htmlFor="check-in" className="block text-off-white mb-2 font-medium">
                Check-in
              </label>
              <input
                type="date"
                id="check-in"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
                required
              />
            </div>
            
            <div>
              <label htmlFor="check-out" className="block text-off-white mb-2 font-medium">
                Check-out
              </label>
              <input
                type="date"
                id="check-out"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
                required
              />
            </div>
            
            <div>
              <label htmlFor="travelers" className="block text-off-white mb-2 font-medium">
                Travelers
              </label>
              <input
                type="number"
                id="travelers"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              variant="primary"
              className="w-full md:w-auto"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;