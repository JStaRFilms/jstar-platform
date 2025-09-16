'use client';

import React from 'react';

const PerformanceBenchmarks: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Performance Benchmarks</h2>
      <div className="space-y-5">
        {/* CPU Benchmark */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Benchmark</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">12,450</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Current</span>
            <span>Target: 17,200</span>
          </div>
        </div>

        {/* AI Processing */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Processing</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">8,740</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Current</span>
            <span>Target: 12,100</span>
          </div>
        </div>

        {/* Storage Speed */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Speed</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">3,450 MB/s</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Current</span>
            <span>Target: 3,750 MB/s</span>
          </div>
        </div>

        {/* Network Speed */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Speed</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">58 Mbps</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '42%' }}></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Current</span>
            <span>Target: 135 Mbps</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceBenchmarks;
