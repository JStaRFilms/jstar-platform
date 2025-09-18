import React from 'react';

/**
 * Database Status Component
 * Shows current database configuration and migration readiness indicators
 */
export const DatabaseStatus: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Database Status</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Current database configuration and migration readiness
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <span className="status-indicator status-active"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local Mode</span>
            </div>
            <div className="flex items-center">
              <span className="status-indicator status-warning"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cloud Sync Pending</span>
            </div>
            <div className="flex items-center">
              <span className="status-indicator status-active"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schema Up-to-Date</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
