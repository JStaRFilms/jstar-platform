
'use client';

import React from 'react';

const SearchAndFilter = () => {
  return (
    <section className="py-8 bg-filter-section-bg dark:bg-filter-section-bg-dark border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Search */}
          <div className="flex-1 w-full">
            <div className="relative">
              <input type="text" placeholder="Search articles..."
                     className="search-input w-full px-4 py-3 pl-12 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-filter-button-bg dark:bg-filter-button-bg-dark text-foreground" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button className="category-badge px-6 py-3 rounded-full font-medium text-foreground bg-filter-button-bg dark:bg-filter-button-bg-dark hover:bg-filter-button-hover-bg dark:hover:bg-filter-button-hover-bg-dark">
              All
            </button>
            <button className="category-badge px-6 py-3 rounded-full font-medium text-foreground bg-filter-button-bg dark:bg-filter-button-bg-dark hover:bg-filter-button-hover-bg dark:hover:bg-filter-button-hover-bg-dark">
              Video
            </button>
            <button className="category-badge px-6 py-3 rounded-full font-medium text-foreground bg-filter-button-bg dark:bg-filter-button-bg-dark hover:bg-filter-button-hover-bg dark:hover:bg-filter-button-hover-bg-dark">
              Apps
            </button>
            <button className="category-badge px-6 py-3 rounded-full font-medium text-foreground bg-filter-button-bg dark:bg-filter-button-bg-dark hover:bg-filter-button-hover-bg dark:hover:bg-filter-button-hover-bg-dark">
              AI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchAndFilter;
