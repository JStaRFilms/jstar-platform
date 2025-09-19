'use client';

import React from 'react';

/**
 * EmergencyPanel Component
 * Critical functions for immediate lead nurturing management
 */
const EmergencyPanel: React.FC = () => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800">
      <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Lead Magnet Emergency Tools</h2>
      <div className="space-y-3">
        <p className="text-sm text-red-800 dark:text-red-200">
          Critical functions for immediate lead nurturing management.
        </p>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced">
          ONE BUTTON: Send to 500 Leads
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
            Pause Campaign
          </button>
          <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
            Emergency Test
          </button>
        </div>
        <button className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
          Send Report to Team
        </button>
      </div>
    </div>
  );
};

export default EmergencyPanel;
