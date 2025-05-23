'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const VaaniNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/vaani-test" className={`font-serif text-2xl font-medium ${
              isScrolled ? 'text-green-800' : 'text-white'
            }`}>
              Vaani Greens
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Tea Collection', 'Gallery', 'Booking', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={`/vaani-test/${item.toLowerCase().replace(' ', '-')}`}
                className={`text-sm font-medium hover:text-green-500 transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Book Now Button */}
          <Link 
            href="/vaani-test/booking"
            className={`hidden md:inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition-colors duration-300 text-sm font-medium ${
              isScrolled ? 'shadow-sm' : ''
            }`}
          >
            BOOK NOW
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke={isScrolled ? 'currentColor' : 'white'} 
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <nav className="flex flex-col space-y-4">
              {['Home', 'About', 'Tea Collection', 'Gallery', 'Booking', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  href={`/vaani-test/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-700 hover:text-green-600 transition-colors text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link 
                href="/vaani-test/booking"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BOOK NOW
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VaaniNavbar;