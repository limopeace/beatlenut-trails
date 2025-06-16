'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-deep-forest text-pale-straw shadow-lg py-2'
          : 'bg-deep-forest/90 text-pale-straw py-3'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="sr-only">BeatlenutTrails</span>
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative mr-2">
            {/* Replace placeholder with logo */}
            <img 
              src="/images/beatlenut-logo.png" 
              alt="BeatlenutTrails Logo" 
              className="w-full h-full"
            />
          </div>
          {/* Remove beatlenut-trails text */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="font-clash font-medium hover:text-forest-green transition-colors"
          >
            Home
          </Link>
          <button
            onClick={() => {
              document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-clash font-medium hover:text-forest-green transition-colors"
          >
            Destinations
          </button>
          <Link
            href="/bike-rentals"
            className="font-clash font-medium hover:text-forest-green transition-colors"
          >
            Bike Rentals
          </Link>
          <button
            onClick={() => {
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-clash font-medium hover:text-forest-green transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => {
              document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-clash font-medium hover:text-forest-green transition-colors"
          >
            Packages
          </button>
          <Link
            href="/blog"
            className="font-clash font-medium hover:text-forest-green transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="font-clash font-medium hover:text-forest-green transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/esm-portal"
            className="font-clash font-medium bg-forest-green text-pale-straw px-4 py-2 rounded-md hover:bg-moss-green transition-colors"
          >
            ESM Portal
          </Link>
        </nav>

        {/* Mobile Menu Button - Enhanced touch target */}
        <button
          className="md:hidden text-2xl p-2.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu - Improved with animation and better touch targets */}
      <div 
        className={`md:hidden bg-deep-forest text-pale-straw absolute w-full left-0 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-[90vh] border-t border-pale-straw/20' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 py-5 flex flex-col space-y-5">
          <Link
            href="/"
            className="font-clash font-medium hover:text-forest-green transition-colors py-3 block"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <button
            className="font-clash font-medium hover:text-forest-green transition-colors py-3 text-left w-full"
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Destinations
          </button>
          <Link
            href="/bike-rentals"
            className="font-clash font-medium hover:text-forest-green transition-colors py-3 block"
            onClick={() => setMobileMenuOpen(false)}
          >
            Bike Rentals
          </Link>
          <button
            className="font-clash font-medium hover:text-forest-green transition-colors py-3 text-left w-full"
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Services
          </button>
          <button
            className="font-clash font-medium hover:text-forest-green transition-colors py-3 text-left w-full"
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Packages
          </button>
          <Link
            href="/blog"
            className="font-clash font-medium hover:text-forest-green transition-colors py-3 block"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="font-clash font-medium hover:text-forest-green transition-colors py-3 block"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/esm-portal"
            className="font-clash font-medium bg-forest-green text-pale-straw px-4 py-3 rounded-md hover:bg-moss-green transition-colors mt-4 text-center block"
            onClick={() => setMobileMenuOpen(false)}
          >
            ESM Portal
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;