'use client';

import Hero from '@/components/travel/Hero';
import SearchBar from '@/components/travel/SearchBar';
import FeaturedServices from '@/components/travel/FeaturedServices';
import AboutSnippet from '@/components/travel/AboutSnippet';
import FeaturedDestinations from '@/components/travel/FeaturedDestinations';
import ActivityCategories from '@/components/travel/ActivityCategories';
import TravelPackages from '@/components/travel/TravelPackages';
import Testimonial from '@/components/travel/Testimonial';
import ESMPromotion from '@/components/travel/ESMPromotion';
import CallToAction from '@/components/travel/CallToAction';
import Statistics from '@/components/travel/Statistics';
import MarqueeText from '@/components/travel/MarqueeText';
import { PageTransition } from '@/components/animations';

export default function Home() {
  const marqueeTexts = [
    "COME TRAVEL. FEEL FREE.",
    "EXPLORE NORTHEAST. DISCOVER YOURSELF.",
    "EXPERIENCE CULTURE. EMBRACE NATURE.",
    "JOURNEY TOGETHER. CREATE MEMORIES.",
  ];

  return (
    <PageTransition>
      <main className="overflow-hidden">
        <Hero />
        <SearchBar />
        <MarqueeText phrases={marqueeTexts} />
        <FeaturedDestinations />
        <Statistics />
        <FeaturedServices />
        <ActivityCategories />
        <TravelPackages />
        <AboutSnippet />
        <Testimonial />
        <ESMPromotion />
        <CallToAction />
      </main>
    </PageTransition>
  );
}