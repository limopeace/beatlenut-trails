'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import esmServiceService, { EsmService } from '@/services/api/esmServiceService';

// Service categories for filtering
const serviceCategories = [
  'security',
  'consulting', 
  'training',
  'logistics',
  'technical',
  'event-management',
  'agriculture',
  'coaching',
  'tour-guide',
  'other'
];

export default function ServicesPage() {
  const [services, setServices] = useState<EsmService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchServices();
  }, [searchQuery, selectedCategory]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
      };
      
      const response = await esmServiceService.getServices(filters);
      setServices(response.services);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-deep-forest pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-deep-forest/90 to-deep-forest/70"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center text-pale-straw">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-clash">
              Professional Services by Ex-Servicemen
            </h1>
            <p className="text-xl mb-8 text-pale-straw/90">
              Leverage the expertise, discipline, and reliability of ex-servicemen for your professional needs
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-pale-straw">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                >
                  <option value="">All Categories</option>
                  {serviceCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>

                {/* Search Button */}
                <Button
                  onClick={fetchServices}
                  className="bg-forest-green hover:bg-moss-green text-pale-straw"
                >
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle 
              title="Available Services"
              subtitle={`${services.length} professional services available`}
              className="mb-12"
            />

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-forest-green"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchServices} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && services.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No services found matching your criteria.</p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Services Grid */}
            {!loading && !error && services.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Service Image */}
                    <div className="relative h-48 bg-gray-200">
                      {service.images && service.images.length > 0 ? (
                        <Image
                          src={service.images[0]}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Service Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-deep-forest">{service.name}</h3>
                        <span className="text-lg font-bold text-forest-green">
                          ₹{service.price}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>

                      <div className="space-y-2 mb-4">
                        {service.provider && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            {service.provider.name}
                          </div>
                        )}
                        
                        {service.location && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                            {service.location.city}, {service.location.state}
                          </div>
                        )}

                        {service.duration && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                            {service.duration} {service.priceType}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          href={`/esm-portal/services/${service._id}`}
                          className="flex-1 bg-forest-green hover:bg-moss-green text-pale-straw"
                        >
                          View Details
                        </Button>
                        <Button
                          href={`/esm-portal/messages/new?serviceId=${service._id}`}
                          variant="outline"
                          className="border-forest-green text-forest-green hover:bg-forest-green hover:text-pale-straw"
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}