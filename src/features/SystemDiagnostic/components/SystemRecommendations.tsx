'use client';

import React from 'react';

const SystemRecommendations: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">System Recommendations</h2>
      <div className="space-y-4">
        <div className="p-4 border-l-4 border-red-500 rounded-r-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Upgrade VRAM Usage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">VRAM at 85% capacity during Llama3-70B operation</p>
            </div>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-xs font-medium">
              High
            </span>
          </div>
          <div className="mt-2">
            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
              Switch to Llama3-8B
            </button>
          </div>
        </div>

        <div className="p-4 border-l-4 border-yellow-500 rounded-r-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Optimize Storage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Vault storage at 78% capacity</p>
            </div>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded text-xs font-medium">
              Medium
            </span>
          </div>
          <div className="mt-2">
            <button className="text-sm text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 font-medium">
              Run Storage Scan
            </button>
          </div>
        </div>

        <div className="p-4 border-l-4 border-green-500 rounded-r-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Network Optimization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Network speed below optimal threshold</p>
            </div>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium">
              Low
            </span>
          </div>
          <div className="mt-2">
            <button className="text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 font-medium">
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemRecommendations;
