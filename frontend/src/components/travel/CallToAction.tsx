'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '../animations';
import NextImage from '../common/NextImage';

const CallToAction = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
        <NextImage
          src="/images/cta-placeholder.jpg"
          alt="Northeast Landscape"
          fill
          className="object-cover"
          shimmer={false}
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-white font-script text-2xl">Plan Your Visit</span>
            <h2 className="text-4xl md:text-5xl text-white font-semibold mb-6">Ready for an Adventure of a Lifetime?</h2>
            <p className="text-lg text-gray-200 mb-12 max-w-3xl mx-auto">
              Let our expert guides take you on a journey through the magical landscapes and rich cultures of Northeast India.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20">
                <div className="w-16 h-16 bg-deep-forest-green rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🌿
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Expertly Curated</h3>
                <p className="text-gray-300">Carefully designed experiences to showcase the best of Northeast</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20">
                <div className="w-16 h-16 bg-deep-forest-green rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🛡️
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Ex-Army Guides</h3>
                <p className="text-gray-300">Travel safely with our experienced ex-servicemen guides</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20">
                <div className="w-16 h-16 bg-deep-forest-green rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🏮
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Cultural Immersion</h3>
                <p className="text-gray-300">Authentic experiences with local communities</p>
              </div>
            </div>

            <div className="mt-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">Get Travel Updates</h3>
              {isSuccess ? (
                <div className="bg-green-600 bg-opacity-30 border border-green-500 text-white p-4 rounded-lg">
                  Thanks for subscribing! We'll be in touch soon.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-grow px-4 py-3 rounded-l-lg bg-white bg-opacity-10 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-r-lg bg-deep-forest-green text-white font-medium hover:bg-opacity-90 transition duration-300 disabled:opacity-70"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-deep-forest-green text-white font-medium rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300"
              >
                Plan Your Trip
              </Link>
              <Link
                href="/packages"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-deep-forest-green transition duration-300"
              >
                Browse Packages
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CallToAction;