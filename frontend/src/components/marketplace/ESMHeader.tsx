'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faPhone, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

const ESMHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isESMPortalPage = pathname?.startsWith('/esm-portal');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-deep-forest shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      {/* Top Bar */}
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
              {/* Login/Register links for ESM Portal */}
              {isESMPortalPage && (
                <Link 
                  href="/esm-portal/login" 
                  className="text-sm flex items-center gap-1 text-pale-straw hover:text-moss-green transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-16 h-16 relative mr-2">
                <img 
                  src="/images/beatlenut-logo.png" 
                  alt="BeatlenutTrails Logo" 
                  className="w-full h-full"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Packages & Listings', path: '/travel-listings' },
              { name: 'Activities', path: '/activities' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map(item => (
              <Link 
                key={item.name} 
                href={item.path}
                className="text-sm font-medium text-pale-straw hover:text-moss-green transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              <Link
                href="/esm-portal"
                className={`text-sm font-medium ${isESMPortalPage ? 'bg-pale-straw text-deep-forest' : 'border border-pale-straw text-pale-straw hover:bg-pale-straw/20'} px-4 py-1 rounded transition-colors`}
              >
                ESM Portal
              </Link>
              <Link
                href="/admin/login"
                className="text-sm font-medium border border-pale-straw text-pale-straw px-4 py-1 rounded transition-colors hover:bg-pale-straw/20"
              >
                Admin Panel
              </Link>
            </div>
          </nav>

          {/* Book Now Button or Login Button */}
          {!isESMPortalPage ? (
            <Link 
              href="/travel-listings"
              className={`hidden md:inline-block bg-forest-green hover:bg-moss-green text-pale-straw px-5 py-2 rounded-full transition-colors duration-300 text-sm font-medium ${
                isScrolled ? 'shadow-sm' : ''
              }`}
            >
              BOOK NOW
            </Link>
          ) : (
            <Link 
              href="/esm-portal/login"
              className={`hidden md:inline-block bg-forest-green hover:bg-moss-green text-pale-straw px-5 py-2 rounded-full transition-colors duration-300 text-sm font-medium ${
                isScrolled ? 'shadow-sm' : ''
              }`}
            >
              LOGIN
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon 
              icon={isMobileMenuOpen ? faTimes : faBars} 
              className="text-pale-straw" 
              size="lg" 
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-pale-straw rounded-lg shadow-lg p-4">
            <nav className="flex flex-col space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Packages & Listings', path: '/travel-listings' },
                { name: 'Activities', path: '/activities' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map(item => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className="text-deep-forest hover:text-forest-green transition-colors text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                href="/esm-portal"
                className={`${isESMPortalPage ? 'bg-forest-green text-pale-straw' : 'text-forest-green border border-forest-green hover:bg-forest-green hover:text-pale-straw'} px-4 py-2 rounded text-center transition-colors text-sm font-medium`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ESM Portal
              </Link>
              
              {/* Conditional rendering for BOOK NOW or LOGIN button */}
              {!isESMPortalPage ? (
                <Link 
                  href="/travel-listings"
                  className="bg-forest-green hover:bg-moss-green text-pale-straw px-4 py-2 rounded-full text-center transition-colors duration-300 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  BOOK NOW
                </Link>
              ) : (
                <Link 
                  href="/esm-portal/login"
                  className="bg-forest-green hover:bg-moss-green text-pale-straw px-4 py-2 rounded-full text-center transition-colors duration-300 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  LOGIN
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ESMHeader;