'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faPhone, faEnvelope, faUser, faSignOutAlt, faUserCircle, faBoxOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import CartIcon from './cart/CartIcon';

const ESMHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const isESMPortalPage = pathname?.startsWith('/esm-portal');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check authentication status on mount and pathname change
  useEffect(() => {
    const checkAuth = () => {
      // First check sessionStorage (non-persistent login)
      let token = sessionStorage.getItem('auth_token');
      let userData = sessionStorage.getItem('user');
      
      // If not found, check localStorage (persistent login)
      if (!token) {
        token = localStorage.getItem('auth_token');
        userData = localStorage.getItem('user');
      }
      
      if (token && userData) {
        setIsAuthenticated(true);
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse user data:', e);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuth();
    // Also hide user menu when pathname changes
    setShowUserMenu(false);
  }, [pathname]);
  
  const handleLogout = () => {
    // Clear all auth data from storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    setShowUserMenu(false);
    
    // Redirect to home page
    router.push('/esm-portal');
  };

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
              {/* Login/Register links for ESM Portal */}
              {isESMPortalPage && !isAuthenticated && (
                <Link 
                  href="/esm-portal/login" 
                  className="text-sm flex items-center gap-1 text-pale-straw hover:text-moss-green transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                  <span>Login / Register</span>
                </Link>
              )}
              
              {/* User account menu when authenticated */}
              {isESMPortalPage && isAuthenticated && (
                <div className="relative">
                  <button 
                    className="text-sm flex items-center gap-1 text-pale-straw hover:text-moss-green transition-colors"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4" />
                    <span>{user?.fullName || 'My Account'}</span>
                  </button>
                  
                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/esm-portal/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FontAwesomeIcon icon={faChartLine} className="w-3 h-3" />
                        Dashboard
                      </Link>
                      <Link
                        href="/esm-portal/my-products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FontAwesomeIcon icon={faBoxOpen} className="w-3 h-3" />
                        My Products
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-3 h-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
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

          {/* Cart and Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Shopping Cart */}
            {isESMPortalPage && (
              <CartIcon className="text-pale-straw" />
            )}
            
            {/* Book Now Button or Login Button */}
            {!isESMPortalPage ? (
              <Link 
                href="/travel-listings"
                className={`inline-block bg-forest-green hover:bg-moss-green text-pale-straw px-5 py-2 rounded-full transition-colors duration-300 text-sm font-medium ${
                  isScrolled ? 'shadow-sm' : ''
                }`}
              >
                BOOK NOW
              </Link>
            ) : (
              isAuthenticated ? (
                <Link 
                  href="/esm-portal/dashboard"
                  className={`inline-block bg-forest-green hover:bg-moss-green text-pale-straw px-5 py-2 rounded-full transition-colors duration-300 text-sm font-medium ${
                    isScrolled ? 'shadow-sm' : ''
                  }`}
                >
                  DASHBOARD
                </Link>
              ) : (
                <Link 
                  href="/esm-portal/login"
                  className={`inline-block bg-forest-green hover:bg-moss-green text-pale-straw px-5 py-2 rounded-full transition-colors duration-300 text-sm font-medium ${
                    isScrolled ? 'shadow-sm' : ''
                  }`}
                >
                  LOGIN
                </Link>
              )
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center md:hidden">
            {/* Mobile Cart Icon */}
            {isESMPortalPage && (
              <CartIcon className="text-pale-straw mr-3" />
            )}
            
            {/* Mobile Menu Button - Larger touch target */}
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

        {/* Mobile Menu - Improved spacing and layout */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[90vh] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-pale-straw rounded-lg shadow-lg py-5 px-4">
            <nav className="flex flex-col space-y-5">
              {/* Login/Register link for mobile */}
              {isESMPortalPage && !isAuthenticated && (
                <Link 
                  href="/esm-portal/login" 
                  className="bg-forest-green text-pale-straw px-5 py-3 rounded-lg text-center font-medium mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  LOGIN / REGISTER
                </Link>
              )}
            
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
                  className="text-deep-forest hover:text-forest-green transition-colors text-base font-medium block py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                href="/esm-portal"
                className={`${isESMPortalPage ? 'bg-forest-green text-pale-straw' : 'text-forest-green border-2 border-forest-green hover:bg-forest-green hover:text-pale-straw'} px-4 py-3 rounded-lg text-center transition-colors text-base font-medium block mt-2 mb-1`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ESM Portal
              </Link>
              
              {/* Admin Panel link for mobile */}
              <Link 
                href="/admin/login"
                className="text-forest-green border-2 border-forest-green hover:bg-forest-green hover:text-pale-straw px-4 py-3 rounded-lg text-center transition-colors text-base font-medium block mb-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
              
              {/* User authenticated menu items for mobile */}
              {isESMPortalPage && isAuthenticated && (
                <div className="border-t border-forest-green/20 pt-4 mt-2">
                  <div className="text-center mb-3 text-deep-forest font-semibold">
                    {user?.fullName || 'My Account'}
                  </div>
                  <div className="space-y-3">
                    <Link 
                      href="/esm-portal/dashboard"
                      className="text-forest-green hover:text-moss-green transition-colors text-base font-medium flex items-center py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/esm-portal/my-products"
                      className="text-forest-green hover:text-moss-green transition-colors text-base font-medium flex items-center py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 mr-3" />
                      My Products
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-forest-green hover:text-moss-green transition-colors text-base font-medium flex items-center w-full py-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
              
              {/* Conditional rendering for BOOK NOW or LOGIN button */}
              {!isESMPortalPage ? (
                <Link 
                  href="/travel-listings"
                  className="bg-forest-green hover:bg-moss-green text-pale-straw px-4 py-3 rounded-lg text-center transition-colors duration-300 text-base font-medium block mt-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  BOOK NOW
                </Link>
              ) : (
                isAuthenticated ? (
                  <Link 
                    href="/esm-portal/dashboard"
                    className="bg-forest-green hover:bg-moss-green text-pale-straw px-4 py-3 rounded-lg text-center transition-colors duration-300 text-base font-medium block mt-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    DASHBOARD
                  </Link>
                ) : (
                  <Link 
                    href="/esm-portal/login"
                    className="bg-forest-green hover:bg-moss-green text-pale-straw px-4 py-3 rounded-lg text-center transition-colors duration-300 text-base font-medium block mt-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ESMHeader;