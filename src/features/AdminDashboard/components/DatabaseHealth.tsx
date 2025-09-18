'use client';

import React, { useState, useEffect } from 'react';

/**
 * Database Health Component
 * Monitors database connectivity and performance
 */
export const DatabaseHealth: React.FC = () => {
  const [dbStatus, setDbStatus] = useState({
    connection: 'checking',
    lastQuery: 0,
    totalQueries: 0,
    avgResponseTime: 0,
    errorCount: 0
  });

  // Simulate database health monitoring
  useEffect(() => {
    const checkDatabaseHealth = async () => {
      // Simulate database health check
      setTimeout(() => {
        setDbStatus({
          connection: 'healthy',
          lastQuery: Date.now() - 15000, // 15 seconds ago
          totalQueries: 1247,
          avgResponseTime: 45, // ms
          errorCount: 0
        });
      }, 1000);
    };

    checkDatabaseHealth();
    const interval = setInterval(checkDatabaseHealth, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
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

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Database Health
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            SQLite database connectivity and performance
          </p>
        </div>
        <div className="text-2xl">💾</div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Connection Status</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(dbStatus.connection)}`}>
            {dbStatus.connection === 'checking' ? 'Checking...' : dbStatus.connection}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              dbStatus.connection === 'healthy' ? 'bg-green-500' :
              dbStatus.connection === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: dbStatus.connection === 'healthy' ? '100%' : dbStatus.connection === 'warning' ? '75%' : '25%' }}
          ></div>
        </div>
      </div>

      {/* Database Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-blue-500">{dbStatus.totalQueries.toLocaleString()}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Queries</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-green-500">{dbStatus.avgResponseTime}ms</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Last Query:</span>
            <span className="text-gray-900 dark:text-white">{formatTimeAgo(dbStatus.lastQuery)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Error Count:</span>
            <span className={`font-medium ${dbStatus.errorCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {dbStatus.errorCount}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Active Connections:</span>
            <span className="text-gray-900 dark:text-white">1</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
            Test Connection
          </button>
          <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
};
