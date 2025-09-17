import React from 'react';

/**
 * System Health Component
 * Displays system health metrics with progress bars
 */
export const SystemHealth: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Health</h2>
        <button className="text-sm bg-red-50 dark:bg-red-900/20 text-red-500 px-3 py-1 rounded-lg">
          Run Diagnostics
        </button>
      </div>
      <div className="space-y-5">
        {/* Local AI Status */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local AI Models</span>
            <span className="text-sm font-medium text-green-600">Running</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Ollama (Llama3-70B) • LM Studio (Mistral) • Local GPU: 85% VRAM
          </div>
        </div>

        {/* Storage Usage */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Usage</span>
            <span className="text-sm font-medium text-yellow-600">78%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            45.2 GB / 60 GB • Vault storage: 12.1 GB
          </div>
        </div>

        {/* Database Status */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database</span>
            <span className="text-sm font-medium text-green-600">Connected</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            SQLite • Last backup: 2 hours ago • 12,458 records
          </div>
        </div>
      </div>
    </div>
  );
};
