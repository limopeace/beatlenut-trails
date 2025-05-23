'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faEnvelope, 
  faCalendar, 
  faMotorcycle, 
  faMapMarkedAlt, 
  faInfoCircle,
  faFilter,
  faCheck,
  faArchive,
  faEye
} from '@fortawesome/free-solid-svg-icons';

// Mock data for notifications (will be replaced with API call)
const mockNotifications = [
  {
    id: '1',
    type: 'contact',
    title: 'New Contact Form: Tour Inquiry',
    message: 'New contact form submission from John Doe',
    source: 'contact',
    userData: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210'
    },
    status: 'new',
    priority: 'high',
    createdAt: '2023-06-15T10:30:00Z',
    timeAgo: '2 hours ago'
  },
  {
    id: '2',
    type: 'newsletter',
    title: 'New Newsletter Subscription',
    message: 'New newsletter subscription from jane@example.com',
    source: 'homepage',
    userData: {
      email: 'jane@example.com'
    },
    status: 'read',
    priority: 'medium',
    createdAt: '2023-06-15T08:15:00Z',
    timeAgo: '4 hours ago'
  },
  {
    id: '3',
    type: 'bikeRental',
    title: 'Bike Rental Inquiry: Kawasaki Versys 1000',
    message: 'New bike rental inquiry from Mike Smith',
    source: 'bikeRentals',
    userData: {
      name: 'Mike Smith',
      email: 'mike@example.com',
      phone: '+91 9876543211'
    },
    status: 'new',
    priority: 'high',
    createdAt: '2023-06-15T09:45:00Z',
    timeAgo: '3 hours ago'
  },
  {
    id: '4',
    type: 'booking',
    title: 'Travel Booking: Northeast Explorer Package',
    message: 'New travel package booking from Sarah Johnson',
    source: 'services',
    userData: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+91 9876543212'
    },
    status: 'new',
    priority: 'high',
    createdAt: '2023-06-15T07:30:00Z',
    timeAgo: '5 hours ago'
  },
  {
    id: '5',
    type: 'general',
    title: 'System Notification: Backup Complete',
    message: 'Daily database backup completed successfully',
    source: 'other',
    status: 'read',
    priority: 'low',
    createdAt: '2023-06-15T01:00:00Z',
    timeAgo: '11 hours ago'
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all', // all, new, read, archived
    type: 'all', // all, contact, booking, newsletter, bikeRental, travelPackage, general
    priority: 'all' // all, high, medium, low
  });

  useEffect(() => {
    // Filter notifications based on selected filters
    let filtered = [...notifications];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(notification => notification.status === filters.status);
    }
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(notification => notification.type === filters.type);
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === filters.priority);
    }
    
    setFilteredNotifications(filtered);
  }, [filters, notifications]);

  // In a real app, this would fetch notifications from the API
  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        // setNotifications(data.notifications);
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    // In a real app, this would call the API to mark notification as read
    try {
      // await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAsArchived = async (id: string) => {
    // In a real app, this would call the API to mark notification as archived
    try {
      // await fetch(`/api/notifications/${id}/archive`, { method: 'PATCH' });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'archived' } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as archived:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    // In a real app, this would call the API to mark all notifications as read
    try {
      // await fetch('/api/notifications/read-all', { method: 'PATCH' });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.status === 'new' 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return faEnvelope;
      case 'booking':
        return faCalendar;
      case 'newsletter':
        return faEnvelope;
      case 'bikeRental':
        return faMotorcycle;
      case 'travelPackage':
        return faMapMarkedAlt;
      default:
        return faInfoCircle;
    }
  };

  // Get color for priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get badge text for notification status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            New
          </span>
        );
      case 'read':
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Read
          </span>
        );
      case 'archived':
        return (
          <span className="bg-gray-300 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faFilter} className="text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          {/* Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type-filter"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="contact">Contact</option>
              <option value="booking">Booking</option>
              <option value="newsletter">Newsletter</option>
              <option value="bikeRental">Bike Rental</option>
              <option value="travelPackage">Travel Package</option>
              <option value="general">General</option>
            </select>
          </div>
          
          {/* Priority Filter */}
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority-filter"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <FontAwesomeIcon icon={faBell} className="text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">No notifications found</h3>
          <p className="text-gray-600">
            There are no notifications matching your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white p-4 rounded-lg shadow-sm transition-all duration-300 ${
                notification.status === 'new' ? 'border-l-4 border-green-500' : ''
              }`}
            >
              <div className="flex items-start">
                {/* Icon */}
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                    {getStatusBadge(notification.status)}
                  </div>
                  
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  
                  {/* User Data */}
                  {notification.userData && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm">
                      {notification.userData.name && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Name:</span> {notification.userData.name}
                        </p>
                      )}
                      {notification.userData.email && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Email:</span>{' '}
                          <a href={`mailto:${notification.userData.email}`} className="text-blue-600 hover:underline">
                            {notification.userData.email}
                          </a>
                        </p>
                      )}
                      {notification.userData.phone && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Phone:</span>{' '}
                          <a href={`tel:${notification.userData.phone}`} className="text-blue-600 hover:underline">
                            {notification.userData.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                      </span>
                      <span className="ml-2 text-gray-500">
                        {notification.timeAgo}
                      </span>
                      <span className="ml-2 text-gray-500">
                        Source: {notification.source}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      {notification.status === 'new' && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="Mark as Read"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      )}
                      {notification.status !== 'archived' && (
                        <button
                          onClick={() => handleMarkAsArchived(notification.id)}
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title="Archive"
                        >
                          <FontAwesomeIcon icon={faArchive} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;