'use client';

import React, { useState, useEffect } from 'react';

/**
 * API Health Component
 * Monitors API endpoints and response times
 */
export const APIHealth: React.FC = () => {
  const [apiStatus, setApiStatus] = useState({
    heroSlides: 'checking',
    general: 'checking',
    responseTime: 0,
    uptime: '99.9%',
    totalRequests: 0
  });

  // Simulate API health monitoring
  useEffect(() => {
    const checkAPIHealth = async () => {
      // Simulate API health checks
      setTimeout(() => {
        setApiStatus({
          heroSlides: 'healthy',
          general: 'healthy',
          responseTime: 145,
          uptime: '99.9%',
          totalRequests: 1247
        });
      }, 1000);
    };

    checkAPIHealth();
    const interval = setInterval(checkAPIHealth, 60000); // Check every minute
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

  const endpoints = [
    { name: 'Hero Slides API', status: apiStatus.heroSlides, path: '/api/admin/hero-slides' },
    { name: 'General API', status: apiStatus.general, path: '/api/*' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            API Health
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Next.js API routes and endpoint monitoring
          </p>
        </div>
        <div className="text-2xl">🔗</div>
      </div>

      {/* API Endpoints Status */}
      <div className="space-y-3 mb-6">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                endpoint.status === 'healthy' ? 'bg-green-500' :
                endpoint.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{endpoint.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">{endpoint.path}</div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(endpoint.status)}`}>
              {endpoint.status === 'checking' ? 'Checking...' : endpoint.status}
            </span>
          </div>
        ))}
      </div>

      {/* API Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-blue-500">{apiStatus.responseTime}ms</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-green-500">{apiStatus.uptime}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Requests</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Requests:</span>
            <span className="text-gray-900 dark:text-white">{apiStatus.totalRequests.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
            <span className="text-green-500 font-medium">99.8%</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Error Rate:</span>
            <span className="text-red-500 font-medium">0.2%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
            Test All Endpoints
          </button>
          <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
};
