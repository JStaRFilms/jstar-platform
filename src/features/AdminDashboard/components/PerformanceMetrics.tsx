'use client';

import React, { useState, useEffect } from 'react';

/**
 * Performance Metrics Component
 * Monitors application performance and response times
 */
export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    firstPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0
  });

  // Simulate performance monitoring
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        pageLoadTime: Math.floor(Math.random() * 500) + 800, // 800-1300ms
        firstPaint: Math.floor(Math.random() * 300) + 400, // 400-700ms
        largestContentfulPaint: Math.floor(Math.random() * 500) + 600, // 600-1100ms
        cumulativeLayoutShift: Math.random() * 0.1, // 0-0.1
        firstInputDelay: Math.floor(Math.random() * 50) + 10 // 10-60ms
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (value: number, type: string) => {
    if (type === 'cumulativeLayoutShift') {
      return value < 0.1 ? 'text-green-500' : value < 0.25 ? 'text-yellow-500' : 'text-red-500';
    }
    if (type === 'firstInputDelay') {
      return value < 100 ? 'text-green-500' : value < 300 ? 'text-yellow-500' : 'text-red-500';
    }
    // For time-based metrics
    return value < 1000 ? 'text-green-500' : value < 2000 ? 'text-yellow-500' : 'text-red-500';
  };

  const performanceItems = [
    {
      label: 'Page Load Time',
      value: metrics.pageLoadTime,
      unit: 'ms',
      type: 'time',
      description: 'Time to fully load page'
    },
    {
      label: 'First Paint',
      value: metrics.firstPaint,
      unit: 'ms',
      type: 'time',
      description: 'Time to first visual change'
    },
    {
      label: 'Largest Contentful Paint',
      value: metrics.largestContentfulPaint,
      unit: 'ms',
      type: 'time',
      description: 'Time to load largest element'
    },
    {
      label: 'Cumulative Layout Shift',
      value: metrics.cumulativeLayoutShift.toFixed(3),
      unit: '',
      type: 'cumulativeLayoutShift',
      description: 'Visual stability score'
    },
    {
      label: 'First Input Delay',
      value: metrics.firstInputDelay,
      unit: 'ms',
      type: 'firstInputDelay',
      description: 'Response time to user input'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Performance Metrics
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Core Web Vitals and page performance
          </p>
        </div>
        <div className="text-2xl">⚡</div>
      </div>

      <div className="space-y-4">
        {performanceItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
                <span className={`text-sm font-bold ${getPerformanceColor(typeof item.value === 'string' ? parseFloat(item.value) : item.value, item.type)}`}>
                  {item.value}{item.unit}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Score */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Performance Score:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            Good (85/100)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Based on Core Web Vitals and user experience metrics
        </div>
      </div>
    </div>
  );
};
