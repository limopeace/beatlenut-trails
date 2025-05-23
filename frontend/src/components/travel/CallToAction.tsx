'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faShield, faLandmark } from '@fortawesome/free-solid-svg-icons';
import { WhatsAppButton } from '@/components/common';
import SectionContainer from '@/components/common/SectionContainer';
import FadeIn from '@/components/animations/FadeIn';

interface CallToActionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  showIcons?: boolean;
  showEmailSignup?: boolean;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = "Ready for an Adventure of a Lifetime?",
  subtitle = "Let our expert guides take you on a journey through the magical landscapes and rich cultures of Northeast India.",
  buttonText = "Plan Your Trip",
  buttonLink = "/contact",
  backgroundImage = "/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg",
  showIcons = true,
  showEmailSignup = true
}) => {
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
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Enhanced Background Image with Multiple Overlays for better readability */}
      <div className="absolute inset-0">
        {/* Base dark overlay with reduced opacity */}
        <div className="absolute inset-0 bg-deep-forest/70 z-10"></div>
        
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Northeast Landscape"
            className="absolute w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Additional gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-10"></div>
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.7)] z-10"></div>
        
        {/* Faint texture overlay */}
        <div className="absolute inset-0 opacity-30 z-10" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 0h2v2H1V0zm0 4h2v2H1V4zm0 4h2v2H1V8zm0 4h2v2H1v-2zm0 4h2v2H1v-2zM5 0h2v2H5V0zm0 8h2v2H5V8zm0 8h2v2H5v-2zM9 0h2v2H9V0zm0 4h2v2H9V4zm0 4h2v2H9V8zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 0h2v2h-2V0zm0 8h2v2h-2V8zm0 8h2v2h-2v-2zM17 0h2v2h-2V0zm0 4h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '8px 8px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-20">
        <FadeIn direction="up">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo - scaled for mobile */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                <img 
                  src="/images/beatlenut-logo.png" 
                  alt="BeatlenutTrails Logo" 
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Header text - enhanced with text shadows for better readability */}
            <span className="text-moss-green text-lg sm:text-xl md:text-2xl font-serif drop-shadow-md">Plan Your Visit</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-pale-straw font-semibold mb-3 sm:mb-4 md:mb-6 mt-1 sm:mt-2 font-clash drop-shadow-lg">{title}</h2>
            <p className="text-base sm:text-lg text-pale-straw/90 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
              {subtitle}
            </p>

            {/* Feature cards - improved grid for mobile */}
            {showIcons && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                <FadeIn direction="up" delay={0.1} className="bg-deep-forest/60 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-lg border border-pale-straw/15 hover:bg-deep-forest/70 transition-colors duration-300 shadow-lg">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-forest-green rounded-full flex items-center justify-center text-pale-straw mx-auto mb-3 sm:mb-4 shadow-md">
                    <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-pale-straw text-lg sm:text-xl font-semibold mb-1 sm:mb-2 font-clash drop-shadow-md">Expertly Curated</h3>
                  <p className="text-pale-straw/90 text-sm sm:text-base leading-relaxed">Carefully designed experiences to showcase the best of Northeast</p>
                </FadeIn>

                <FadeIn direction="up" delay={0.2} className="bg-deep-forest/60 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-lg border border-pale-straw/15 hover:bg-deep-forest/70 transition-colors duration-300 shadow-lg">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-forest-green rounded-full flex items-center justify-center text-pale-straw mx-auto mb-3 sm:mb-4 shadow-md">
                    <FontAwesomeIcon icon={faShield} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-pale-straw text-lg sm:text-xl font-semibold mb-1 sm:mb-2 font-clash drop-shadow-md">Ex-Army Guides</h3>
                  <p className="text-pale-straw/90 text-sm sm:text-base leading-relaxed">Travel safely with our experienced ex-servicemen guides</p>
                </FadeIn>

                <FadeIn direction="up" delay={0.3} className="bg-deep-forest/60 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-lg border border-pale-straw/15 hover:bg-deep-forest/70 transition-colors duration-300 shadow-lg sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-forest-green rounded-full flex items-center justify-center text-pale-straw mx-auto mb-3 sm:mb-4 shadow-md">
                    <FontAwesomeIcon icon={faLandmark} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-pale-straw text-lg sm:text-xl font-semibold mb-1 sm:mb-2 font-clash drop-shadow-md">Cultural Immersion</h3>
                  <p className="text-pale-straw/90 text-sm sm:text-base leading-relaxed">Authentic experiences with local communities</p>
                </FadeIn>
              </div>
            )}

            {/* Email signup - enhanced for better readability */}
            {showEmailSignup && (
              <FadeIn direction="up" delay={0.4} className="mt-6 sm:mt-8 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-pale-straw mb-3 sm:mb-4 font-clash drop-shadow-md">Get Travel Updates</h3>
                {isSuccess ? (
                  <div className="bg-forest-green/50 backdrop-blur-md border border-forest-green/60 text-pale-straw p-3 sm:p-4 rounded-lg text-sm sm:text-base shadow-md">
                    Thanks for subscribing! We'll be in touch soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="flex-grow px-4 py-3.5 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-deep-forest/60 backdrop-blur-md border border-pale-straw/30 text-pale-straw placeholder-pale-straw/60 focus:outline-none focus:ring-2 focus:ring-forest-green/70 text-base shadow-md"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 sm:px-6 py-3.5 sm:py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none bg-forest-green text-pale-straw font-medium hover:bg-moss-green transition duration-300 disabled:opacity-70 text-base shadow-md"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                )}
              </FadeIn>
            )}

            {/* CTA buttons - enhanced for better mobile experience */}
            <FadeIn direction="up" delay={0.5} className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <WhatsAppButton 
                template="customTour"
                source="cta"
                className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-4 sm:py-3.5 bg-forest-green text-pale-straw font-semibold rounded-lg shadow-xl hover:bg-moss-green transition-colors duration-300 text-base border border-forest-green/50 flex items-center justify-center"
                showIcon={true}
                showText={true}
                text="Plan via WhatsApp"
              />
              <Link
                href={buttonLink}
                className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-4 sm:py-3.5 bg-deep-forest/40 backdrop-blur-md border-2 border-pale-straw text-pale-straw font-semibold rounded-lg hover:bg-pale-straw hover:text-deep-forest transition-colors duration-300 text-base shadow-xl flex items-center justify-center"
              >
                {buttonText}
              </Link>
            </FadeIn>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CallToAction;