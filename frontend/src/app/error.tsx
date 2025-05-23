'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
        <p className="mt-4 text-gray-600">
          We're sorry, but something went wrong. Please try again later.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="w-full sm:w-auto bg-green-800 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto mt-4 sm:mt-0 border border-green-800 text-green-800 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}