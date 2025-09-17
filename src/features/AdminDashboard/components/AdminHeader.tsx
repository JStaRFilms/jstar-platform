'use client';

import React from 'react';

/**
 * Admin Header Component
 * Displays the main dashboard header with welcome message and key metrics
 */
export const AdminHeader: React.FC = () => {
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good morning' :
                   currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            {greeting}, John! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Welcome to your J StaR Films admin dashboard
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold text-red-500">2</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Active Slides</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold text-green-500">99.9%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold text-blue-500">0</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Errors</div>
          </div>
        </div>
      </div>
    </header>
  );
};
