'use client';

import React from 'react';

const EmergencyTools: React.FC = () => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800">
      <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Emergency Tools</h2>
      <div className="space-y-3">
        <p className="text-sm text-red-800 dark:text-red-200">
          Critical functions for immediate system recovery and maintenance.
        </p>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 transform hover:scale-105">
          ONE BUTTON: Optimize for Low Resources
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            Force Restart AI
          </button>
          <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            Switch to Lite Mode
          </button>
        </div>
        <button className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          Send System Report to Dev Friend
        </button>
      </div>
    </div>
  );
};

export default EmergencyTools;
