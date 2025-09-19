'use client';

import React from 'react';

/**
 * Props for FeatureFlagsHeader component
 */
interface FeatureFlagsHeaderProps {
  /** Callback when create feature button is clicked */
  onCreateFeature: () => void;
  /** Search term for filtering features */
  searchTerm: string;
  /** Callback when search term changes */
  onSearchChange: (term: string) => void;
}

/**
 * Feature Flags Header Component
 * Displays the page title, description, and action buttons
 * Mobile-first responsive design with proper touch targets
 */
export const FeatureFlagsHeader: React.FC<FeatureFlagsHeaderProps> = ({
  onCreateFeature,
  searchTerm,
  onSearchChange
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
          Feature Flags
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
          Dark launch features, target user groups, and run A/B tests
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button
          onClick={onCreateFeature}
          className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 min-h-[44px] flex items-center justify-center"
        >
          <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span className="hidden sm:inline">Create Feature Flag</span>
          <span className="sm:hidden">Create</span>
        </button>
        <div className="relative flex-1 md:flex-initial">
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent w-full min-h-[44px]"
          />
          <svg className="h-5 w-5 absolute left-3 top-2.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </header>
  );
};
