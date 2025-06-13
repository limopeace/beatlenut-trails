'use client';

import React from 'react';
import Image from 'next/image';

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Gurpreet Singh",
      role: "Founder & CEO",
      image: "/images/team/gurpreet.jpeg",
      description: "Travel enthusiast and Northeast India expert with over 10 years of experience."
    },
    {
      id: 2,
      name: "Ex-Servicemen Network",
      role: "ESM Portal Partners",
      image: "/images/hero-placeholder.jpg",
      description: "Dedicated veterans providing quality products and services through our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Meet Our Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-4">{member.role}</p>
              <p className="text-gray-700">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}