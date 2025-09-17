'use client';

import React, { useState, useEffect } from 'react';

/**
 * System Resources Component
 * Monitors system resource usage and availability
 */
export const SystemResources: React.FC = () => {
  const [resources, setResources] = useState({
    memory: { used: 0, total: 16, unit: 'GB' },
    storage: { used: 0, total: 256, unit: 'GB' },
    cpu: { usage: 0, cores: 8 },
    network: { upload: 0, download: 0, unit: 'Mbps' }
  });

  // Simulate resource monitoring
  useEffect(() => {
    const updateResources = () => {
      setResources({
        memory: {
          used: Math.floor(Math.random() * 8) + 4, // 4-12 GB
          total: 16,
          unit: 'GB'
        },
        storage: {
          used: Math.floor(Math.random() * 100) + 50, // 50-150 GB
          total: 256,
          unit: 'GB'
        },
        cpu: {
          usage: Math.floor(Math.random() * 40) + 20, // 20-60%
          cores: 8
        },
        network: {
          upload: Math.floor(Math.random() * 50) + 10, // 10-60 Mbps
          download: Math.floor(Math.random() * 100) + 50, // 50-150 Mbps
          unit: 'Mbps'
        }
      });
    };

    updateResources();
    const interval = setInterval(updateResources, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getResourceColor = (usage: number, total: number) => {
    const percentage = (usage / total) * 100;
    return percentage < 50 ? 'text-green-500' : percentage < 80 ? 'text-yellow-500' : 'text-red-500';
  };

  const getProgressColor = (usage: number, total: number) => {
    const percentage = (usage / total) * 100;
    return percentage < 50 ? 'bg-green-500' : percentage < 80 ? 'bg-yellow-500' : 'bg-red-500';
  };

  const resourceItems = [
    {
      label: 'Memory Usage',
      used: resources.memory.used,
      total: resources.memory.total,
      unit: resources.memory.unit,
      description: 'RAM utilization'
    },
    {
      label: 'Storage Usage',
      used: resources.storage.used,
      total: resources.storage.total,
      unit: resources.storage.unit,
      description: 'Disk space used'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            System Resources
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hardware resource utilization and availability
          </p>
        </div>
        <div className="text-2xl">🖥️</div>
      </div>

      {/* Resource Usage */}
      <div className="space-y-4 mb-6">
        {resourceItems.map((resource, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {resource.label}
              </span>
              <span className={`text-sm font-bold ${getResourceColor(resource.used, resource.total)}`}>
                {resource.used} / {resource.total} {resource.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(resource.used, resource.total)}`}
                style={{ width: `${(resource.used / resource.total) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {resource.description}
            </div>
          </div>
        ))}
      </div>

      {/* CPU and Network */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-blue-500">{resources.cpu.usage}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">CPU Usage</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {resources.cpu.cores} cores
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-lg font-bold text-green-500">{resources.network.download}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Network</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            ↓ {resources.network.download} {resources.network.unit}
          </div>
        </div>
      </div>

      {/* Resource Summary */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resource Summary</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Available Memory:</span>
            <span className="text-gray-900 dark:text-white">
              {resources.memory.total - resources.memory.used} {resources.memory.unit}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Free Storage:</span>
            <span className="text-gray-900 dark:text-white">
              {resources.storage.total - resources.storage.used} {resources.storage.unit}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">System Load:</span>
            <span className={`font-medium ${resources.cpu.usage < 50 ? 'text-green-500' : resources.cpu.usage < 80 ? 'text-yellow-500' : 'text-red-500'}`}>
              {resources.cpu.usage < 50 ? 'Light' : resources.cpu.usage < 80 ? 'Moderate' : 'Heavy'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
            Optimize Resources
          </button>
          <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Resource Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
