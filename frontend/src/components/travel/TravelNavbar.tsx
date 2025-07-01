'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faPhone, faEnvelope, faStore } from '@fortawesome/free-solid-svg-icons';

const TravelNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-deep-forest shadow-md py-2' : 'bg-deep-forest/90 py-3'
    }`}>
      {/* Top Bar - Desktop Only */}
      <div className={`hidden md:block border-b ${isScrolled ? 'border-pale-straw/20' : 'border-pale-straw/20'} pb-2 mb-2`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="tel:+919876543210" className="text-sm flex items-center gap-2 text-pale-straw">
                <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:info@beatlenuttrails.com" className="text-sm flex items-center gap-2 text-pale-straw">
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                <span>info@beatlenuttrails.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-pale-straw">
                Experience Northeast India with Expert Guides
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 relative mr-2">
                <img 
                  src="/images/beatlenut-logo.png" 
                  alt="BeatlenutTrails Logo" 
                  className="w-full h-full"
                />
              </div>
              <span className="text-pale-straw font-bold text-lg hidden sm:block font-clash">BeatlenutTrails</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Destinations', action: () => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' }) },
              { name: 'Bike Rentals', path: '/bike-rentals' },
              { name: 'Services', action: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) },
              { name: 'Packages', action: () => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }) },
              { name: 'Contact', path: '/contact' },
            ].map(item => (
              item.path ? (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className={`text-sm font-medium font-clash transition-colors ${
                    pathname === item.path ? 'text-moss-green' : 'text-pale-straw hover:text-moss-green'
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="text-sm font-medium font-clash text-pale-straw hover:text-moss-green transition-colors"
                >
                  {item.name}
                </button>
              )
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/esm-portal"
              className={`inline-block bg-forest-green hover:bg-moss-green text-pale-straw px-5 py-2 rounded-full transition-colors duration-300 text-sm font-medium font-clash flex items-center gap-2 ${
                isScrolled ? 'shadow-sm' : ''
              }`}
            >
              <FontAwesomeIcon icon={faStore} className="w-3 h-3" />
              ESM PORTAL
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              className="p-2.5 focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon 
                icon={isMobileMenuOpen ? faTimes : faBars} 
                className="text-pale-straw text-xl" 
                size="lg" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[90vh] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-pale-straw rounded-lg shadow-lg py-5 px-4">
            <nav className="flex flex-col space-y-5">
              {[
                { name: 'Home', path: '/' },
                { name: 'Destinations', action: () => { setIsMobileMenuOpen(false); document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' }); } },
                { name: 'Bike Rentals', path: '/bike-rentals' },
                { name: 'Services', action: () => { setIsMobileMenuOpen(false); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); } },
                { name: 'Packages', action: () => { setIsMobileMenuOpen(false); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }); } },
                { name: 'Contact', path: '/contact' },
              ].map(item => (
                item.path ? (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    className={`text-base font-medium font-clash block py-2 transition-colors ${
                      pathname === item.path ? 'text-forest-green font-semibold' : 'text-deep-forest hover:text-forest-green'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="text-base font-medium font-clash text-deep-forest hover:text-forest-green transition-colors text-left w-full py-2"
                  >
                    {item.name}
                  </button>
                )
              ))}
              
              <Link 
                href="/esm-portal"
                className="bg-forest-green hover:bg-moss-green text-pale-straw px-4 py-3 rounded-lg text-center transition-colors duration-300 text-base font-medium font-clash block mt-3 flex items-center justify-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faStore} className="w-4 h-4" />
                ESM PORTAL
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TravelNavbar;