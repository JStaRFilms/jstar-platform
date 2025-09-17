'use client';

import React from 'react';

/**
 * System Metrics Component
 * Displays key system performance metrics and statistics
 */
export const SystemMetrics: React.FC = () => {
  const metrics = [
    {
      label: 'Local AI Speed',
      value: '1.2s',
      description: 'Response time (avg)'
    },
    {
      label: 'Uptime Today',
      value: '99.8%',
      description: 'Local execution'
    },
    {
      label: 'Security Score',
      value: '98/100',
      description: 'Based on 12 checks'
    },
    {
      label: 'Local Storage',
      value: '78%',
      description: '45.2 GB / 60 GB'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">System Metrics</h2>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="system-metric p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{metric.value}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
