'use client';

import React from 'react';

const SystemStatus: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">System Status</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Current hardware utilization and AI model health
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local Mode</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Models Running</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cloud Sync Pending</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemStatus;
