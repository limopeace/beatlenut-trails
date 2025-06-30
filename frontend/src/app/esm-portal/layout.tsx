'use client';

import React from 'react';
import { SocketProvider } from '@/contexts/SocketContext';

export default function ESMPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}