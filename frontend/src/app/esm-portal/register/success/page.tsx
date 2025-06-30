import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function RegistrationSuccessPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest-green pt-40 pb-16 md:pt-48 md:pb-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Registration Successful
            </h1>
            <p className="text-xl mb-0">
              Thank you for registering with the ESM Marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Success Message */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-deep-forest-green mb-4">Your Application Has Been Submitted</h2>
              
              <p className="text-gray-700 mb-8 text-lg">
                Thank you for applying to join our Ex-Servicemen Marketplace. We've received your registration and our team will review your application.
              </p>
              
              <div className="bg-light-grey p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-xl mb-4">What happens next?</h3>
                <ol className="text-left space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-gray-700">
                        Our team will <strong>verify your Ex-Serviceman status</strong> using the documentation you provided. This process typically takes 1-2 business days.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-gray-700">
                        You'll receive an <strong>email notification</strong> when your account is approved.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-gray-700">
                        Once approved, you can <strong>log in to your account</strong> and start creating listings for your products or services.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/esm-portal" passHref>
                  <Button variant="primary" className="bg-deep-forest-green text-pale-straw hover:bg-vibrant-teal">
                    Return to ESM Portal
                  </Button>
                </Link>
                <Link href="/esm-portal/login" passHref>
                  <Button variant="secondary" className="border-2 border-deep-forest-green text-deep-forest-green hover:bg-deep-forest-green hover:text-white">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="mt-8 bg-light-grey p-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <svg className="w-6 h-6 text-deep-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Have questions?</h3>
                  <p className="text-gray-700 mb-2">
                    If you have any questions or need assistance, please don't hesitate to contact our support team.
                  </p>
                  <p className="text-gray-700">
                    Email: <a href="mailto:support@beatlenut-esm.com" className="text-vibrant-teal">support@beatlenut-esm.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}