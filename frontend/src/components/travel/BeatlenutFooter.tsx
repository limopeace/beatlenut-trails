'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faHeart, 
  faLeaf, 
  faMountain, 
  faCompass, 
  faHandshake,
  faTree
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faYoutube, 
  faLinkedinIn, 
  faPinterestP, 
  faTiktok 
} from '@fortawesome/free-brands-svg-icons';

const BeatlenutFooter = () => {
  return (
    <footer className="text-pale-straw relative">
      {/* Mountain Background Image with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/real/pexels-travelerchitect-18736328-min.jpg"
          alt="Mountain landscape"
          fill
          style={{ objectFit: 'cover' }}
          className="blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-deep-forest/90 backdrop-blur-sm"></div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 relative z-10 text-center">
        {/* Logo Section with Mountain Icon */}
        <div className="flex justify-center items-center mb-10">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24">
                <img 
                  src="/images/beatlenut-logo.png" 
                  alt="BeatlenutTrails Logo" 
                  className="w-full h-full"
                />
              </div>
            </div>
            <p className="text-moss-green uppercase text-sm tracking-wider font-clash">NORTHEAST INDIA TRAVEL SPECIALISTS</p>
          </div>
        </div>
        
        {/* Icon Feature Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span className="w-12 h-12 bg-forest-green/50 backdrop-blur-sm rounded-full flex items-center justify-center text-pale-straw">
                <FontAwesomeIcon icon={faCompass} className="w-6 h-6" />
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1 font-clash text-pale-straw">EXPERTISE</h3>
            <p className="text-moss-green text-sm">Local guides with years of experience</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span className="w-12 h-12 bg-forest-green/50 backdrop-blur-sm rounded-full flex items-center justify-center text-pale-straw">
                <FontAwesomeIcon icon={faTree} className="w-6 h-6" />
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1 font-clash text-pale-straw">SUSTAINABILITY</h3>
            <p className="text-moss-green text-sm">Eco-friendly travel practices</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span className="w-12 h-12 bg-forest-green/50 backdrop-blur-sm rounded-full flex items-center justify-center text-pale-straw">
                <FontAwesomeIcon icon={faHandshake} className="w-6 h-6" />
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1 font-clash text-pale-straw">COMMUNITY</h3>
            <p className="text-moss-green text-sm">Supporting local communities</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span className="w-12 h-12 bg-forest-green/50 backdrop-blur-sm rounded-full flex items-center justify-center text-pale-straw">
                <FontAwesomeIcon icon={faLeaf} className="w-6 h-6" />
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1 font-clash text-pale-straw">AUTHENTICITY</h3>
            <p className="text-moss-green text-sm">Genuine cultural experiences</p>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mb-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Travel Links */}
            <div className="text-center">
              <h3 className="font-clash font-bold text-xl mb-4 text-pale-straw uppercase">Travel Experiences</h3>
              <ul className="space-y-2">
                <li><Link href="/travel-listings" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">ALL LISTINGS</Link></li>
                <li><Link href="/packages/adventure-tours" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">ADVENTURE TOURS</Link></li>
                <li><Link href="/packages/cultural-expeditions" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">CULTURAL EXPEDITIONS</Link></li>
                <li><Link href="/packages/wildlife-safaris" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">WILDLIFE SAFARIS</Link></li>
                <li><Link href="/packages/monastery-tours" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">MONASTERY TOURS</Link></li>
                <li><Link href="/packages/tea-garden-tours" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">TEA GARDEN TOURS</Link></li>
                <li><Link href="/packages/photography-tours" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">PHOTOGRAPHY TOURS</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div className="text-center">
              <h3 className="font-clash font-bold text-xl mb-4 text-pale-straw uppercase">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">ABOUT US</Link></li>
                <li><Link href="/team" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">OUR TEAM</Link></li>
                <li><Link href="/testimonials" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">TESTIMONIALS</Link></li>
                <li><Link href="/blog" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">TRAVEL BLOG</Link></li>
                <li><Link href="/terms" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">TERMS & CONDITIONS</Link></li>
                <li><Link href="/privacy" className="text-moss-green hover:text-pale-straw transition-colors font-clash text-sm">PRIVACY POLICY</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div className="text-center">
              <h3 className="font-clash font-bold text-xl mb-4 text-pale-straw uppercase">Contact Us</h3>
              <address className="not-italic text-moss-green space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-pale-straw mb-2" />
                  <p>
                    123 Adventure Lane<br />
                    Guwahati, Assam 781003<br />
                    India
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-pale-straw mb-2" />
                  <p>
                    <a href="tel:+919876543210" className="text-moss-green hover:text-pale-straw transition-colors">+91 98765 43210</a>
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-pale-straw mb-2" />
                  <p>
                    <a href="mailto:info@beatlenuttrails.com" className="text-moss-green hover:text-pale-straw transition-colors">info@beatlenuttrails.com</a>
                  </p>
                </div>
              </address>
            </div>
          </div>
        </div>
        
        {/* Enhanced Social Media Section */}
        <div className="mb-10">
          <h3 className="font-clash font-bold text-lg mb-4 text-pale-straw uppercase">Connect With Us</h3>
          <div className="flex justify-center space-x-5">
            <a href="#" className="bg-forest-green/50 hover:bg-forest-green backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
            </a>
            <a href="#" className="bg-forest-green/50 hover:bg-forest-green backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
            </a>
            <a href="#" className="bg-forest-green/50 hover:bg-forest-green backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
            </a>
            <a href="#" className="bg-forest-green/50 hover:bg-forest-green backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
            </a>
            <a href="#" className="bg-forest-green/50 hover:bg-forest-green backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faLinkedinIn} className="w-5 h-5" />
            </a>
            <a href="#" className="bg-forest-green/50 hover:bg-forest-green backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faPinterestP} className="w-5 h-5" />
            </a>
            <a href="#" className="bg-forest-green/50 hover:bg-forest-green backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="text-center border-t border-moss-green/30 pt-6">
          <p className="text-pale-straw font-clash text-sm mb-2">© {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
          <p className="text-moss-green text-xs mb-4">Curated travel experiences in Northeast India by Army veterans.</p>
          <p className="text-xs text-moss-green flex items-center justify-center">
            Made with <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-red-400 mx-1" /> by 
            <a href="https://betafactory.tech" target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-pale-straw transition-colors">
              Beta Factory
            </a>
          </p>
        </div>
      </div>
      
      {/* Call button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <a 
          href="tel:+919876543210"
          className="bg-forest-green hover:bg-moss-green text-pale-straw w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
          aria-label="Call Us"
        >
          <FontAwesomeIcon icon={faPhone} className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};

export default BeatlenutFooter;