import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';

export default function ESMRegistrationPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest-green pt-32 pb-12 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ex-Servicemen Registration
            </h1>
            <p className="text-xl mb-0">
              Join our growing community of veteran entrepreneurs and service providers
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Create Your ESM Seller Account</h2>
                <p className="text-gray-600">
                  Complete the form below to register as an Ex-Serviceman seller or service provider. All fields marked with an asterisk (*) are required.
                </p>
              </div>

              <form>
                {/* Personal Information */}
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                        Current Location *
                      </label>
                      <input
                        type="text"
                        id="location"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="City, State"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Military Service Details */}
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Military Service Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="serviceBranch" className="block text-gray-700 font-medium mb-2">
                        Service Branch *
                      </label>
                      <select
                        id="serviceBranch"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        required
                      >
                        <option value="">Select your service branch</option>
                        <option value="army">Indian Army</option>
                        <option value="navy">Indian Navy</option>
                        <option value="airforce">Indian Air Force</option>
                        <option value="coast-guard">Indian Coast Guard</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="rank" className="block text-gray-700 font-medium mb-2">
                        Last Rank Held *
                      </label>
                      <input
                        type="text"
                        id="rank"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Enter your last rank"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="serviceNumber" className="block text-gray-700 font-medium mb-2">
                        Service Number *
                      </label>
                      <input
                        type="text"
                        id="serviceNumber"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Enter your service number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="yearsOfService" className="block text-gray-700 font-medium mb-2">
                        Years of Service *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="serviceFrom" className="block text-sm text-gray-500 mb-1">
                            From
                          </label>
                          <input
                            type="number"
                            id="serviceFrom"
                            min="1947"
                            max="2023"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                            placeholder="Year"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="serviceTo" className="block text-sm text-gray-500 mb-1">
                            To
                          </label>
                          <input
                            type="number"
                            id="serviceTo"
                            min="1947"
                            max="2023"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                            placeholder="Year"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="verificationDocument" className="block text-gray-700 font-medium mb-2">
                        Upload Verification Document *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <input
                          type="file"
                          id="verificationDocument"
                          className="w-full"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Please upload a scanned copy of your service ID card, discharge certificate, or any other relevant document that verifies your Ex-Serviceman status. Max file size: 5MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Seller Information */}
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Seller Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="businessName" className="block text-gray-700 font-medium mb-2">
                        Business/Brand Name (if applicable)
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Enter your business or brand name"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="sellerType" className="block text-gray-700 font-medium mb-2">
                        What do you want to sell? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="products"
                            className="w-4 h-4 text-deep-forest-green"
                          />
                          <label htmlFor="products" className="ml-2 text-gray-700">
                            Products (Handicrafts, Food items, etc.)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="services"
                            className="w-4 h-4 text-deep-forest-green"
                          />
                          <label htmlFor="services" className="ml-2 text-gray-700">
                            Services (Consulting, Training, etc.)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                        Primary Category *
                      </label>
                      <select
                        id="category"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="handicrafts">Handicrafts</option>
                        <option value="food-products">Food Products</option>
                        <option value="security-services">Security Services</option>
                        <option value="consulting">Consulting</option>
                        <option value="training">Training</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="technical-services">Technical Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Brief Description of Products/Services *
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Describe the products or services you wish to offer"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Account Information */}
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Create Password</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Create a password"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Password must be at least 8 characters long and include a number and a special character.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="mb-8">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 mt-1 text-deep-forest-green"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-gray-700">
                      I agree to the <a href="/terms" className="text-vibrant-teal underline">Terms and Conditions</a> and <a href="/privacy" className="text-vibrant-teal underline">Privacy Policy</a>. I confirm that all the information provided is accurate and I am an Ex-Serviceman eligible to register on this platform. *
                    </label>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-8 py-3 bg-deep-forest-green hover:bg-vibrant-teal"
                  >
                    Register as ESM Seller
                  </Button>
                </div>
              </form>
              
              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-700">
                  Already have an account?{' '}
                  <Link href="/esm-portal/login" className="text-vibrant-teal hover:underline font-medium">
                    Login to your account
                  </Link>
                </p>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-12 bg-light-grey rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Registration Process</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium mb-1">Submit Registration</p>
                    <p className="text-gray-600">
                      Complete the form with all required details and submit your application.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium mb-1">Verification Process</p>
                    <p className="text-gray-600">
                      Our team will verify your Ex-Serviceman status using the provided documentation. This typically takes 1-2 business days.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium mb-1">Account Approval</p>
                    <p className="text-gray-600">
                      Once verified, your account will be approved and you'll receive an email confirmation.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium mb-1">Create Your Listings</p>
                    <p className="text-gray-600">
                      Log in to your account and start creating listings for your products or services.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-white rounded-md border-l-4 border-vibrant-teal">
                <p className="font-medium">Need Help?</p>
                <p className="text-gray-600 mb-2">
                  If you have any questions or need assistance with the registration process, our support team is here to help.
                </p>
                <Button
                  href="/esm-portal/support"
                  variant="tertiary"
                  className="text-vibrant-teal pl-0"
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