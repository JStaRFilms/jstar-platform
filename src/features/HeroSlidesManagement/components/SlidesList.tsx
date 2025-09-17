'use client';

import React, { useState } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';

/**
 * Props for SlidesList component
 */
interface SlidesListProps {
  slides: HeroSlide[];
  loading: boolean;
  error: string | null;
  onSlideSelect?: (slide: HeroSlide) => void;
  onSlideEdit?: (slide: HeroSlide) => void;
  onSlideDelete?: (slideId: string) => void;
  onSlideToggle?: (slideId: string, isActive: boolean) => void;
}

/**
 * SlidesList Component
 * Displays a list of hero slides with management actions
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hero Slides</h2>
          <div className="flex space-x-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <p>Loading slides...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hero Slides</h2>
          <div className="flex space-x-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="text-center py-12 text-red-500 dark:text-red-400">
          <svg className="h-12 w-12 mx-auto mb-4 text-red-300 dark:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="font-medium">Error loading slides</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hero Slides</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {filteredSlides.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p>No slides found</p>
          <p className="text-sm mt-1">
            {filter === 'all' ? 'Create your first slide to get started' : `No ${filter} slides found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSlides.map((slide) => (
            <div
              key={slide.id}
              className="slide-preview p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
              onClick={() => onSlideSelect?.(slide)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{slide.titleLine1}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{slide.titleLine2}</p>
                </div>
                <div className="flex items-center space-x-2">
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

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">Tagline:</div>
                <div className="font-medium text-gray-900 dark:text-white">{slide.tagline}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Sort Order:</div>
                <div className="font-medium text-gray-900 dark:text-white">{slide.sortOrder}</div>
              </div>

              <div className="mt-3 flex justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {new Date(slide.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlideEdit?.(slide);
                    }}
                    className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSlideToggle?.(slide.id, !slide.isActive);
                    }}
                    className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium"
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
                    className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium"
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
