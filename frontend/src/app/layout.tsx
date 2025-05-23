'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import '../styles/globals.css';
import '../styles/home.css';
import '../styles/beatlenut-style.css';
import '../styles/fonts.css';
import '../styles/esm-portal-style.css';
import BeatlenutHeader from '@/components/travel/BeatlenutHeader';
import BeatlenutFooter from '@/components/travel/BeatlenutFooter';
import ESMHeader from '@/components/marketplace/ESMHeader';
import DemoLinks from '@/components/common/DemoLinks';
import { CartProvider } from '@/utils/cartContext';
import { Space_Grotesk, Outfit } from 'next/font/google';

// Define the fonts
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
});

// We need to move metadata to a separate file since this is now a client component
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're in the admin section or ESM Portal based on the pathname
  const isAdminPage = pathname?.startsWith('/admin');
  const isESMPortalPage = pathname?.startsWith('/esm-portal');

  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body>
        <CartProvider>
          {!isAdminPage && !isESMPortalPage && <BeatlenutHeader />}
          {isESMPortalPage && <ESMHeader />}
          <main>{children}</main>
          {!isAdminPage && !isESMPortalPage && <BeatlenutFooter />}
          {isESMPortalPage && (
            <footer className="bg-deep-forest text-pale-straw py-8">
              <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">ESM Marketplace</h3>
                    <p className="mb-4">
                      Supporting our heroes through a platform that connects skilled Ex-Servicemen with customers looking for quality products and services.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
                      <ul className="space-y-2">
                        <li><a href="/esm-portal" className="hover:text-moss-green transition-colors">Home</a></li>
                        <li><a href="/esm-portal/products" className="hover:text-moss-green transition-colors">Products</a></li>
                        <li><a href="/esm-portal/services" className="hover:text-moss-green transition-colors">Services</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Account</h4>
                      <ul className="space-y-2">
                        <li><a href="/esm-portal/login" className="hover:text-moss-green transition-colors">Login</a></li>
                        <li><a href="/esm-portal/register" className="hover:text-moss-green transition-colors">Register</a></li>
                        <li><a href="/esm-portal/dashboard" className="hover:text-moss-green transition-colors">Dashboard</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="border-t border-pale-straw/20 mt-8 pt-8 text-center text-sm">
                  <p>&copy; {new Date().getFullYear()} ESM Marketplace. All rights reserved.</p>
                </div>
              </div>
            </footer>
          )}
        </CartProvider>
      </body>
    </html>
  );
}