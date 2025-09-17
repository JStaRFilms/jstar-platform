'use client';

import React from 'react';

/**
 * System Diagnostic Header Component
 * Displays the diagnostic page header with system overview
 */
export const SystemDiagnosticHeader: React.FC = () => {
  const currentTime = new Date();

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Diagnostics
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Monitor system health, performance, and troubleshoot issues
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Last diagnostic run: {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Quick Status */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold text-green-500">✅</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">System Health</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold text-blue-500">98%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Performance</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold text-purple-500">0</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Errors</div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Database</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">SQLite + Prisma</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">API Services</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Next.js Routes</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">File System</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Storage Access</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Hero Slides</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Content System</div>
        </div>
      </div>
    </header>
  );
};
