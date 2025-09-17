'use client';

import React, { useState } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';
import SlidesList from './SlidesList';
import SlideshowConfig from './SlideshowConfig';
import LivePreview from './LivePreview';

/**
 * Props for HeroSlidesGrid component
 */
interface HeroSlidesGridProps {
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
 * Hero Slides Grid Component
 * Main content grid containing slides list and configuration panels
 * Mobile-first responsive design
 */
export const HeroSlidesGrid: React.FC<HeroSlidesGridProps> = ({
  slides,
  loading,
  error,
  onSlideSelect,
  onSlideEdit,
  onSlideDelete,
  onSlideToggle,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedSlideForPreview, setSelectedSlideForPreview] = useState<HeroSlide | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Left Column - Slides List */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {/* Slides List */}
        <SlidesList
          slides={slides}
          loading={loading}
          error={error}
          onSlideSelect={(slide) => {
            setSelectedSlideForPreview(slide);
            onSlideSelect?.(slide);
          }}
          onSlideEdit={onSlideEdit}
          onSlideDelete={onSlideDelete}
          onSlideToggle={onSlideToggle}
        />

        {/* Slide Reordering Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5">
            Slide Order
          </h2>
          <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
            <svg
              className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              />
            </svg>
            <p className="text-sm sm:text-base font-medium mb-2">
              Slide Reordering
            </p>
            <p className="text-xs sm:text-sm">
              Drag and drop functionality will be implemented here
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Configuration Panels */}
      <div className="space-y-4 sm:space-y-6">
        {/* Slideshow Configuration - Functional */}
        <SlideshowConfig />

        {/* Live Preview */}
        <LivePreview
          slide={selectedSlideForPreview}
          loading={loading}
          allSlides={slides}
          onSlideChange={setSelectedSlideForPreview}
        />

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              className="w-full px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Export all slides"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Slides
            </button>

            <button
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Import slides from file"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Import Slides
            </button>

            <button
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Duplicate all active slides"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Duplicate All
            </button>

            {/* Reset to Defaults Button */}
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to reset to default slides? This will delete all custom slides.')) {
                  try {
                    const response = await fetch('/api/admin/hero-slides', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'reset-to-defaults' }),
                    });

                    if (response.ok) {
                      // Refresh the page to show updated slides
                      window.location.reload();
                    } else {
                      alert('Failed to reset to defaults');
                    }
                  } catch (error) {
                    console.error('Error resetting to defaults:', error);
                    alert('Failed to reset to defaults');
                  }
                }
              }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Reset to default slides"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
