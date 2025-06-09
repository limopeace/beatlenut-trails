'use client';

import React from 'react';
import SectionContainer from '@/components/common/SectionContainer';
import FadeIn from '@/components/animations/FadeIn';

export default function TermsOfService() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-deep-forest/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center"></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-pale-straw mb-4 font-clash">Terms of Service</h1>
          <p className="text-lg text-pale-straw/90 max-w-2xl">
            Booking terms and conditions for Beatlenut Trails expeditions
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <SectionContainer
        background="pale-straw"
        className="relative overflow-hidden py-16 md:py-24"
        id="terms-content"
      >
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 border border-moss-green/10">
              
              {/* Quick Terms Summary */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-deep-forest mb-6 font-clash">
                  📝 Quick Terms Summary – Beatlenut Trails
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Booking</h3>
                      <p className="text-deep-forest/80">50% advance to confirm. Balance due 14 days before travel.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Cancellation</h3>
                      <p className="text-deep-forest/80">90% refund before 30 days. 50% refund before 15 days. No refund within 14 days.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Changes</h3>
                      <p className="text-deep-forest/80">We may adjust the route due to weather or safety.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Travel Insurance</h3>
                      <p className="text-deep-forest/80">Strongly recommended (we assist with documents).</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Health & Safety</h3>
                      <p className="text-deep-forest/80">Please share medical conditions. Safety gear is mandatory.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">6</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Motorbike Tours</h3>
                      <p className="text-deep-forest/80">Valid license required. Riders are liable for damage due to misuse.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">7</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Conduct</h3>
                      <p className="text-deep-forest/80">Respect local culture, nature, and group safety guidelines.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">8</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Liability</h3>
                      <p className="text-deep-forest/80">We are not responsible for loss, accidents, or weather delays.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 flex-shrink-0">
                      <span className="text-sm font-bold">9</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-deep-forest mb-2">Media</h3>
                      <p className="text-deep-forest/80">Photos/videos may be taken unless you opt out in advance.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-moss-green/10 rounded-lg border border-moss-green/20">
                  <p className="text-deep-forest font-medium">
                    By confirming your journey, you agree to these terms so we can travel with trust, clarity, and care.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-moss-green/20 pt-8">
                <h2 className="text-xl font-bold text-deep-forest mb-4 font-clash">Questions?</h2>
                <div className="space-y-3">
                  <p className="flex items-center text-deep-forest/80">
                    <span className="mr-2">📞</span>
                    Call us at +91 9501229112 or +91 9362047953
                  </p>
                  <p className="flex items-center text-deep-forest/80">
                    <span className="mr-2">📧</span>
                    Email: gurpreet.nijher@gmail.com
                  </p>
                  <p className="flex items-center text-deep-forest/80">
                    <span className="mr-2">📸</span>
                    Instagram: @beatlenut_trails
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-moss-green/20 rounded-full -mr-32 -mb-16 -z-10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-forest-green/5 rounded-full -ml-16 -mt-16 -z-10"></div>
      </SectionContainer>
    </>
  );
}