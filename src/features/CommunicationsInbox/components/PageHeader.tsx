'use client';

import React from 'react';
import {
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon
} from '@/components/icons';

/**
 * Props for the PageHeader component
 */
interface PageHeaderProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Current search query */
  searchQuery: string;
  /** Handler for search query changes */
  onSearchChange: (query: string) => void;
  /** Handler for archive action */
  onArchive: () => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * PageHeader Component
 * Displays the page header with breadcrumbs, title, description, and action buttons
 * Provides consistent header styling across admin pages with integrated actions
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title = 'Communications Inbox',
  description = 'Manage all contact form submissions and communications',
  searchQuery,
  onSearchChange,
  onArchive,
  className = ''
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <header className={`mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Title */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
            {title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center">
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              Respond
            </button>
            <button
              onClick={onArchive}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <ArchiveBoxIcon className="h-4 w-4 mr-2" />
              Archive
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
