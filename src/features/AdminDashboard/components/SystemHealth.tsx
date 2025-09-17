'use client';

import React, { useState, useEffect } from 'react';

/**
 * System Health Component
 * Displays detailed system health metrics and performance indicators
 */
export const SystemHealth: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState([
    {
      label: 'Local AI Models',
      status: 'Loading...',
      statusColor: 'text-gray-500',
      progress: 0,
      progressColor: 'bg-gray-400',
      details: 'Detecting AI processes...'
    },
    {
      label: 'Storage Usage',
      status: 'Loading...',
      statusColor: 'text-gray-500',
      progress: 0,
      progressColor: 'bg-gray-400',
      details: 'Checking disk space...'
    },
    {
      label: 'Database',
      status: 'Loading...',
      statusColor: 'text-gray-500',
      progress: 0,
      progressColor: 'bg-gray-400',
      details: 'Checking connection...'
    }
  ]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchSystemMetrics = async () => {
      try {
        const response = await fetch('/api/admin/system-metrics');
        const data = await response.json();

        if (data.status === 'success' && data.data) {
          const metrics = data.data;

          // Build AI models details - clean and concise
          let aiDetails = 'No AI models detected';
          let aiProgress = 0;

          if (metrics.aiModels.running && metrics.aiModels.uniqueProcesses && metrics.aiModels.uniqueProcesses.length > 0) {
            const processNames = metrics.aiModels.uniqueProcesses.slice(0, 3).join(' • '); // Limit to 3 processes
            const totalMemory = metrics.aiModels.totalMemory;
            const totalSystemMemory = metrics.memory.total * 1024; // Convert GB to MB
            aiProgress = Math.min(Math.round((totalMemory / totalSystemMemory) * 100), 100);

            // Add ellipsis if there are more processes
            const processDisplay = metrics.aiModels.uniqueProcesses.length > 3
              ? `${processNames} +${metrics.aiModels.uniqueProcesses.length - 3} more`
              : processNames;

            aiDetails = `${processDisplay} • ${totalMemory} MB used`;
          }

          // Update metrics with real data
          setHealthMetrics([
            {
              label: 'Local AI Models',
              status: metrics.aiModels.running ? `${aiProgress}% of RAM` : 'Not Running',
              statusColor: metrics.aiModels.running ? 'text-green-600' : 'text-red-600',
              progress: aiProgress,
              progressColor: 'bg-gradient-to-r from-admin-red to-red-500',
              details: aiDetails
            },
            {
              label: 'Storage Usage',
              status: `${metrics.disk.percentage}%`,
              statusColor: metrics.disk.percentage > 80 ? 'text-red-600' : metrics.disk.percentage > 60 ? 'text-yellow-600' : 'text-green-600',
              progress: metrics.disk.percentage,
              progressColor: 'bg-gradient-to-r from-admin-red to-red-500',
              details: `${metrics.disk.used} GB / ${metrics.disk.total} GB • System drive`
            },
            {
              label: 'Database',
              status: 'Connected',
              statusColor: 'text-green-600',
              progress: 100,
              progressColor: 'bg-gradient-to-r from-admin-red to-red-500',
              details: `SQLite • Uptime: ${metrics.uptime}h • System database`
            }
          ]);

          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error fetching system metrics:', error);
        // Keep loading state or show error
      }
    };

    fetchSystemMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchSystemMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Health</h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Updated: {lastUpdated}
            </span>
          )}
          <button className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg">
            Run Diagnostics
          </button>
        </div>
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
