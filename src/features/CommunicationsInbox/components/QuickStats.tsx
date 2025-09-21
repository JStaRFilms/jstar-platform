'use client';

import React from 'react';

/**
 * Props for the QuickStats component
 */
interface QuickStatsProps {
  /** Statistics data */
  stats: {
    total: number;
    unread: number;
    responseRate: number;
    avgResponseTime: string;
  };
  /** Optional className for styling */
  className?: string;
}

/**
 * QuickStats Component
 * Displays key metrics and statistics for the Communications Inbox
 * Shows total messages, unread count, response rate, and average response time
 */
export const QuickStats: React.FC<QuickStatsProps> = ({
  stats,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {/* Total Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-red-500 mb-2">{stats.total}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Messages</div>
      </div>

      {/* Unread Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-purple-500 mb-2">{stats.unread}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</div>
      </div>

      {/* Response Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-green-500 mb-2">{stats.responseRate}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Response Rate</div>
      </div>

      {/* Average Response Time */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-red-500 mb-2">{stats.avgResponseTime}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Response Time</div>
      </div>
    </div>
  );
};
