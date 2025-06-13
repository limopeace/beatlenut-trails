'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Terms and Conditions</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">By using our platform, you agree to these terms and conditions.</p>
          
          <h2 className="text-xl font-semibold mb-4">2. ESM Portal Services</h2>
          <p className="mb-6">Our ESM portal connects Ex-Servicemen with customers for products and services.</p>
          
          <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-6">Users are responsible for maintaining the confidentiality of their accounts.</p>
          
          <h2 className="text-xl font-semibold mb-4">4. Contact</h2>
          <p>For questions about these terms, contact us at support@beatlenut-trails.com</p>
        </div>
      </div>
    </div>
  );
}