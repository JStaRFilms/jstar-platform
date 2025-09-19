'use client';

import React from 'react';

/**
 * Props for LeadMagnetsHeader component
 */
interface LeadMagnetsHeaderProps {
  /** Search query state */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Callback when save button is clicked */
  onSave: () => void;
}

/**
 * LeadMagnetsHeader Component
 * Header section with breadcrumb navigation, title, search, and save button
 */
const LeadMagnetsHeader: React.FC<LeadMagnetsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSave
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
          Lead Magnets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create and manage automated email and SMS templates for lead nurturing
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced"
        >
          <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Save Template
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent"
          />
          <svg className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default LeadMagnetsHeader;
