'use client';

import React from 'react';
import ESMHeader from '@/components/marketplace/ESMHeader';
import { BeatlenutFooter } from '@/components/travel';
import { SocketProvider } from '@/contexts/SocketContext';

export default function ESMPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <ESMHeader />
      {children}
      <BeatlenutFooter />
    </SocketProvider>
  );
}