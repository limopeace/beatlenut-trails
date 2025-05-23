'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';
import LoginForm from '@/components/marketplace/auth/LoginForm';
import { useEsmAuth } from '@/hooks/useEsmAuth';

export default function ESMLoginPage() {
  const { isAuthenticated, user } = useEsmAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'seller') {
        router.push('/esm-portal/dashboard');
      } else {
        router.push('/esm-portal/buyer-profile');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <>
      {/* Page Header */}
      <section className="esm-hero-section">
        <div className="esm-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="esm-section-title text-center">
              Ex-Servicemen Login
            </h1>
            <p className="text-xl text-pale-straw/90 mb-0">
              Access your seller account to manage your products and services
            </p>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="esm-form-section">
        <div className="esm-container">
          <div className="max-w-xl mx-auto">
            <LoginForm />
            
            {/* Additional Information */}
            <div className="mt-12 bg-light-grey rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">New to ESM Marketplace?</h3>
              <p className="text-gray-600 mb-6">
                Are you an Ex-Serviceman looking to sell your products or services? Join our growing community of veteran entrepreneurs and service providers.
              </p>
              <Link href="/esm-portal/register" passHref>
                <Button variant="primary" className="esm-btn-primary">
                  Register as a Seller
                </Button>
              </Link>
              
              <div className="mt-8 p-4 bg-white rounded-md border-l-4 border-forest-green">
                <p className="font-medium">Need Help?</p>
                <p className="text-gray-600 mb-2">
                  If you have any questions or need assistance with the login process, our support team is here to help.
                </p>
                <Button
                  href="/esm-portal/support"
                  variant="tertiary"
                  className="esm-btn-tertiary"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}