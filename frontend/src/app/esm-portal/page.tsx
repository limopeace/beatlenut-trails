import React from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';

// Sample featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Handcrafted Bamboo Art',
    price: '₹1,200',
    seller: 'Capt. Rajesh Singh (Retd.)',
    image: '/images/product-placeholder-1.jpg',
  },
  {
    id: 2,
    name: 'Organic Tea Collection',
    price: '₹850',
    seller: 'Maj. Anand Kumar (Retd.)',
    image: '/images/product-placeholder-2.jpg',
  },
  {
    id: 3,
    name: 'Traditional Handloom Textiles',
    price: '₹2,500',
    seller: 'Lt. Col. Vijay Sharma (Retd.)',
    image: '/images/product-placeholder-3.jpg',
  },
  {
    id: 4,
    name: 'Security Consultation Services',
    price: 'Contact for pricing',
    seller: 'Col. Amar Joshi (Retd.)',
    image: '/images/product-placeholder-4.jpg',
  },
];

// Sample service categories
const serviceCategories = [
  {
    id: 1,
    name: 'Handicrafts',
    count: 45,
    icon: '🧶',
  },
  {
    id: 2,
    name: 'Food Products',
    count: 32,
    icon: '🍲',
  },
  {
    id: 3,
    name: 'Security Services',
    count: 28,
    icon: '🛡️',
  },
  {
    id: 4,
    name: 'Consulting',
    count: 24,
    icon: '📊',
  },
  {
    id: 5,
    name: 'Training',
    count: 20,
    icon: '🎯',
  },
  {
    id: 6,
    name: 'Agriculture',
    count: 18,
    icon: '🌾',
  },
];

export default function ESMPortal() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-deep-forest-green pt-32 pb-20 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-off-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Ex-Servicemen Marketplace
              </h1>
              <p className="text-xl mb-8">
                Supporting our heroes through a platform that connects skilled Ex-Servicemen with customers looking for quality products and services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/esm-portal/products" variant="primary">
                  Browse Products
                </Button>
                <Button href="/esm-portal/services" variant="secondary" className="bg-transparent border-white text-white hover:bg-white hover:text-deep-forest-green">
                  Find Services
                </Button>
                <Button href="/esm-portal/register" variant="secondary" className="bg-sunrise-orange border-sunrise-orange text-white hover:bg-vibrant-teal hover:border-vibrant-teal">
                  Register as ESM
                </Button>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gray-300">
                {/* Placeholder image */}
                <div className="w-full h-full flex items-center justify-center text-deep-forest-green text-lg">
                  ESM Portal Hero Image
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-off-white">
        <div className="container-custom">
          <SectionTitle
            title="Featured Products & Services"
            subtitle="Discover high-quality offerings from our Ex-Servicemen community"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card group">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-gray-300">
                    {/* Placeholder image or actual image */}
                    <div className="w-full h-full flex items-center justify-center text-deep-forest-green text-lg">
                      Product Image
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{product.seller}</p>
                  <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                  <p className="font-bold text-sunrise-orange">{product.price}</p>
                  <Button
                    href={`/esm-portal/products/${product.id}`}
                    variant="tertiary"
                    className="mt-3"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/esm-portal/products" variant="primary">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionTitle
            title="Browse Categories"
            subtitle="Find exactly what you're looking for from our diverse range of offerings"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {serviceCategories.map((category) => (
              <a
                key={category.id}
                href={`/esm-portal/category/${category.id}`}
                className="group p-6 bg-light-grey rounded-lg text-center transition-all hover:bg-deep-forest-green hover:text-off-white"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <p className="text-sm group-hover:text-light-grey">
                  {category.count} listings
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-light-grey">
        <div className="container-custom">
          <SectionTitle
            title="How It Works"
            subtitle="Simple steps to start buying or selling on our ESM marketplace"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Buyers */}
            <div className="card p-6">
              <div className="w-16 h-16 rounded-full bg-sunrise-orange text-off-white flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">For Buyers</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Browse products and services offered by Ex-Servicemen</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Contact sellers directly through our messaging system</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Purchase with confidence knowing you're supporting veterans</span>
                </li>
              </ul>
              <Button href="/esm-portal/products" variant="primary" className="mt-6">
                Start Shopping
              </Button>
            </div>

            {/* For Sellers */}
            <div className="card p-6">
              <div className="w-16 h-16 rounded-full bg-sunrise-orange text-off-white flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">For Sellers</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Register and verify your Ex-Servicemen status</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Create detailed listings for your products or services</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Connect with customers and grow your business</span>
                </li>
              </ul>
              <Button href="/esm-portal/register" variant="primary" className="mt-6">
                Register Now
              </Button>
            </div>

            {/* Support */}
            <div className="card p-6">
              <div className="w-16 h-16 rounded-full bg-sunrise-orange text-off-white flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Our Support</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Dedicated support team to help with any questions</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Training and resources for sellers to succeed</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Community events and networking opportunities</span>
                </li>
              </ul>
              <Button href="/esm-portal/support" variant="primary" className="mt-6">
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-deep-forest-green text-off-white">
        <div className="container-custom">
          <SectionTitle
            title="Success Stories"
            subtitle="Hear from Ex-Servicemen who have transformed their lives through our marketplace"
            className="text-off-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4">
                  {/* Placeholder for profile image */}
                </div>
                <div>
                  <h4 className="font-semibold">Major Ravi Kumar (Retd.)</h4>
                  <p className="text-sm">Handcraft Artisan</p>
                </div>
              </div>
              <p className="italic">
                "After 20 years in the Army, I was unsure about my second career. The ESM Marketplace helped me turn my bamboo craft hobby into a thriving business, connecting me with customers nationwide."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4">
                  {/* Placeholder for profile image */}
                </div>
                <div>
                  <h4 className="font-semibold">Lt. Col. Pradeep Singh (Retd.)</h4>
                  <p className="text-sm">Security Consultant</p>
                </div>
              </div>
              <p className="italic">
                "The platform gave me visibility to showcase my security expertise. Within months, I secured contracts with multiple businesses and now employ five other veterans in my growing company."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4">
                  {/* Placeholder for profile image */}
                </div>
                <div>
                  <h4 className="font-semibold">Capt. Anita Desai (Retd.)</h4>
                  <p className="text-sm">Organic Tea Producer</p>
                </div>
              </div>
              <p className="italic">
                "Transitioning to agriculture was challenging, but the ESM Marketplace provided not just a platform to sell my organic teas, but also a community of fellow veterans who offered support and guidance."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-sunrise-orange text-off-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Community Today
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Whether you're looking to support our veterans or you're an Ex-Serviceman ready to showcase your products and services, we welcome you to our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/esm-portal/register"
              variant="secondary"
              className="border-2 border-off-white text-off-white hover:bg-off-white hover:text-sunrise-orange"
            >
              Register as ESM
            </Button>
            <Button
              href="/esm-portal/products"
              variant="primary"
              className="bg-deep-forest-green hover:bg-vibrant-teal"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}