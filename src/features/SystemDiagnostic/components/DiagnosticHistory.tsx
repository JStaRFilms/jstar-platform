'use client';

import React from 'react';
import { Eye } from 'lucide-react';

const DiagnosticHistory: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Diagnostic History</h2>
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Full System Diagnostic</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Today, 2:45 PM</div>
            </div>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium">
              Passed
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">Performance Score: 4.8/10</div>
            <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">AI Model Benchmark</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Yesterday, 11:20 AM</div>
            </div>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded text-xs font-medium">
              Warnings
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">VRAM usage at 92%</div>
            <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Storage Scan</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">June 10, 2024</div>
            </div>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium">
              Passed
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">45.2 GB used</div>
            <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticHistory;
