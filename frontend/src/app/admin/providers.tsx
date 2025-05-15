'use client';

import React from 'react';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

// Custom providers wrapper for Admin section
export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}

export default AdminProviders;