'use client';

import React from 'react';

/**
 * System Metrics Component
 * Displays key system performance metrics and statistics
 */
export const SystemMetrics: React.FC = () => {
  const metrics = [
    {
      label: 'Total API Calls',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: '🔗',
      description: 'This month'
    },
    {
      label: 'Avg Response Time',
      value: '145ms',
      change: '-8%',
      changeType: 'positive',
      icon: '⚡',
      description: 'Last 24 hours'
    },
    {
      label: 'Database Queries',
      value: '8,932',
      change: '+5%',
      changeType: 'neutral',
      icon: '💾',
      description: 'This week'
    },
    {
      label: 'Error Rate',
      value: '0.02%',
      change: '-15%',
      changeType: 'positive',
      icon: '✅',
      description: 'Last 7 days'
    }
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = (changeType: string, change: string) => {
    if (changeType === 'positive') {
      return change.startsWith('+') ? '📈' : '📉';
    }
    if (changeType === 'negative') {
      return '📉';
    }
    return '➡️';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            System Metrics
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Key performance indicators and system statistics
          </p>
        </div>
        <div className="text-2xl">📊</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg" role="img" aria-label={metric.label}>
                {metric.icon}
              </div>
              <div className={`flex items-center text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                <span className="mr-1">
                  {getChangeIcon(metric.changeType, metric.change)}
                </span>
                {metric.change}
              </div>
            </div>
            <div className="mb-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {metric.label}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Performance Score:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            98/100
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
        </div>
      </div>
    </div>
  );
};
