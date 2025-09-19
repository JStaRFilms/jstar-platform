'use client';

import React from 'react';

/**
 * TemplateAnalytics Component
 * Performance metrics and A/B testing results for lead magnet templates
 */
const TemplateAnalytics: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Template Analytics</h2>
      <div className="space-y-5">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-2">Performance Metrics</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">98.7%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Delivery Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">32.4%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Open Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">8.7%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Click Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">0.2%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Spam Complaints</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">Top Performing Elements</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Personalized greeting</span>
              <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                +23%
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Clear CTA button</span>
              <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                +18%
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Mobile-friendly layout</span>
              <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                +15%
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Shorter subject lines</span>
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                +5%
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">A/B Test Results</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Version A: Personalized CTA</span>
                <span className="text-sm font-medium">32.4%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-admin-red h-2 rounded-full" style={{ width: '32.4%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Version B: General CTA</span>
                <span className="text-sm font-medium">24.7%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-admin-red h-2 rounded-full" style={{ width: '24.7%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Version C: No CTA</span>
                <span className="text-sm font-medium">18.2%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-admin-red h-2 rounded-full" style={{ width: '18.2%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium">
          Run A/B Test
        </button>
      </div>
    </div>
  );
};

export default TemplateAnalytics;
