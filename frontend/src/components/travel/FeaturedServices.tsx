'use client';

import React from 'react';
import Card from '../common/Card';
import SectionTitle from '../common/SectionTitle';
import Button from '../common/Button';

const services = [
  {
    id: 1,
    title: 'Guided Tours',
    description: 'Expert-led adventures through ancient trails and hidden gems of Northeast India.',
    imageSrc: '/images/service-placeholder-1.jpg',
    href: '/services/guided-tours',
  },
  {
    id: 2,
    title: 'Cultural Experiences',
    description: 'Immerse yourself in the rich cultural heritage of diverse ethnic communities.',
    imageSrc: '/images/service-placeholder-2.jpg',
    href: '/services/cultural-experiences',
  },
  {
    id: 3,
    title: 'Wildlife Safaris',
    description: 'Explore the diverse wildlife and natural habitats of the region.',
    imageSrc: '/images/service-placeholder-3.jpg',
    href: '/services/wildlife-safaris',
  },
  {
    id: 4,
    title: 'Adventure Activities',
    description: 'Experience thrilling adventures from trekking to river rafting and more.',
    imageSrc: '/images/service-placeholder-4.jpg',
    href: '/services/adventure-activities',
  },
];

const FeaturedServices = () => {
  return (
    <section className="section bg-off-white">
      <div className="container-custom">
        <SectionTitle
          title="Unforgettable Experiences"
          subtitle="Discover the unique services we offer to make your Northeast India journey memorable"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              title={service.title}
              description={service.description}
              imageSrc={service.imageSrc}
              imageAlt={service.title}
              href={service.href}
              footer={
                <Button href={service.href} variant="tertiary">
                  Learn More
                </Button>
              }
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button href="/services" variant="secondary">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;