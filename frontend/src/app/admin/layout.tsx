'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Simplified admin layout 
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // For login page, just render children without complex layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // For other admin pages, render basic admin layout
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Simple sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen">
          <div className="p-4">
            <h2 className="text-white text-lg font-semibold">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Dashboard</Link>
            <Link href="/admin/orders" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Orders</Link>
            <Link href="/admin/products" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Products</Link>
            <Link href="/admin/sellers" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Sellers</Link>
            <Link href="/admin/users" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Users</Link>
            <Link href="/admin/services" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Services</Link>
            <Link href="/admin/reports" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Reports</Link>
            <Link href="/admin/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Settings</Link>
            <Link href="/admin/blog" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Blog</Link>
          </nav>
        </div>
        {/* Main content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;