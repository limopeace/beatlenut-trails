import React from 'react';
import SellerRegistrationForm from '@/components/marketplace/auth/SellerRegistrationForm';

export default function ESMRegistrationPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-pale-straw">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-clash">
              Ex-Servicemen Registration
            </h1>
            <p className="text-xl mb-0">
              Join our growing community of veteran entrepreneurs and service providers
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-pale-straw">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-deep-forest">Create Your ESM Seller Account</h2>
                <p className="text-deep-forest/70">
                  Complete the form below to register as an Ex-Serviceman seller or service provider. All fields marked with an asterisk (*) are required.
                </p>
              </div>

              <SellerRegistrationForm />
            </div>
            
            {/* Additional Information */}
            <div className="mt-12 bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-deep-forest">Registration Process</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-forest-green text-pale-straw flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium mb-1 text-deep-forest">Submit Registration</p>
                    <p className="text-deep-forest/70">
                      Complete the form with all required details and submit your application.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-forest-green text-pale-straw flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium mb-1 text-deep-forest">Verification Process</p>
                    <p className="text-deep-forest/70">
                      Our team will verify your Ex-Serviceman status using the provided documentation. This typically takes 1-2 business days.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-forest-green text-pale-straw flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium mb-1 text-deep-forest">Account Approval</p>
                    <p className="text-deep-forest/70">
                      Once verified, your account will be approved and you'll receive an email confirmation.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-forest-green text-pale-straw flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium mb-1 text-deep-forest">Create Your Listings</p>
                    <p className="text-deep-forest/70">
                      Log in to your account and start creating listings for your products or services.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-pale-straw rounded-md border-l-4 border-forest-green">
                <p className="font-medium text-deep-forest">Need Help?</p>
                <p className="text-deep-forest/70 mb-2">
                  If you have any questions or need assistance with the registration process, our support team is here to help.
                </p>
                <a 
                  href="/contact" 
                  className="text-forest-green hover:text-moss-green font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}