'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/admin/users" 
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Users
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Edit user with ID: {userId}</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Coming Soon</h3>
          <p className="text-yellow-700">
            The user editing functionality is currently being developed. This page will allow you to:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-700">
            <li>Edit user profile information</li>
            <li>Update user roles and permissions</li>
            <li>Manage user status and verification</li>
            <li>View user activity history</li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <input
                type="text"
                value={userId}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 text-sm text-gray-600">This functionality will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}