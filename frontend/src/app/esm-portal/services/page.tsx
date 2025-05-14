import React from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';

// Sample services data (to be replaced with API calls in the future)
const services = [
  {
    id: 1,
    name: 'Security Consultation',
    price: '₹5,000 per session',
    description: 'Comprehensive security assessment and consultation for businesses, events, and residential properties.',
    seller: 'Col. Amar Joshi (Retd.)',
    image: 'https://picsum.photos/id/1025/600/400',
    category: 'Security Services',
    location: 'Delhi NCR',
  },
  {
    id: 2,
    name: 'Leadership & Management Training',
    price: '₹15,000 per day',
    description: 'Corporate leadership training based on military principles, team building, and crisis management.',
    seller: 'Brig. Harish Mehta (Retd.)',
    image: 'https://picsum.photos/id/1062/600/400',
    category: 'Training',
    location: 'Mumbai',
  },
  {
    id: 3,
    name: 'Logistics & Supply Chain Consulting',
    price: '₹7,500 per day',
    description: 'Expert logistics and supply chain optimization services for businesses of all sizes.',
    seller: 'Lt. Col. Priya Sharma (Retd.)',
    image: 'https://picsum.photos/id/116/600/400',
    category: 'Consulting',
    location: 'Bengaluru',
  },
  {
    id: 4,
    name: 'Fitness & Combat Training',
    price: '₹2,000 per session',
    description: 'Personalized fitness programs and combat training for individuals and groups.',
    seller: 'Capt. Vikram Singh (Retd.)',
    image: 'https://picsum.photos/id/176/600/400',
    category: 'Training',
    location: 'Pune',
  },
  {
    id: 5,
    name: 'Agricultural Consultancy',
    price: '₹3,500 per session',
    description: 'Expert advice on sustainable farming practices, crop management, and agricultural business development.',
    seller: 'Maj. Deepak Nair (Retd.)',
    image: 'https://picsum.photos/id/164/600/400',
    category: 'Agriculture',
    location: 'Kerala',
  },
  {
    id: 6,
    name: 'Event Security Management',
    price: 'Contact for pricing',
    description: 'Complete event security planning and execution services for corporate and public events.',
    seller: 'Wing Cdr. Rajiv Malhotra (Retd.)',
    image: 'https://picsum.photos/id/432/600/400',
    category: 'Security Services',
    location: 'Pan India',
  },
  {
    id: 7,
    name: 'Disaster Management Training',
    price: '₹12,000 per session',
    description: 'Specialized training for organizations on disaster preparedness, response, and recovery.',
    seller: 'Lt. Gen. Sunil Kumar (Retd.)',
    image: 'https://picsum.photos/id/28/600/400',
    category: 'Training',
    location: 'Chennai',
  },
  {
    id: 8,
    name: 'Technical Equipment Repair',
    price: 'Based on assessment',
    description: 'Professional repair and maintenance services for technical and electronic equipment.',
    seller: 'Flt. Lt. Rahul Desai (Retd.)',
    image: 'https://picsum.photos/id/250/600/400',
    category: 'Technical Services',
    location: 'Hyderabad',
  },
];

// Available categories from the services
const categories = Array.from(new Set(services.map(service => service.category)));

// Available locations from the services
const locations = Array.from(new Set(services.map(service => service.location)));

export default function ServicesPage() {
  return (
    <>
      {/* Expanded Hero Section with background image */}
      <section className="relative bg-deep-forest-green pt-32 pb-20 md:py-48">
        <div className="absolute inset-0 bg-gradient-to-r from-deep-forest/90 to-deep-forest/70 z-10"></div>
        <div className="absolute inset-0">
          <img 
            src="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg"
            alt="Ex-Servicemen Services Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container-custom relative z-20">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Professional Services by Ex-Servicemen
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-off-white/90 max-w-2xl mx-auto">
              Discover expert services offered by skilled veterans with years of experience and disciplined training
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                href="#services-list"
                variant="secondary"
                className="border-2 border-off-white text-off-white hover:bg-off-white hover:text-deep-forest-green px-6 py-3 text-lg"
              >
                Explore Services
              </Button>
              <Button
                href="/esm-portal/register"
                variant="primary"
                className="bg-vibrant-teal text-off-white hover:bg-vibrant-teal/90 px-6 py-3 text-lg"
              >
                Register as Provider
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16" id="services-list">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-3">Service Type</h4>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`category-${index}`} 
                          className="w-4 h-4 text-deep-forest-green" 
                        />
                        <label htmlFor={`category-${index}`} className="ml-2 text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Location Filter */}
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-3">Location</h4>
                  <div className="space-y-2">
                    {locations.map((location, index) => (
                      <div key={index} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`location-${index}`} 
                          className="w-4 h-4 text-deep-forest-green" 
                        />
                        <label htmlFor={`location-${index}`} className="ml-2 text-gray-700">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Service Format Filter */}
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-3">Service Format</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="format-inperson" 
                        className="w-4 h-4 text-deep-forest-green" 
                      />
                      <label htmlFor="format-inperson" className="ml-2 text-gray-700">
                        In-person
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="format-remote" 
                        className="w-4 h-4 text-deep-forest-green" 
                      />
                      <label htmlFor="format-remote" className="ml-2 text-gray-700">
                        Remote/Online
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="format-hybrid" 
                        className="w-4 h-4 text-deep-forest-green" 
                      />
                      <label htmlFor="format-hybrid" className="ml-2 text-gray-700">
                        Hybrid
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-vibrant-teal hover:bg-vibrant-teal/90 text-white font-medium py-3 rounded-md shadow-sm transition-colors duration-200"
                  variant="primary"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Services Grid */}
            <div className="lg:col-span-3">
              {/* Search and Sort */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div className="relative w-full md:w-96 mb-4 md:mb-0">
                  <input 
                    type="text" 
                    placeholder="Search services..." 
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                  />
                  <button className="absolute right-3 top-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700">Sort by:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green">
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              {/* Services */}
              <div className="grid grid-cols-1 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="card group">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-64 overflow-hidden rounded-t-lg md:rounded-none md:rounded-l-lg">
                        <Image 
                          src={service.image} 
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                          <div>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-light-grey text-deep-forest-green rounded-full mb-2">
                              {service.category}
                            </span>
                            <h3 className="font-semibold text-xl mb-1">{service.name}</h3>
                          </div>
                          <div className="md:text-right mt-2 md:mt-0">
                            <p className="font-bold text-sunrise-orange">{service.price}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {service.location}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <p className="text-sm text-gray-500 mb-4">Offered by: <span className="font-medium">{service.seller}</span></p>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            href={`/esm-portal/services/${service.id}`}
                            variant="secondary"
                            className="text-sm px-4 py-2"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="primary"
                            className="text-sm px-4 py-2"
                          >
                            Contact Provider
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    Previous
                  </button>
                  <button className="px-3 py-2 rounded-md bg-deep-forest-green text-white">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section bg-light-grey">
        <div className="container-custom">
          <SectionTitle
            title="Specialized Service Categories"
            subtitle="Explore our most popular service categories offered by Ex-Servicemen"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Security Services */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-deep-forest-green/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-deep-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Security Services</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Security consulting and risk assessment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Event security planning and management</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Corporate and residential security services</span>
                </li>
              </ul>
              <Button
                href="/esm-portal/services?category=Security%20Services"
                variant="tertiary"
              >
                View All Security Services
              </Button>
            </div>

            {/* Training & Development */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-deep-forest-green/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-deep-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Training & Development</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Leadership and management training</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Team building workshops</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Crisis management and disaster preparedness</span>
                </li>
              </ul>
              <Button
                href="/esm-portal/services?category=Training"
                variant="tertiary"
              >
                View All Training Services
              </Button>
            </div>

            {/* Consulting Services */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-deep-forest-green/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-deep-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Consulting Services</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Logistics and supply chain optimization</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Project management and execution</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Strategic planning and business development</span>
                </li>
              </ul>
              <Button
                href="/esm-portal/services?category=Consulting"
                variant="tertiary"
              >
                View All Consulting Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sunrise-orange text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Are You an Ex-Serviceman with Professional Skills?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join our marketplace today and offer your professional services to customers nationwide. Registration is simple and free!
          </p>
          <Button
            href="/esm-portal/register"
            variant="secondary"
            className="border-2 border-white text-white hover:bg-white hover:text-sunrise-orange"
          >
            Register as a Service Provider
          </Button>
        </div>
      </section>
    </>
  );
}