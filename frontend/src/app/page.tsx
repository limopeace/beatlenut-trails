import Hero from '@/components/travel/Hero';
import SearchBar from '@/components/travel/SearchBar';
import FeaturedServices from '@/components/travel/FeaturedServices';
import AboutSnippet from '@/components/travel/AboutSnippet';
import FeaturedDestinations from '@/components/travel/FeaturedDestinations';
import Testimonial from '@/components/travel/Testimonial';
import ESMPromotion from '@/components/travel/ESMPromotion';
import CallToAction from '@/components/travel/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <FeaturedServices />
      <AboutSnippet />
      <FeaturedDestinations />
      <Testimonial />
      <ESMPromotion />
      <CallToAction />
    </>
  );
}