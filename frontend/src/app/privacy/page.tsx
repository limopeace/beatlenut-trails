'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">1. Information Collection</h2>
          <p className="mb-6">We collect information you provide when using our platform and ESM portal.</p>
          
          <h2 className="text-xl font-semibold mb-4">2. Data Usage</h2>
          <p className="mb-6">Your data is used to provide services and connect ESM sellers with customers.</p>
          
          <h2 className="text-xl font-semibold mb-4">3. Data Protection</h2>
          <p className="mb-6">We implement security measures to protect your personal information.</p>
          
          <h2 className="text-xl font-semibold mb-4">4. Contact</h2>
          <p>For privacy concerns, contact us at privacy@beatlenut-trails.com</p>
        </div>
      </div>
    </div>
  );
}