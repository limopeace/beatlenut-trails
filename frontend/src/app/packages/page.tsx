'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to travel-listings page
    router.replace('/travel-listings');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pale-straw">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green mx-auto mb-4"></div>
        <p className="text-deep-forest">Redirecting to travel packages...</p>
      </div>
    </div>
  );
}