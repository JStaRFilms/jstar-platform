import React from 'react';

/**
 * Quick Stats Component
 * Displays key metrics in card format
 */
export const QuickStats: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-500 mb-2">24</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Products</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-500 mb-2">1,247</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-500 mb-2">$12,480</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">30-Day Revenue</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-500 mb-2">3</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Piracy Alerts</div>
        </div>
      </div>
    </section>
  );
};
