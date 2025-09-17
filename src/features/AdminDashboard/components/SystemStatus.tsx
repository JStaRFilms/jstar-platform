'use client';

import React from 'react';

/**
 * System Status Component
 * Displays overall system health and key service statuses
 */
export const SystemStatus: React.FC = () => {
  const statusItems = [
    {
      label: 'Local Mode',
      status: 'active',
      color: 'status-active'
    },
    {
      label: 'AI Models Running',
      status: 'active',
      color: 'status-active'
    },
    {
      label: 'Cloud Sync Pending',
      status: 'warning',
      color: 'status-warning'
    }
  ];

  return (
    <section className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">System Status</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Local execution status and cloud sync
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className={`status-indicator ${item.color}`}></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
