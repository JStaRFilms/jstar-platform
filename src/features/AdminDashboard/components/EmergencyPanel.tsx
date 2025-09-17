'use client';

import React from 'react';

/**
 * Emergency Panel Component
 * Provides emergency controls and system recovery options
 */
export const EmergencyPanel: React.FC = () => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800">
      <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Emergency Panel</h2>
      <div className="space-y-3">
        <p className="text-sm text-red-800 dark:text-red-200">
          Critical functions for immediate system recovery and maintenance.
        </p>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced">
          ONE BUTTON: Revert to Last Working State
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
            Disable AI Features
          </button>
          <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
            Enable Read-Only Mode
          </button>
        </div>
        <button className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
          Send SOS Email to Dev Friend
        </button>
      </div>
    </div>
  );
};
