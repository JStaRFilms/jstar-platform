'use client';

import React from 'react';
import {
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon
} from '@/components/icons';

/**
 * Props for the ActionBar component
 */
interface ActionBarProps {
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
 * ActionBar Component
 * Provides action buttons and search functionality for the Communications Inbox
 * Handles user interactions for responding, archiving, and searching messages
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  searchQuery,
  onSearchChange,
  onArchive,
  className = ''
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
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
  );
};
