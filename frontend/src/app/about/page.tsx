import React from 'react';
import Image from 'next/image';
import SectionTitle from '@/components/common/SectionTitle';
import Button from '@/components/common/Button';

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
      icon: '🏆',
    },
    {
      id: 2,
      title: 'Integrity',
      description: 'We operate with unwavering honesty, transparency, and ethical practices in all our interactions and business dealings.',
      icon: '🛡️',
    },
    {
      id: 3,
      title: 'Community',
      description: 'We are committed to supporting both local communities in Northeast India and our ex-servicemen community.',
      icon: '🤝',
    },
    {
      id: 4,
      title: 'Sustainability',
      description: 'We promote responsible tourism that preserves the natural beauty and cultural heritage of the regions we serve.',
      icon: '🌱',
    },
    {
      id: 5,
      title: 'Innovation',
      description: 'We continuously seek creative solutions and fresh approaches to enhance our services and customer experience.',
      icon: '💡',
    },
    {
      id: 6,
      title: 'Respect',
      description: 'We honor the traditions, customs, and diversity of the communities we work with and the travelers we serve.',
      icon: '🙏',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:py-32 bg-deep-forest-green text-off-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
              <p className="text-xl mb-8">
                Founded by Army veterans with a deep love for Northeast India, BeatlenutTrails was born from a vision to share the region's unparalleled beauty while creating opportunities for ex-servicemen.
              </p>
              <Button 
                href="#team" 
                variant="primary"
              >
                Meet Our Team
              </Button>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/about-hero-placeholder.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-r from-deep-forest-green/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="section bg-off-white">
        <div className="container-custom">
          <SectionTitle
            title="Our Journey"
            subtitle="How BeatlenutTrails evolved from a dream to reality"
          />
          
          <div className="relative border-l-4 border-deep-forest-green ml-6 md:ml-0 md:mx-auto md:max-w-4xl pl-6 md:pl-0">
            {/* Timeline items */}
            <div className="mb-16 md:grid md:grid-cols-2 md:gap-12">
              <div className="md:text-right md:pr-10 relative">
                <div className="absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green md:left-auto md:right-0 transform md:translate-x-1/2"></div>
                <h3 className="text-xl font-bold text-deep-forest-green mb-2">2018</h3>
                <p className="text-dark-grey">
                  After retiring from the Indian Army, Col. Arjun Sharma begins conducting small group tours in Meghalaya for friends and family.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:pl-10 relative">
                <div className="hidden md:block absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green transform translate-x-1/2"></div>
              </div>
            </div>
            
            <div className="mb-16 md:grid md:grid-cols-2 md:gap-12">
              <div className="md:text-right md:pr-10 relative md:col-start-1 md:row-start-2">
                <div className="absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green md:left-auto md:right-0 transform md:translate-x-1/2"></div>
              </div>
              <div className="mt-8 md:mt-0 md:pl-10 relative md:col-start-2 md:row-start-2">
                <div className="hidden md:block absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green transform translate-x-1/2"></div>
                <h3 className="text-xl font-bold text-deep-forest-green mb-2">2019</h3>
                <p className="text-dark-grey">
                  The team expands as more ex-servicemen join, bringing expertise in logistics, operations, and local knowledge. First official tours launched.
                </p>
              </div>
            </div>
            
            <div className="mb-16 md:grid md:grid-cols-2 md:gap-12">
              <div className="md:text-right md:pr-10 relative">
                <div className="absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green md:left-auto md:right-0 transform md:translate-x-1/2"></div>
                <h3 className="text-xl font-bold text-deep-forest-green mb-2">2020-21</h3>
                <p className="text-dark-grey">
                  During the pandemic, the team pivots to develop sustainable tourism models and strengthens connections with local communities.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:pl-10 relative">
                <div className="hidden md:block absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green transform translate-x-1/2"></div>
              </div>
            </div>
            
            <div className="mb-16 md:grid md:grid-cols-2 md:gap-12">
              <div className="md:text-right md:pr-10 relative md:col-start-1 md:row-start-4">
                <div className="absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green md:left-auto md:right-0 transform md:translate-x-1/2"></div>
              </div>
              <div className="mt-8 md:mt-0 md:pl-10 relative md:col-start-2 md:row-start-4">
                <div className="hidden md:block absolute top-0 -left-10 w-6 h-6 rounded-full bg-deep-forest-green transform translate-x-1/2"></div>
                <h3 className="text-xl font-bold text-deep-forest-green mb-2">2022</h3>
                <p className="text-dark-grey">
                  BeatlenutTrails officially launches with expanded services across Northeast India. The ESM marketplace initiative begins.
                </p>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-2 md:gap-12">
              <div className="md:text-right md:pr-10 relative">
                <div className="absolute top-0 -left-10 w-6 h-6 rounded-full bg-sunrise-orange md:left-auto md:right-0 transform md:translate-x-1/2"></div>
                <h3 className="text-xl font-bold text-deep-forest-green mb-2">Today</h3>
                <p className="text-dark-grey">
                  With a growing team of ex-servicemen and local experts, we offer comprehensive travel experiences and a thriving marketplace supporting veteran entrepreneurs.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:pl-10 relative">
                <div className="hidden md:block absolute top-0 -left-10 w-6 h-6 rounded-full bg-sunrise-orange transform translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="section bg-white">
        <div className="container-custom">
          <SectionTitle
            title="Meet Our Team"
            subtitle="Ex-servicemen with a passion for Northeast India and expert local knowledge"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="card p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 bg-gray-300">
                    {/* Placeholder or actual image */}
                    <div className="w-full h-full flex items-center justify-center text-deep-forest-green">
                      Photo
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-deep-forest-green mb-1">{member.name}</h3>
                <p className="text-sunrise-orange font-medium mb-3">{member.role}</p>
                <p className="text-dark-grey">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section bg-deep-forest-green text-off-white">
        <div className="container-custom">
          <SectionTitle
            title="Our Values"
            subtitle="The principles that guide us in everything we do"
            className="text-off-white"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.id} className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="section bg-off-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="relative h-96 lg:h-full rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/mission-placeholder.jpg')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest-green/60 to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-deep-forest-green">Our Mission</h2>
                <p className="text-lg mb-6">
                  To showcase the unparalleled beauty and cultural richness of Northeast India through authentic, sustainable travel experiences while creating meaningful opportunities for ex-servicemen.
                </p>
                <p className="mb-6">
                  We are committed to:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-sunrise-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Providing exceptional travel experiences that highlight the region's natural wonders and cultural heritage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-sunrise-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Supporting ex-servicemen in their transition to civilian careers through our ESM marketplace</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-sunrise-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Promoting sustainable tourism practices that benefit local communities and preserve the environment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-sunrise-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Building bridges between travelers and local communities for authentic cultural exchanges</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-deep-forest-green">Our Vision</h2>
                <p className="text-lg mb-6">
                  To be the leading sustainable tourism provider in Northeast India while creating a thriving ecosystem that empowers ex-servicemen and local communities.
                </p>
                <p>
                  We envision a future where:
                </p>
                <ul className="space-y-3 mt-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-sunrise-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Northeast India is recognized globally for its unique natural beauty and cultural heritage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-sunrise-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ex-servicemen have thriving second careers in tourism and related industries</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-sunrise-orange mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sustainable tourism practices benefit local economies while preserving natural resources</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-sunrise-orange text-off-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us on This Journey</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Experience Northeast India with those who know it best, while supporting a meaningful mission.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              href="/services"
              variant="secondary"
              className="border-2 border-off-white text-off-white hover:bg-off-white hover:text-sunrise-orange"
            >
              Explore Our Services
            </Button>
            <Button
              href="/contact"
              variant="primary"
              className="bg-deep-forest-green hover:bg-vibrant-teal"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}