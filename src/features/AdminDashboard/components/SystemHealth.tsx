'use client';

import React, { useState, useEffect } from 'react';

/**
 * System Health Component
 * Displays detailed system health metrics and performance indicators
 */
export const SystemHealth: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    responseTime: 0
  });

  // Simulate health metrics
  useEffect(() => {
    const updateMetrics = () => {
      setHealthMetrics({
        cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
        memory: Math.floor(Math.random() * 40) + 30, // 30-70%
        disk: Math.floor(Math.random() * 20) + 5, // 5-25%
        network: Math.floor(Math.random() * 50) + 10, // 10-60%
        responseTime: Math.floor(Math.random() * 200) + 50 // 50-250ms
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value: number, type: string) => {
    if (type === 'responseTime') {
      return value < 100 ? 'text-green-500' : value < 200 ? 'text-yellow-500' : 'text-red-500';
    }
    return value < 50 ? 'text-green-500' : value < 80 ? 'text-yellow-500' : 'text-red-500';
  };

  const getProgressColor = (value: number, type: string) => {
    if (type === 'responseTime') {
      return value < 100 ? 'bg-green-500' : value < 200 ? 'bg-yellow-500' : 'bg-red-500';
    }
    return value < 50 ? 'bg-green-500' : value < 80 ? 'bg-yellow-500' : 'bg-red-500';
  };

  const metrics = [
    {
      label: 'CPU Usage',
      value: healthMetrics.cpu,
      unit: '%',
      type: 'cpu',
      description: 'System processor utilization'
    },
    {
      label: 'Memory Usage',
      value: healthMetrics.memory,
      unit: '%',
      type: 'memory',
      description: 'RAM utilization'
    },
    {
      label: 'Disk Usage',
      value: healthMetrics.disk,
      unit: '%',
      type: 'disk',
      description: 'Storage utilization'
    },
    {
      label: 'Network I/O',
      value: healthMetrics.network,
      unit: '%',
      type: 'network',
      description: 'Network activity'
    },
    {
      label: 'Response Time',
      value: healthMetrics.responseTime,
      unit: 'ms',
      type: 'responseTime',
      description: 'API response time'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            System Health
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time performance metrics and system status
          </p>
        </div>
        <div className="text-2xl">💚</div>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metric.label}
                </span>
                <span className={`text-sm font-bold ${getHealthColor(metric.value, metric.type)}`}>
                  {metric.value}{metric.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metric.value, metric.type)}`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {metric.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Health Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Overall Health:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            Excellent
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
          <span className="text-gray-900 dark:text-white">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};
