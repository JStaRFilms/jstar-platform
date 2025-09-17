'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Props for HeroSlidesHeader component
 */
interface HeroSlidesHeaderProps {
  /** Callback when create button is clicked */
  onCreateClick: () => void;
}

/**
 * Hero Slides Header Component
 * Displays the page header with navigation breadcrumbs and action buttons
 * Mobile-first responsive design
 */
export const HeroSlidesHeader: React.FC<HeroSlidesHeaderProps> = ({
  onCreateClick,
}) => {
  return (
    <header className="mb-6 sm:mb-8">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        {/* Breadcrumbs and Title */}
        <div className="min-w-0 flex-1">
          {/* Breadcrumbs - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:flex items-center mb-2">
            <Link
              href="/admin/cms"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              CMS
            </Link>
            <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
            <span className="text-sm text-gray-900 dark:text-white font-medium">
              Hero Slides
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent truncate">
            Hero Slides Management
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Create, edit, and manage homepage hero slides
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 min-w-0">
          {/* Create Button - Full width on mobile */}
          <button
            onClick={onCreateClick}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Create new hero slide"
          >
            <svg
              className="h-4 w-4 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Slide
          </button>

          {/* Search - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:block relative min-w-0">
            <input
              type="text"
              placeholder="Search slides..."
              className="w-full min-w-[200px] pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              aria-label="Search hero slides"
            />
            <svg
              className="h-5 w-5 absolute left-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile Search - Shown only on mobile */}
      <div className="sm:hidden mt-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search slides..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            aria-label="Search hero slides"
          />
          <svg
            className="h-5 w-5 absolute left-3 top-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};
