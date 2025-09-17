'use client';

import React from 'react';

/**
 * Quick Stats Component
 * Displays key platform metrics and statistics
 */
export const QuickStats: React.FC = () => {
  const statItems = [
    {
      label: 'Active Products',
      value: '24',
      color: 'text-admin-red'
    },
    {
      label: 'Total Users',
      value: '1,247',
      color: 'text-purple-500'
    },
    {
      label: '30-Day Revenue',
      value: '$12,480',
      color: 'text-green-500'
    },
    {
      label: 'Piracy Alerts',
      value: '3',
      color: 'text-red-500'
    }
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className={`text-2xl font-bold mb-2 ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
