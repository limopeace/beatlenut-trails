'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImages,
  faComments,
  faStar,
  faBookOpen,
  faBox,
  faCalendarAlt,
  faShoppingCart,
  faUserShield,
  faChartBar,
  faCogs,
  faTicketAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';

interface AdminCardProps {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  count?: number;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  color, 
  count 
}) => {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(href)}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${color} text-white mr-3`}>
            <FontAwesomeIcon icon={icon} />
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
          {count !== undefined && (
            <span className="ml-auto bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-sm font-medium">
              {count}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your website content and settings</p>
      </div>
        <FadeIn>
          
          {/* Content Management */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Content Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdminCard
                title="Travel Listings"
                description="Manage travel packages and destinations"
                icon={faBookOpen}
                href="/admin/travel-listings"
                color="bg-blue-600"
                count={8}
              />
              <AdminCard
                title="Reviews"
                description="Approve, manage, and respond to reviews"
                icon={faComments}
                href="/admin/reviews"
                color="bg-amber-500"
                count={5}
              />
              <AdminCard
                title="Homepage Reviews"
                description="Select and order testimonials for homepage display"
                icon={faStar}
                href="/admin/homepage-reviews"
                color="bg-purple-600"
                count={3}
              />
              <AdminCard
                title="Image Library"
                description="Upload and manage images across the site"
                icon={faImages}
                href="/admin/images"
                color="bg-emerald-600"
                count={20}
              />
              <AdminCard
                title="Blog Posts"
                description="Create and edit blog content"
                icon={faBookOpen}
                href="/admin/blog"
                color="bg-indigo-600"
                count={12}
              />
              <AdminCard
                title="Marketplace Products"
                description="Manage ESM marketplace products"
                icon={faBox}
                href="/admin/products"
                color="bg-rose-600"
                count={15}
              />
            </div>
          </div>
          
          {/* Bookings & Orders */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Bookings & Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdminCard
                title="Travel Bookings"
                description="View and manage all travel package bookings"
                icon={faCalendarAlt}
                href="/admin/bookings"
                color="bg-green-600"
                count={10}
              />
              <AdminCard
                title="Marketplace Orders"
                description="Process marketplace orders and inquiries"
                icon={faShoppingCart}
                href="/admin/orders"
                color="bg-orange-600"
                count={7}
              />
              <AdminCard
                title="Support Tickets"
                description="Handle customer support requests"
                icon={faTicketAlt}
                href="/admin/support"
                color="bg-cyan-600"
                count={3}
              />
            </div>
          </div>
          
          {/* System */}
          <div>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdminCard
                title="User Management"
                description="Manage admin and customer accounts"
                icon={faUserShield}
                href="/admin/users"
                color="bg-red-600"
                count={5}
              />
              <AdminCard
                title="Site Settings"
                description="Configure website settings and preferences"
                icon={faCogs}
                href="/admin/settings"
                color="bg-gray-600"
              />
              <AdminCard
                title="Analytics"
                description="View website traffic and performance metrics"
                icon={faChartBar}
                href="/admin/analytics"
                color="bg-blue-500"
              />
              <AdminCard
                title="Seller Management"
                description="Approve and manage marketplace sellers"
                icon={faUserPlus}
                href="/admin/sellers"
                color="bg-teal-600"
                count={12}
              />
            </div>
          </div>
        </FadeIn>
    </>
  );
};

export default AdminDashboardPage;