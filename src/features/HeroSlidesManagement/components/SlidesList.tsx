'use client';

import React, { useState } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';

/**
 * Props for SlidesList component
 */
interface SlidesListProps {
  /** Array of hero slides */
  slides: HeroSlide[];
  /** Loading state */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** Callback when slide is selected */
  onSlideSelect?: (slide: HeroSlide) => void;
  /** Callback when slide edit is requested */
  onSlideEdit?: (slide: HeroSlide) => void;
  /** Callback when slide deletion is requested */
  onSlideDelete?: (slideId: string) => void;
  /** Callback when slide status is toggled */
  onSlideToggle?: (slideId: string, isActive: boolean) => void;
}

/**
 * SlidesList Component
 * Displays a list of hero slides with management actions
 * Mobile-first responsive design with proper accessibility
 */
const SlidesList: React.FC<SlidesListProps> = ({
  slides,
  loading,
  error,
  onSlideSelect,
  onSlideEdit,
  onSlideDelete,
  onSlideToggle,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter slides based on status
  const filteredSlides = slides.filter(slide => {
    if (filter === 'active') return slide.isActive;
    if (filter === 'inactive') return !slide.isActive;
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Hero Slides
        </h2>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="slide-filter"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Filter:
          </label>
          <select
            id="slide-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            aria-label="Filter slides by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
          <svg
            className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p className="text-sm sm:text-base">Loading slides...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8 sm:py-12 text-red-500 dark:text-red-400">
          <svg
            className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-red-300 dark:text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm sm:text-base font-medium mb-2">Error loading slides</p>
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredSlides.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
          <svg
            className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-sm sm:text-base font-medium mb-2">No slides found</p>
          <p className="text-xs sm:text-sm">
            {filter === 'all'
              ? 'Create your first slide to get started'
              : `No ${filter} slides found`
            }
          </p>
        </div>
      )}

      {/* Slides List */}
      {!loading && !error && filteredSlides.length > 0 && (
        <div className="space-y-3 sm:space-y-4" role="list">
          {filteredSlides.map((slide) => (
            <div
              key={slide.id}
              className="slide-preview p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2"
              onClick={() => onSlideSelect?.(slide)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSlideSelect?.(slide);
                }
              }}
              aria-label={`Slide: ${slide.titleLine1} - ${slide.isActive ? 'Active' : 'Inactive'}`}
            >
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {slide.titleLine1}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {slide.titleLine2}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      slide.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Created: {new Date(slide.createdAt).toLocaleDateString()}
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlideEdit?.(slide);
                    }}
                    className="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Edit slide: ${slide.titleLine1}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlideToggle?.(slide.id, !slide.isActive);
                    }}
                    className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`${slide.isActive ? 'Disable' : 'Enable'} slide: ${slide.titleLine1}`}
                  >
                    {slide.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this slide?')) {
                        onSlideDelete?.(slide.id);
                      }
                    }}
                    className="px-3 py-1.5 text-red-600 hover:text-red-700 dark:hover:text-red-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Delete slide: ${slide.titleLine1}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {slide.titleLine1}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {slide.titleLine2}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      slide.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      Order #{slide.sortOrder}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tagline:</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {slide.tagline}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created:</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {new Date(slide.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlideEdit?.(slide);
                    }}
                    className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Edit slide: ${slide.titleLine1}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlideToggle?.(slide.id, !slide.isActive);
                    }}
                    className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`${slide.isActive ? 'Disable' : 'Enable'} slide: ${slide.titleLine1}`}
                  >
                    {slide.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this slide?')) {
                        onSlideDelete?.(slide.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Delete slide: ${slide.titleLine1}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlidesList;
