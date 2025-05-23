'use client';

import Link from 'next/link';
import React, { useState } from 'react';

const DemoLinks = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${isExpanded ? 'p-4' : 'p-3'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-800">BeatlenutTrails Demo</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Northeast Designs:</h4>
              <ul className="space-y-1 text-xs">
                <li className="px-2 py-1 hover:bg-gray-100 rounded">
                  <Link href="/streamlined" className="text-blue-600 hover:text-blue-800 block">
                    <span className="font-medium">Original</span>
                    <span className="text-gray-500 text-xs ml-1">(With Grid Issues)</span>
                  </Link>
                </li>
                <li className="px-2 py-1 hover:bg-gray-100 rounded bg-blue-50">
                  <Link href="/streamlined-fixed" className="text-blue-700 hover:text-blue-900 font-medium block">
                    <span className="font-medium">Fixed Version</span>
                    <span className="text-green-600 text-xs ml-1">(Recommended)</span>
                  </Link>
                </li>
                <li className="px-2 py-1 hover:bg-gray-100 rounded">
                  <Link href="/northeast" className="text-blue-600 hover:text-blue-800 block">
                    <span className="font-medium">Design System</span>
                    <span className="text-gray-500 text-xs ml-1">(Full Implementation)</span>
                  </Link>
                </li>
                <li className="px-2 py-1 hover:bg-gray-100 rounded bg-green-50">
                  <Link href="/vaani-test" className="text-green-700 hover:text-green-900 font-medium block">
                    <span className="font-medium">Vaani Style</span>
                    <span className="text-green-600 text-xs ml-1">(New)</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Main Navigation:</h4>
              <ul className="space-y-1 text-xs">
                <li className="px-2 py-1 hover:bg-gray-100 rounded">
                  <Link href="/" className="text-blue-600 hover:text-blue-800 block">
                    Home
                  </Link>
                </li>
                <li className="px-2 py-1 hover:bg-gray-100 rounded">
                  <Link href="/about" className="text-blue-600 hover:text-blue-800 block">
                    About
                  </Link>
                </li>
                <li className="px-2 py-1 hover:bg-gray-100 rounded">
                  <Link href="/services" className="text-blue-600 hover:text-blue-800 block">
                    Services
                  </Link>
                </li>
                <li className="px-2 py-1 hover:bg-gray-100 rounded">
                  <Link href="/contact" className="text-blue-600 hover:text-blue-800 block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DemoLinks;