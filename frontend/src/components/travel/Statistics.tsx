'use client';

import React from 'react';
import { FadeIn } from '../animations';

const Statistics = () => {
  return (
    <section className="py-12 bg-green-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl text-deep-forest-green font-semibold">95%</h3>
              <p className="text-gray-600 uppercase tracking-wider text-sm">CLIENT<br />SATISFACTION</p>
            </div>
            <div>
              <h3 className="text-4xl text-deep-forest-green font-semibold">25+</h3>
              <p className="text-gray-600 uppercase tracking-wider text-sm">DESTINATIONS<br />COVERED</p>
            </div>
            <div>
              <h3 className="text-4xl text-deep-forest-green font-semibold">50+</h3>
              <p className="text-gray-600 uppercase tracking-wider text-sm">UNIQUE<br />EXPERIENCES OFFERED</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Statistics;