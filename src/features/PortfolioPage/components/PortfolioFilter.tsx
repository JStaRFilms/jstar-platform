
'use client';

import React, { useState } from 'react';

const PortfolioFilter = () => {
  const [activeFilter, setActiveFilter] = useState('All Projects');

  const filters = [
    'All Projects',
    'Wedding Films',
    'Event Coverage',
    'Apps',
    'Brand Videos',
  ];

  return (
    <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`portfolio-filter px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-full font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 ${
                activeFilter === filter ? 'active' : ''
              }`}>
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioFilter;
