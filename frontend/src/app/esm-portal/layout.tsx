'use client';

import React from 'react';
import ESMHeader from '@/components/marketplace/ESMHeader';
import { BeatlenutFooter } from '@/components/travel';

export default function ESMPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ESMHeader />
      {children}
      <BeatlenutFooter />
    </>
  );
}