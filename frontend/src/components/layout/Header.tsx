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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-deep-forest-green text-off-white shadow-lg'
          : 'bg-transparent text-off-white'
      }`}
    >
      <div className="container-custom flex items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          <span className="sr-only">BeatlenutTrails</span>
          <div className="w-12 h-12 relative mr-2">
            {/* Logo placeholder */}
            <div className="w-full h-full bg-sunrise-orange rounded-full flex items-center justify-center">
              <span className="text-off-white font-bold text-xl">BT</span>
            </div>
          </div>
          <span className="font-montserrat font-bold text-xl">BeatlenutTrails</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="font-montserrat font-medium hover:text-sunrise-orange transition-colors"
          >
            Home
          </Link>
          <Link
            href="#destinations"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-montserrat font-medium hover:text-sunrise-orange transition-colors"
          >
            Destinations
          </Link>
          <Link
            href="/bike-rentals"
            className="font-montserrat font-medium hover:text-sunrise-orange transition-colors"
          >
            Bike Rentals
          </Link>
          <Link
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-montserrat font-medium hover:text-sunrise-orange transition-colors"
          >
            Services
          </Link>
          <Link
            href="#packages"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-montserrat font-medium hover:text-sunrise-orange transition-colors"
          >
            Packages
          </Link>
          <Link
            href="/contact"
            className="font-montserrat font-medium hover:text-sunrise-orange transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/esm-portal"
            className="font-montserrat font-medium bg-sunrise-orange text-off-white px-4 py-2 rounded hover:bg-vibrant-teal transition-colors"
          >
            ESM Portal
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-deep-forest-green text-off-white">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="font-montserrat font-medium hover:text-sunrise-orange transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#destinations"
              className="font-montserrat font-medium hover:text-sunrise-orange transition-colors py-2"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Destinations
            </Link>
            <Link
              href="/bike-rentals"
              className="font-montserrat font-medium hover:text-sunrise-orange transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bike Rentals
            </Link>
            <Link
              href="#services"
              className="font-montserrat font-medium hover:text-sunrise-orange transition-colors py-2"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Services
            </Link>
            <Link
              href="#packages"
              className="font-montserrat font-medium hover:text-sunrise-orange transition-colors py-2"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Packages
            </Link>
            <Link
              href="/contact"
              className="font-montserrat font-medium hover:text-sunrise-orange transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/esm-portal"
              className="font-montserrat font-medium bg-sunrise-orange text-off-white px-4 py-2 rounded hover:bg-vibrant-teal transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ESM Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;