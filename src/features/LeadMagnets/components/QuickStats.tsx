'use client';

import React from 'react';

/**
 * QuickStats Component
 * Displays key metrics and statistics for lead magnet performance
 */
const QuickStats: React.FC = () => {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-admin-red mb-2">24</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Templates</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-500 mb-2">18</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Email Templates</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-500 mb-2">6</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">SMS Templates</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-500 mb-2">100%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Delivery Rate</div>
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
