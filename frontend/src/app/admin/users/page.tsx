'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye,
  faUserCheck,
  faUserTimes,
  faFilter,
  faSearch,
  faSpinner,
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faShield,
  faStore,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

// Types
interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'user' | 'buyer' | 'seller' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  profilePicture?: string;
  businessName?: string;
  verified: boolean;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  role: string;
  status: string;
  search: string;
  verified: string;
  dateFrom: string;
  dateTo: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<FilterState>({
    role: '',
    status: '',
    search: '',
    verified: '',
    dateFrom: '',
    dateTo: ''
  });

  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      _id: '1',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      role: 'seller',
      status: 'active',
      businessName: 'Mountain Gear Co.',
      verified: true,
      lastLogin: '2024-12-15T10:30:00Z',
      totalOrders: 45,
      totalSpent: 125000,
      createdAt: '2024-10-01T09:00:00Z',
      updatedAt: '2024-12-15T10:30:00Z'
    },
    {
      _id: '2',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543211',
      role: 'buyer',
      status: 'active',
      verified: true,
      lastLogin: '2024-12-14T15:45:00Z',
      totalOrders: 12,
      totalSpent: 35000,
      createdAt: '2024-11-15T14:20:00Z',
      updatedAt: '2024-12-14T15:45:00Z'
    },
    {
      _id: '3',
      fullName: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+91 9876543212',
      role: 'seller',
      status: 'pending',
      businessName: 'Camp & Hike',
      verified: false,
      lastLogin: '2024-12-13T08:15:00Z',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: '2024-12-10T11:30:00Z',
      updatedAt: '2024-12-13T08:15:00Z'
    },
    {
      _id: '4',
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+91 9876543213',
      role: 'buyer',
      status: 'active',
      verified: true,
      lastLogin: '2024-12-12T19:20:00Z',
      totalOrders: 8,
      totalSpent: 22500,
      createdAt: '2024-11-20T16:45:00Z',
      updatedAt: '2024-12-12T19:20:00Z'
    },
    {
      _id: '5',
      fullName: 'Admin User',
      email: 'admin@beatlenut.com',
      role: 'admin',
      status: 'active',
      verified: true,
      lastLogin: '2024-12-15T12:00:00Z',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T12:00:00Z'
    },
    {
      _id: '6',
      fullName: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+91 9876543214',
      role: 'user',
      status: 'inactive',
      verified: false,
      lastLogin: '2024-11-25T10:30:00Z',
      totalOrders: 2,
      totalSpent: 5000,
      createdAt: '2024-09-15T12:30:00Z',
      updatedAt: '2024-11-25T10:30:00Z'
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on current filters
      let filteredUsers = mockUsers;
      
      if (filters.role) {
        filteredUsers = filteredUsers.filter(u => u.role === filters.role);
      }
      
      if (filters.status) {
        filteredUsers = filteredUsers.filter(u => u.status === filters.status);
      }
      
      if (filters.verified) {
        const isVerified = filters.verified === 'true';
        filteredUsers = filteredUsers.filter(u => u.verified === isVerified);
      }
      
      if (filters.search) {
        filteredUsers = filteredUsers.filter(u => 
          u.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          u.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          (u.businessName && u.businessName.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }

      setUsers(filteredUsers);
      setTotalUsers(filteredUsers.length);
      setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
      
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u._id));
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, status }
          : user
      ));
      
      console.log(`User ${userId} status updated to ${status}`);
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const verifyUser = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, verified: true }
          : user
      ));
      
      console.log(`User ${userId} verified`);
    } catch (err) {
      console.error('Error verifying user:', err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'activate') {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user._id)
            ? { ...user, status: 'active' as const }
            : user
        ));
      } else if (action === 'deactivate') {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user._id)
            ? { ...user, status: 'inactive' as const }
            : user
        ));
      } else if (action === 'verify') {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user._id)
            ? { ...user, verified: true }
            : user
        ));
      }
      
      setSelectedUsers([]);
      console.log(`Bulk ${action} completed for ${selectedUsers.length} users`);
    } catch (err) {
      console.error(`Error performing bulk ${action}:`, err);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', icon: faShield },
      seller: { color: 'bg-blue-100 text-blue-800', icon: faStore },
      buyer: { color: 'bg-green-100 text-green-800', icon: faShoppingCart },
      user: { color: 'bg-gray-100 text-gray-800', icon: faUser }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1 w-3 h-3" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: faUserCheck },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: faUser },
      suspended: { color: 'bg-red-100 text-red-800', icon: faUserTimes },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: faSpinner }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1 w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityStatus = (lastLogin?: string) => {
    if (!lastLogin) return 'Never logged in';
    
    const daysSince = Math.floor((Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) return 'Today';
    if (daysSince === 1) return 'Yesterday';
    if (daysSince < 7) return `${daysSince} days ago`;
    if (daysSince < 30) return `${Math.floor(daysSince / 7)} weeks ago`;
    return `${Math.floor(daysSince / 30)} months ago`;
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-500 mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage platform users, sellers, and administrators</p>
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
            href="/admin/users/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faUser} className="text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-lg font-semibold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faUserCheck} className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FontAwesomeIcon icon={faStore} className="text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Sellers</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.role === 'seller').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon={faSpinner} className="text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
                <option value="user">User</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verified</label>
              <select
                value={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  role: '',
                  status: '',
                  search: '',
                  verified: '',
                  dateFrom: '',
                  dateTo: ''
                })}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="text-blue-800 font-medium mb-2 sm:mb-0">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faUserTimes} className="mr-1" />
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('verify')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders/Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            {user.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {user.fullName}
                          {user.verified && (
                            <FontAwesomeIcon 
                              icon={faUserCheck} 
                              className="ml-2 text-green-500 w-3 h-3" 
                              title="Verified"
                            />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FontAwesomeIcon icon={faEnvelope} className="mr-1 w-3 h-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <FontAwesomeIcon icon={faPhone} className="mr-1 w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.businessName && (
                          <div className="text-sm text-blue-600 flex items-center">
                            <FontAwesomeIcon icon={faStore} className="mr-1 w-3 h-3" />
                            {user.businessName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getActivityStatus(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.totalOrders} orders</div>
                    <div className="text-sm text-gray-500">{formatCurrency(user.totalSpent)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="Edit User"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      {!user.verified && (
                        <button
                          onClick={() => verifyUser(user._id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Verify User"
                        >
                          <FontAwesomeIcon icon={faUserCheck} />
                        </button>
                      )}
                      {user.status === 'active' ? (
                        <button
                          onClick={() => updateUserStatus(user._id, 'inactive')}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Deactivate User"
                        >
                          <FontAwesomeIcon icon={faUserTimes} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(user._id, 'active')}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Activate User"
                        >
                          <FontAwesomeIcon icon={faUserCheck} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {Object.values(filters).some(f => f) 
                ? "No users match your current filters." 
                : "No users have registered yet."
              }
            </p>
            {!Object.values(filters).some(f => f) && (
              <Link
                href="/admin/users/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add First User
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 bg-blue-600 text-white rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;