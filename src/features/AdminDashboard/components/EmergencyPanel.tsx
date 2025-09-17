'use client';

import React, { useState } from 'react';

/**
 * Emergency Panel Component
 * Provides emergency controls and system recovery options
 */
export const EmergencyPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const emergencyActions = [
    {
      label: 'Reset to Defaults',
      description: 'Restore all default slides and settings',
      icon: '🔄',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      action: () => {
        if (window.confirm('Are you sure you want to reset everything to defaults? This will delete all custom slides and settings.')) {
          alert('Reset functionality would be implemented here');
        }
      }
    },
    {
      label: 'Clear Cache',
      description: 'Clear all cached data and restart services',
      icon: '🧹',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      action: () => {
        if (window.confirm('Clear all cached data? This may temporarily slow down the system.')) {
          alert('Cache clearing functionality would be implemented here');
        }
      }
    },
    {
      label: 'Emergency Stop',
      description: 'Stop all background processes immediately',
      icon: '⏹️',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      action: () => {
        if (window.confirm('Stop all background processes? This may affect system functionality.')) {
          alert('Emergency stop functionality would be implemented here');
        }
      }
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Emergency Panel
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            System recovery and emergency controls
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={isExpanded ? 'Collapse emergency panel' : 'Expand emergency panel'}
        >
          <svg
            className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>

      {/* System Status Indicator */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-green-800 dark:text-green-300">
          All Systems Operational
        </span>
      </div>

      {/* Emergency Actions */}
      {isExpanded && (
        <div className="space-y-3">
          {emergencyActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`w-full p-4 ${action.bgColor} border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-all duration-200 group`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-lg ${action.color}`}>
                  {action.icon}
                </div>
                <div className="text-left flex-1">
                  <div className={`font-semibold text-sm ${action.color} group-hover:underline`}>
                    {action.label}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {action.description}
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick Status */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-500">0</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Active Alerts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-500">24/7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Monitoring</div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">🚨</span>
          <span className="text-gray-700 dark:text-gray-300">
            Need help? Contact system administrator
          </span>
        </div>
      </div>
    </div>
  );
};
