import React from 'react';

/**
 * System Metrics Component
 * Displays key system performance metrics
 */
export const SystemMetrics: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">System Metrics</h2>
      <div className="space-y-4">
        <div className="system-metric p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local AI Speed</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">1.2s</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Response time (avg)</div>
        </div>
        <div className="system-metric p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uptime Today</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">99.8%</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Local execution</div>
        </div>
        <div className="system-metric p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Score</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">98/100</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Based on 12 checks</div>
        </div>
        <div className="system-metric p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local Storage</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">78%</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">45.2 GB / 60 GB</div>
        </div>
      </div>
    </div>
  );
};
