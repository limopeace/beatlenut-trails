'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye,
  faCheck,
  faTimes,
  faFilter,
  faSearch,
  faSpinner,
  faCogs,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';

// Types
interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  seller: {
    _id: string;
    businessName: string;
    contactPerson: {
      name: string;
    };
  };
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const AdminServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  // Mock data for demonstration
  const mockServices: Service[] = [
    {
      _id: '1',
      title: 'Bike Maintenance Service',
      description: 'Complete bike maintenance and repair services',
      price: 1500,
      category: 'Maintenance',
      seller: {
        _id: 'seller1',
        businessName: 'Pro Bike Services',
        contactPerson: { name: 'Raj Kumar' }
      },
      status: 'approved',
      tags: ['bike', 'maintenance', 'repair'],
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    },
    {
      _id: '2',
      title: 'Guided Mountain Trek',
      description: 'Professional guided trekking services in the mountains',
      price: 3500,
      category: 'Adventure',
      seller: {
        _id: 'seller2',
        businessName: 'Mountain Guides',
        contactPerson: { name: 'Suresh Rana' }
      },
      status: 'pending',
      tags: ['trekking', 'guide', 'mountain'],
      createdAt: '2024-12-02T14:30:00Z',
      updatedAt: '2024-12-02T14:30:00Z'
    }
  ];

  useEffect(() => {
    fetchServices();
  }, [currentPage, filters]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredServices = mockServices;
      
      if (filters.status) {
        filteredServices = filteredServices.filter(s => s.status === filters.status);
      }
      
      if (filters.category) {
        filteredServices = filteredServices.filter(s => 
          s.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      
      if (filters.search) {
        filteredServices = filteredServices.filter(s => 
          s.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.seller.businessName.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setServices(filteredServices);
      setTotalServices(filteredServices.length);
      setTotalPages(Math.ceil(filteredServices.length / itemsPerPage));
      
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: faCheck },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: faSpinner },
      rejected: { color: 'bg-red-100 text-red-800', icon: faTimes },
      draft: { color: 'bg-gray-100 text-gray-800', icon: faEdit }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1 w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-500 mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Services Management</h1>
          <p className="text-gray-600">Manage ESM marketplace services and offerings</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Filters
          </button>
          <Link
            href="/admin/services/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Service
          </Link>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <FontAwesomeIcon icon={faCogs} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        <div className="text-sm text-gray-500">{service.category}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {service.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{service.seller.businessName}</div>
                    <div className="text-sm text-gray-500">{service.seller.contactPerson.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatPrice(service.price)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(service.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                    {formatDate(service.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/services/${service._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                      <Link
                        href={`/admin/services/${service._id}/edit`}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="Edit Service"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faCogs} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              No services have been listed yet.
            </p>
            <Link
              href="/admin/services/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add First Service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServicesPage;