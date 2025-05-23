'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import MobileAdminNav from '@/components/layout/MobileAdminNav';
import { AdminProviders } from './providers';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Inner layout component that uses the auth context
const AdminLayoutInner: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAdminAuth();
  
  // If on login page, just render children
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  const handleLogout = () => {
    logout();
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-tachometer-alt' },
    { name: 'Orders', path: '/admin/orders', icon: 'fas fa-shopping-cart' },
    { name: 'Products', path: '/admin/products', icon: 'fas fa-box' },
    { name: 'Services', path: '/admin/services', icon: 'fas fa-cogs' },
    { name: 'Sellers', path: '/admin/sellers', icon: 'fas fa-store' },
    { name: 'Users', path: '/admin/users', icon: 'fas fa-users' },
    { name: 'Approvals', path: '/admin/approvals', icon: 'fas fa-check-circle' },
    { name: 'Reports', path: '/admin/reports', icon: 'fas fa-chart-bar' },
    { name: 'Settings', path: '/admin/settings', icon: 'fas fa-cog' },
  ];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated && pathname !== '/admin/login') {
    router.push('/admin/login');
    return null;
  }
  
  // Track window width for responsive design
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const isMobile = windowWidth < 768;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for tablet and desktop */}
      <aside 
        className={`bg-blue-800 text-white w-64 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-blue-700">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold tracking-wider">Beatlenut ESM</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    pathname === item.path 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <i className={`${item.icon} mr-3 w-5`}></i>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-blue-700">
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 w-full text-left rounded-md text-blue-100 hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Top navbar */}
        <header className="bg-white shadow z-10">
          <div className="flex justify-between items-center px-4 py-3 sm:py-4">
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-800 md:hidden p-2.5 rounded hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex-1 px-4 md:px-8">
              <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                {navItems.find(item => item.path === pathname)?.name || 'Admin Panel'}
              </h2>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  aria-label="User menu"
                >
                  <div className="flex items-center">
                    <span className="hidden md:inline-block text-sm mr-2 font-medium">{user?.name || 'Admin'}</span>
                    <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow">
                      {(user?.name || 'A').charAt(0)}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
        
        {/* Mobile bottom navigation */}
        <MobileAdminNav />
      </div>
    </div>
  );
};

// Wrapper component that provides the auth context
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AdminProviders>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProviders>
  );
};

export default AdminLayout;