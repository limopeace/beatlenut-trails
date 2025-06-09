'use client';

import React from 'react';
import SectionContainer from '@/components/common/SectionContainer';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import { useState } from 'react';
import Image from 'next/image';

// Avatar Component for handling fallbacks
const TeamAvatar = ({ name, imagePath }: { name: string; imagePath: string }) => {
  const [imgError, setImgError] = useState(false);
  
  // Get initials from name
  const getInitials = () => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="w-full h-full bg-forest-green/20 flex items-center justify-center relative overflow-hidden">
      {!imgError ? (
        <img 
          src={imagePath}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-moss-green/30">
          <span className="text-2xl sm:text-3xl font-semibold text-deep-forest">
            {getInitials()}
          </span>
        </div>
      )}
    </div>
  );
};

export default function About() {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Col. Arjun Sharma (Retd.)',
      role: 'Founder & CEO',
      bio: 'After 26 years in the Indian Army, Col. Sharma founded BeatlenutTrails to share his passion for Northeast India while creating opportunities for fellow veterans.',
      image: '/images/team-placeholder-1.jpg',
    },
    {
      id: 2,
      name: 'Maj. Priya Desai (Retd.)',
      role: 'Head of Operations',
      bio: 'With extensive experience in logistics and operational planning, Maj. Desai ensures our travelers enjoy seamless, memorable experiences.',
      image: '/images/team-placeholder-2.jpg',
    },
    {
      id: 3,
      name: 'Capt. Rajiv Mehta (Retd.)',
      role: 'Head of ESM Program',
      bio: 'Passionate about veteran welfare, Capt. Mehta leads our ESM marketplace initiative, helping ex-servicemen build sustainable livelihoods.',
      image: '/images/team-placeholder-3.jpg',
    },
    {
      id: 4,
      name: 'Lt. Col. Vikram Singh (Retd.)',
      role: 'Chief Adventure Officer',
      bio: 'A mountaineering expert and former special forces officer, Lt. Col. Singh designs our adventure packages with safety and thrill in mind.',
      image: '/images/team-placeholder-4.jpg',
    },
  ];

  // Values data
  const values = [
    {
      id: 1,
      title: 'Excellence',
      description: 'We bring military precision and attention to detail to everything we do, ensuring the highest standards in all our services.',
      icon: '',
    },
    {
      id: 2,
      title: 'Integrity',
      description: 'We operate with unwavering honesty, transparency, and ethical practices in all our interactions and business dealings.',
      icon: '',
    },
    {
      id: 3,
      title: 'Community',
      description: 'We are committed to supporting both local communities in Northeast India and our ex-servicemen community.',
      icon: '',
    },
    {
      id: 4,
      title: 'Sustainability',
      description: 'We promote responsible tourism that preserves the natural beauty and cultural heritage of the regions we serve.',
      icon: '',
    },
    {
      id: 5,
      title: 'Innovation',
      description: 'We continuously seek creative solutions and fresh approaches to enhance our services and customer experience.',
      icon: '',
    },
    {
      id: 6,
      title: 'Respect',
      description: 'We honor the traditions, customs, and diversity of the communities we work with and the travelers we serve.',
      icon: '',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-96 md:h-128 overflow-hidden">
        <div className="absolute inset-0 bg-deep-forest/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/about-hero-placeholder.jpg')] bg-cover bg-center"></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-pale-straw mb-6 font-clash">Our Story</h1>
          <p className="text-xl text-pale-straw/90 max-w-2xl">
            "A soldier and a storyteller. A rider and a host. A trail that called — and two who answered."
          </p>
        </div>
      </div>

      {/* About Section */}
      <SectionContainer
        background="pale-straw"
        className="relative overflow-hidden py-16 md:py-24"
        id="about-section"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <FadeIn direction="right">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-deep-forest font-clash">Our Story</h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-deep-forest/90">
                <strong>Beatlenut Trails</strong> was born out of a simple truth: that the most memorable journeys are those that change something within us.
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-deep-forest/90">
                We are <strong>an adventure travel company founded by a retired Indian Army Veteran</strong> and <strong>Hame Kurbah</strong>, a hospitality expert and native of the Northeast. With decades of discipline, grit, and wanderlust between us, we left conventional careers behind to build something far more personal — a soulful, high-touch travel outfit that curates <strong>luxury expeditions, long-distance cycling and biking tours, forest immersions, and sacred trails</strong> across India and beyond.
              </p>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 mr-3 md:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-deep-forest/80"><strong>Real Access</strong> — Not tourist trails, but roads less taken: monasteries before dawn, villages that still tell stories, campsites where stars speak louder than words.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 mr-3 md:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-deep-forest/80"><strong>Safety First</strong> — As veterans of terrain and time, we prioritize your security without compromising on freedom or exploration.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 mr-3 md:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-deep-forest/80"><strong>Local Partnership</strong> — We work directly with tribal hosts, farmers, monks, and artists — ensuring every trip uplifts communities and preserves their voice.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-forest-green flex items-center justify-center text-pale-straw mt-1 mr-3 md:mr-4 flex-shrink-0">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-deep-forest/80"><strong>Mindful Travel</strong> — Whether you're riding through cloud forests or sitting still in a monastery courtyard, every moment is curated to reconnect you with what matters.</p>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn direction="left">
            <div className="relative h-80 sm:h-96 md:h-[450px] rounded-lg overflow-hidden shadow-lg border border-moss-green/10">
              <img 
                src="/images/real/pexels-dizitalboost-11622977-min.jpg" 
                alt="Our mission"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-pale-straw mb-2 sm:mb-3 font-clash">Why We Ride</h3>
                <p className="text-sm sm:text-base md:text-lg text-pale-straw/90">We believe that travel is not escape — it is <strong>return</strong>. To the land. To wonder. To stillness. And that when done right, it can be a prayer on two wheels, a poem by the fire, and a story passed on forever.</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-moss-green/20 rounded-full -mr-32 -mb-16 -z-10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-forest-green/5 rounded-full -ml-16 -mt-16 -z-10"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-forest-green/5 rounded-full -z-10"></div>
      </SectionContainer>

      {/* Founders Section */}
      <SectionContainer background="pale-straw" className="relative overflow-hidden py-16 md:py-24" id="founders-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-deep-forest font-clash">Meet the Founders</h2>
          <p className="text-base sm:text-lg md:text-xl text-deep-forest/90">The road brought us together. Now we build the trail for others.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-moss-green/20">
              <TeamAvatar name="Gurpreet Singh" imagePath="/images/team/gurpreet.jpeg" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-deep-forest">🪖 Gurpreet Singh</h3>
            <p className="text-sm text-deep-forest/70">Founder | Expedition Leader | Veteran</p>
            <p className="mt-2 text-center text-sm sm:text-base text-deep-forest/80">
              A retired Indian Army officer with over 30 years of leadership and outdoor experience, Gurpreet is the compass behind every Beatlenut expedition. From commanding high-altitude missions to curating soulful motorcycle and cycling routes, he brings unmatched precision, safety, and storytelling to every trail.
            </p>
            <p className="mt-1 text-sm text-deep-forest/80 italic">"Every journey should challenge the body, awaken the mind, and return you a little more alive."</p>
            <div className="mt-3 text-sm text-deep-forest/80">
              <p>🛡️ 30+ years of military, terrain, and leadership experience</p>
              <p>🏍️ Specialist in long-route biking, spiritual circuits, and luxury expeditions</p>
              <p>🗺️ Expert in offbeat Northeast India travel design</p>
            </div>
            <p className="mt-2 text-sm text-deep-forest/90 font-medium">👉 Talk to Gurpreet: +91 9501229112</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-moss-green/20">
              <TeamAvatar name="Hame Kurbah" imagePath="/images/founders/hame.jpg" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-deep-forest">🏡 Hame Kurbah</h3>
            <p className="text-sm text-deep-forest/70">Co-Founder | Hospitality Curator | Cultural Specialist</p>
            <p className="mt-2 text-center text-sm sm:text-base text-deep-forest/80">
              A native of the Khasi hills and a seasoned hospitality expert, Hame has spent years hosting travelers and weaving culture into comfort. He brings heart, heritage, and deep local insight into every Beatlenut journey — from curated village stays to off-grid luxury camps.
            </p>
            <p className="mt-1 text-sm text-deep-forest/80 italic">"I don't just want guests to see my homeland — I want them to feel it."</p>
            <div className="mt-3 text-sm text-deep-forest/80">
              <p>🌾 10+ years of boutique hospitality and guest experience curation</p>
              <p>🧭 Cultural guide across Meghalaya, Nagaland, and Mizoram</p>
              <p>🔥 Crafts soulful village stays, tribal immersions, and community-based tourism</p>
            </div>
            <p className="mt-2 text-sm text-deep-forest/90 font-medium">👉 Talk to Hame: +91 9362047953</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-base text-deep-forest/80 font-medium">🔗 Together, We Ride with Soul</p>
          <p className="text-sm text-deep-forest/70 mt-1">This isn't just about adventure — it's about belonging. Come, ride with us where the road ends and stories begin.</p>
        </div>
      </SectionContainer>

      {/* Our Team Section */}
      <SectionContainer
        background="pale-straw"
        className="relative overflow-hidden py-16 md:py-24"
        id="team-section"
      >
        <FadeIn direction="up" className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-deep-forest font-clash">Meet Our Team</h2>
          <p className="text-lg sm:text-xl text-deep-forest/80 max-w-3xl mx-auto">
            Ex-servicemen with a passion for Northeast India and expert local knowledge
          </p>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <StaggerItem key={member.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl border border-moss-green/10 p-6 sm:p-8 text-center h-full flex flex-col">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden mb-4 sm:mb-6 border-4 border-moss-green/20">
                  {/* Using the new TeamAvatar component */}
                  <TeamAvatar name={member.name} imagePath={member.image} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-deep-forest mb-1 sm:mb-2 font-clash">{member.name}</h3>
                <p className="text-forest-green font-medium mb-3 sm:mb-4">{member.role}</p>
                <p className="text-deep-forest/70 text-sm sm:text-base flex-grow">{member.bio}</p>
                <div className="mt-4 pt-4 border-t border-moss-green/20 flex justify-center space-x-4 sm:space-x-5">
                  <a href="#" className="text-forest-green hover:text-deep-forest transition-colors" aria-label="Facebook">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-forest-green hover:text-deep-forest transition-colors" aria-label="Twitter">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-forest-green hover:text-deep-forest transition-colors" aria-label="LinkedIn">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-moss-green/20 rounded-full -mr-32 -mb-16 -z-10"></div>
        <div className="absolute top-1/3 left-10 w-40 h-40 bg-moss-green/10 rounded-full -z-10"></div>
      </SectionContainer>

      {/* Our Values */}
      <SectionContainer
        background="deep-forest"
        className="relative overflow-hidden py-16 md:py-24"
        id="values-section"
      >
        <FadeIn direction="up" className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-pale-straw font-clash">Our Values</h2>
          <p className="text-lg sm:text-xl text-pale-straw/80 max-w-3xl mx-auto">
            The principles that guide us in everything we do
          </p>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((value) => (
            <StaggerItem key={value.id}>
              <div className="bg-pale-straw/10 p-6 sm:p-8 rounded-lg border border-pale-straw/10 hover:bg-pale-straw/20 transition-colors duration-300 h-full">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 md:mb-4 text-pale-straw font-clash">{value.title}</h3>
                <p className="text-pale-straw/90 text-base sm:text-lg">{value.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-moss-green/10 -z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pale-straw/5 rounded-full -mr-32 -mt-16 -z-10"></div>
        <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-pale-straw/5 rounded-full opacity-50 -z-10"></div>
      </SectionContainer>

      {/* Call to Action */}
      <SectionContainer
        background="forest-green"
        className="relative overflow-hidden text-center py-16 md:py-24"
        id="cta-section"
      >
        <FadeIn direction="up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-pale-straw font-clash">Join Us on This Journey</h2>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 md:mb-12 text-pale-straw/90">
            Experience Northeast India with those who know it best, while supporting a meaningful mission.
          </p>
          <div className="flex flex-col xs:flex-row justify-center items-center gap-4 sm:gap-6">
            <a
              href="/services"
              className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-pale-straw text-pale-straw font-medium rounded-md hover:bg-pale-straw hover:text-forest-green transition-colors duration-300 shadow-md text-base sm:text-lg"
            >
              Explore Our Services
            </a>
            <a
              href="/contact"
              className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-pale-straw text-forest-green font-medium rounded-md hover:bg-pale-straw/90 transition-colors duration-300 shadow-md text-base sm:text-lg"
            >
              Contact Us
            </a>
          </div>
        </FadeIn>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-12 bg-pale-straw/10 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-deep-forest/40 rounded-full -mr-32 -mb-16 -z-10"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pale-straw/5 rounded-full -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pale-straw/5 rounded-full -z-10"></div>
      </SectionContainer>
    </>
  );
}