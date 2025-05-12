'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '../common/SectionTitle';
import Button from '../common/Button';

const activities = [
  {
    id: 1,
    name: 'Trekking & Hiking',
    description: 'Explore scenic trails through mountains, forests, and valleys with breathtaking views.',
    icon: '🥾',
    href: '/activities/trekking',
  },
  {
    id: 2,
    name: 'Cultural Tours',
    description: 'Immerse yourself in the diverse cultures, traditions and festivals of Northeast India.',
    icon: '🏮',
    href: '/activities/cultural-tours',
  },
  {
    id: 3,
    name: 'Wildlife Safaris',
    description: 'Encounter exotic wildlife in their natural habitats across various national parks.',
    icon: '🦏',
    href: '/activities/wildlife-safaris',
  },
  {
    id: 4,
    name: 'River Rafting',
    description: 'Experience thrilling whitewater adventures on pristine rivers of the region.',
    icon: '🛶',
    href: '/activities/river-rafting',
  },
  {
    id: 5,
    name: 'Camping',
    description: 'Stay under the stars in beautiful remote locations with all comforts arranged.',
    icon: '⛺',
    href: '/activities/camping',
  },
  {
    id: 6,
    name: 'Photography Tours',
    description: 'Capture the perfect shots of landscapes, wildlife, and cultural experiences.',
    icon: '📸',
    href: '/activities/photography',
  },
];

const ActivityCategories = () => {
  return (
    <section className="section bg-off-white">
      <div className="container-custom">
        <SectionTitle
          title="Experiences & Activities"
          subtitle="Choose from a variety of curated experiences and adventures"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Link 
              key={activity.id} 
              href={activity.href}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
                <div className="text-4xl mb-4">{activity.icon}</div>
                <h3 className="text-xl font-bold text-deep-forest-green mb-2">{activity.name}</h3>
                <p className="text-dark-grey flex-grow">{activity.description}</p>
                <div className="mt-4 text-sunrise-orange font-medium group-hover:underline">
                  Explore Options &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button href="/activities" variant="primary">
            View All Activities
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActivityCategories;