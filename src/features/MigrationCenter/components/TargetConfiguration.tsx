import React, { useState } from 'react';

/**
 * Target Configuration Component
 * Displays and manages target database configuration settings
 */
export const TargetConfiguration: React.FC = () => {
  const [migrationMode, setMigrationMode] = useState('Full Migration');

  const handleChangeTarget = () => {
    // TODO: Implement target database change
    console.log('Changing target database...');
  };

  const handleConnect = () => {
    // TODO: Implement database connection
    console.log('Connecting to Supabase...');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Target Configuration</h2>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Database Type</div>
          <div className="flex justify-between items-center">
            <div className="font-medium text-gray-900 dark:text-white">Supabase</div>
            <button
              onClick={handleChangeTarget}
              className="text-xs text-admin-red hover:text-red-700 dark:hover:text-red-400 hover:underline"
            >
              Change
            </button>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Connection Status</div>
          <div className="flex items-center">
            <span className="status-indicator status-warning"></span>
            <span className="text-sm text-gray-700 dark:text-gray-300">Not connected</span>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Connection Details</div>
          <div className="mt-2 space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              URL: <span className="font-mono">https://your-project.supabase.co</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Public Key: <span className="font-mono">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Migration Mode</div>
          <div className="mt-2">
            <select
              value={migrationMode}
              onChange={(e) => setMigrationMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option>Full Migration</option>
              <option>Incremental Migration</option>
              <option>Test Migration</option>
              <option>Hybrid Mode (Local + Cloud)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleConnect}
          className="w-full px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
        >
          Connect to Supabase
        </button>
      </div>
    </div>
  );
};
