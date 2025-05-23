'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GalleryMasonryDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Navigation links
  const navLinks = [
    { href: '/gallery-demo', label: 'Grid Gallery' },
    { href: '/gallery-masonry-demo', label: 'Masonry Gallery' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">PhotoSwipe V5 Demo</h1>
          
          <nav className="mt-4">
            <ul className="flex space-x-4 border-b border-gray-200">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className={`block px-4 py-2 border-b-2 font-medium text-sm ${
                        isActive 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            PhotoSwipe v5 Gallery Component Demo | Implemented with React and Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}