import React, { useState } from 'react';

/**
 * Hybrid Mode Configuration Component
 * Manages hybrid mode settings for local AI with cloud database
 */
export const HybridModeConfig: React.FC = () => {
  const [hybridModeEnabled, setHybridModeEnabled] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState('Real-time');

  const handleConfigureHybrid = () => {
    // TODO: Implement hybrid mode configuration
    console.log('Configuring hybrid mode...');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Hybrid Mode</h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={hybridModeEnabled}
            onChange={(e) => setHybridModeEnabled(e.target.checked)}
            className="mt-1 rounded border-gray-300 dark:border-gray-600 text-admin-red focus:ring-admin-red"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Enable Hybrid Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Run local AI models with cloud database
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Recommendation:</strong> Hybrid Mode is ideal for maintaining local AI execution while scaling your database infrastructure.
          </p>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local AI Models</span>
            <span className="text-sm font-medium text-green-600">Connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cloud Database</span>
            <span className="text-sm font-medium text-yellow-600">Pending</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sync Frequency</span>
            <select
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
            >
              <option>Real-time</option>
              <option>Every 5 min</option>
              <option>Every hour</option>
              <option>Manual</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleConfigureHybrid}
          className="w-full px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
        >
          Configure Hybrid Mode
        </button>
      </div>
    </div>
  );
};
