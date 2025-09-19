'use client';

import React from 'react';

/**
 * SystemStatus Component
 * Displays current lead nurturing system status and configuration
 */
const SystemStatus: React.FC = () => {
  return (
    <section>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Lead Magnet System Status</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Current lead nurturing system status and configuration
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <span className="status-indicator status-active"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Templates Active</span>
            </div>
            <div className="flex items-center">
              <span className="status-indicator status-active"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Spam Protection Active</span>
            </div>
            <div className="flex items-center">
              <span className="status-indicator status-active"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Localization Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemStatus;
