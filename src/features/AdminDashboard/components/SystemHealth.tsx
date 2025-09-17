'use client';

import React from 'react';

/**
 * System Health Component
 * Displays detailed system health metrics and performance indicators
 */
export const SystemHealth: React.FC = () => {
  const healthMetrics = [
    {
      label: 'Local AI Models',
      status: 'Running',
      statusColor: 'text-green-600',
      progress: 100,
      progressColor: 'bg-gradient-to-r from-admin-red to-red-500',
      details: 'Ollama (Llama3-70B) • LM Studio (Mistral) • Local GPU: 85% VRAM'
    },
    {
      label: 'Storage Usage',
      status: '78%',
      statusColor: 'text-yellow-600',
      progress: 78,
      progressColor: 'bg-gradient-to-r from-admin-red to-red-500',
      details: '45.2 GB / 60 GB • Vault storage: 12.1 GB'
    },
    {
      label: 'Database',
      status: 'Connected',
      statusColor: 'text-green-600',
      progress: 100,
      progressColor: 'bg-gradient-to-r from-admin-red to-red-500',
      details: 'SQLite • Last backup: 2 hours ago • 12,458 records'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Health</h2>
        <button className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg">
          Run Diagnostics
        </button>
      </div>
      <div className="space-y-5">
        {healthMetrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
              <span className={`text-sm font-medium ${metric.statusColor}`}>{metric.status}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className={`${metric.progressColor} h-2.5 rounded-full`} style={{ width: `${metric.progress}%` }}></div>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {metric.details}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
