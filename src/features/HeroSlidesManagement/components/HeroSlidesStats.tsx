'use client';

import React from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';

/**
 * Props for HeroSlidesStats component
 */
interface HeroSlidesStatsProps {
  /** Array of hero slides */
  slides: HeroSlide[];
  /** Loading state */
  loading: boolean;
}

/**
 * Hero Slides Stats Component
 * Displays key statistics about hero slides
 * Mobile-first responsive design with proper loading states
 */
export const HeroSlidesStats: React.FC<HeroSlidesStatsProps> = ({
  slides,
  loading,
}) => {
  // Calculate statistics
  const totalSlides = slides.length;
  const activeSlides = slides.filter(slide => slide.isActive).length;
  const inactiveSlides = totalSlides - activeSlides;

  // Status indicators
  const getStatusIndicator = (isActive: boolean) => (
    <span
      className={`inline-block w-2 h-2 rounded-full mr-2 ${
        isActive
          ? 'bg-green-500 dark:bg-green-400'
          : 'bg-gray-400 dark:bg-gray-500'
      }`}
      aria-hidden="true"
    />
  );

  // Loading skeleton
  if (loading) {
    return (
      <section className="mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="animate-pulse flex items-center">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              </div>
              <div className="animate-pulse flex items-center">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-12 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6 sm:mb-8">
      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Hero Slides Status
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current slides and configuration
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center" role="status" aria-label={`${activeSlides} active slides`}>
              {getStatusIndicator(true)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {activeSlides} Active
              </span>
            </div>
            <div className="flex items-center" role="status" aria-label="API connection status">
              {getStatusIndicator(true)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Connected
              </span>
            </div>
            <div className="flex items-center" role="status" aria-label="Auto-advance timing">
              {getStatusIndicator(true)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-Advance: 7s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Slides */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-red-500 mb-2" aria-label={`${totalSlides} total slides`}>
            {totalSlides}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Slides
          </div>
        </div>

        {/* Active Slides */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-2" aria-label={`${activeSlides} active slides`}>
            {activeSlides}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Slides
          </div>
        </div>

        {/* Inactive Slides */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2" aria-label={`${inactiveSlides} inactive slides`}>
            {inactiveSlides}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Inactive Slides
          </div>
        </div>

        {/* Slide Interval */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-2" aria-label="7 second slide interval">
            7s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Slide Interval
          </div>
        </div>
      </div>
    </section>
  );
};
