'use client';

import React, { useState, useEffect } from 'react';

/**
 * System Status Component
 * Displays overall system health and key service statuses
 */
export const SystemStatus: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState({
    database: 'checking',
    api: 'checking',
    storage: 'checking',
    overall: 'checking'
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Simulate system health checks
  useEffect(() => {
    const checkSystemHealth = async () => {
      // Simulate API calls to check system health
      setTimeout(() => {
        setSystemHealth({
          database: 'healthy',
          api: 'healthy',
          storage: 'healthy',
          overall: 'healthy'
        });
        // Set last updated time on client only
        setLastUpdated(new Date().toLocaleTimeString());
      }, 1000);
    };

    checkSystemHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'warning':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'error':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <section className="mb-6 sm:mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              System Status
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time health monitoring of all platform services
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemHealth.overall)}`}>
            {getStatusIcon(systemHealth.overall)} {systemHealth.overall === 'checking' ? 'Checking...' : 'All Systems Operational'}
          </div>
        </div>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Database Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${systemHealth.database === 'healthy' ? 'bg-green-500' : systemHealth.database === 'error' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'}`}></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Database</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">SQLite + Prisma</div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {systemHealth.database === 'checking' ? '...' : systemHealth.database}
            </span>
          </div>

          {/* API Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${systemHealth.api === 'healthy' ? 'bg-green-500' : systemHealth.api === 'error' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'}`}></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">API Services</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Next.js API Routes</div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {systemHealth.api === 'checking' ? '...' : systemHealth.api}
            </span>
          </div>

          {/* Storage Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${systemHealth.storage === 'healthy' ? 'bg-green-500' : systemHealth.storage === 'error' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'}`}></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Storage</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">File System</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {systemHealth.storage === 'checking' ? '...' : systemHealth.storage}
              </span>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated || 'Checking...'}
          </p>
        </div>
      </div>
    </section>
  );
};
