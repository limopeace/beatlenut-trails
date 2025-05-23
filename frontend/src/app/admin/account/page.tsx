'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSave, 
  faKey, 
  faEnvelope, 
  faShield, 
  faBell, 
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import Cookies from 'js-cookie';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  sellerRequests: boolean;
  newMessages: boolean;
  productApprovals: boolean;
  systemUpdates: boolean;
}

const AdminAccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: 'Admin User',
    email: 'admin@beatlenut.com',
    phone: '+91 98765 43210',
    role: 'Administrator'
  });
  
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    sellerRequests: true,
    newMessages: true,
    productApprovals: false,
    systemUpdates: true
  });
  
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });
  
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  // Get admin name from cookie when component mounts
  useEffect(() => {
    const adminName = Cookies.get('admin_name');
    if (adminName) {
      setProfileForm(prev => ({
        ...prev,
        name: adminName
      }));
    }
  }, []);
  
  // Track window size
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
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const validatePasswordForm = () => {
    if (passwordForm.newPassword.length < 8) {
      setSubmitStatus({
        type: 'error',
        message: 'New password must be at least 8 characters long'
      });
      return false;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSubmitStatus({
        type: 'error',
        message: 'New passwords do not match'
      });
      return false;
    }
    
    return true;
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, save profile to API
    setTimeout(() => {
      // Update cookie with new name
      Cookies.set('admin_name', profileForm.name);
      
      setSubmitStatus({
        type: 'success',
        message: 'Profile updated successfully'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus({
          type: null,
          message: ''
        });
      }, 3000);
    }, 500);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    // In a real app, send password change to API
    setTimeout(() => {
      setSubmitStatus({
        type: 'success',
        message: 'Password changed successfully'
      });
      
      // Clear form and success message
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setSubmitStatus({
          type: null,
          message: ''
        });
      }, 3000);
    }, 500);
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, save notification settings to API
    setTimeout(() => {
      setSubmitStatus({
        type: 'success',
        message: 'Notification settings updated successfully'
      });
      
      setTimeout(() => {
        setSubmitStatus({
          type: null,
          message: ''
        });
      }, 3000);
    }, 500);
  };
  
  // Tabs for desktop
  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: faUser },
    { id: 'security', label: 'Security', icon: faKey },
    { id: 'notifications', label: 'Notifications', icon: faBell }
  ];
  
  return (
    <FadeIn>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Sidebar for desktop or tab bar for mobile */}
            {isMobile ? (
              <div className="flex border-b border-gray-200">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-2 text-sm font-medium text-center ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="w-64 bg-gray-50 border-r border-gray-200">
                <nav className="py-4">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
                      }`}
                    >
                      <FontAwesomeIcon icon={tab.icon} className="mr-3 h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
            
            {/* Main content */}
            <div className="flex-1 p-6">
              {/* Status message */}
              {submitStatus.type && (
                <div className={`mb-6 p-4 rounded-md ${
                  submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon 
                        icon={submitStatus.type === 'success' ? faSave : faExclamationTriangle} 
                        className={submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'} 
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          id="role"
                          name="role"
                          value={profileForm.role}
                          onChange={handleProfileChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-800 mb-3">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
                            required
                            minLength={8}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 8 characters long
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FontAwesomeIcon icon={faKey} className="mr-2" />
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium text-gray-800 mb-3">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Protect your account with 2FA</p>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account by requiring both your password and a verification code.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FontAwesomeIcon icon={faShield} className="mr-2" />
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                  
                  <form onSubmit={handleNotificationsSubmit}>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-md p-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emailNotifications"
                              name="emailNotifications"
                              type="checkbox"
                              checked={notificationSettings.emailNotifications}
                              onChange={handleNotificationChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                            <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="sellerRequests"
                              name="sellerRequests"
                              type="checkbox"
                              checked={notificationSettings.sellerRequests}
                              onChange={handleNotificationChange}
                              disabled={!notificationSettings.emailNotifications}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="sellerRequests" className="font-medium text-gray-700">Seller Registration Requests</label>
                            <p className="text-sm text-gray-500">New seller registration requests that need approval</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="newMessages"
                              name="newMessages"
                              type="checkbox"
                              checked={notificationSettings.newMessages}
                              onChange={handleNotificationChange}
                              disabled={!notificationSettings.emailNotifications}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="newMessages" className="font-medium text-gray-700">New Messages</label>
                            <p className="text-sm text-gray-500">Notifications for new marketplace messages</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="productApprovals"
                              name="productApprovals"
                              type="checkbox"
                              checked={notificationSettings.productApprovals}
                              onChange={handleNotificationChange}
                              disabled={!notificationSettings.emailNotifications}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="productApprovals" className="font-medium text-gray-700">Product Approval Requests</label>
                            <p className="text-sm text-gray-500">Notifications for new product listings that need approval</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="systemUpdates"
                              name="systemUpdates"
                              type="checkbox"
                              checked={notificationSettings.systemUpdates}
                              onChange={handleNotificationChange}
                              disabled={!notificationSettings.emailNotifications}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="systemUpdates" className="font-medium text-gray-700">System Updates</label>
                            <p className="text-sm text-gray-500">Important system updates and maintenance notifications</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default AdminAccountPage;