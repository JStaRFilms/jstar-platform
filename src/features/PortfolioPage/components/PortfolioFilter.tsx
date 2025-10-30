
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
    <section className="py-8 bg-filter-section-bg dark:bg-filter-section-bg-dark border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`portfolio-filter px-6 py-3 bg-filter-button-bg dark:bg-filter-button-bg-dark rounded-full font-medium text-foreground hover:bg-filter-button-hover-bg dark:hover:bg-filter-button-hover-bg-dark ${
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
