'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface HardwareData {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    interfaces: number;
    speed: string;
  };
}

const HardwareProfiler: React.FC = () => {
  const [hardwareData, setHardwareData] = useState<HardwareData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHardwareData = async () => {
      try {
        const response = await fetch('/api/admin/system-metrics');
        const data = await response.json();

        if (data.status === 'success' && data.data) {
          setHardwareData(data.data);
        }
      } catch (error) {
        console.error('Error fetching hardware data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHardwareData();

    // Refresh every 30 seconds for hardware monitoring
    const interval = setInterval(fetchHardwareData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !hardwareData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hardware Profiler</h2>
          <button className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg">
            Run Benchmark
          </button>
        </div>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hardware Profiler</h2>
        <button className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg">
          Run Benchmark
        </button>
      </div>
      <div className="space-y-6">
        {/* CPU Section */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU: {hardwareData.cpu.model}</span>
            <span className="text-sm font-medium text-yellow-600">~{hardwareData.cpu.usage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: `${hardwareData.cpu.usage}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{hardwareData.cpu.cores} cores / {hardwareData.cpu.cores * 2} threads</span>
            <span>{hardwareData.cpu.usage}% utilization</span>
          </div>
        </div>

        {/* Memory Section */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory: System RAM</span>
            <span className="text-sm font-medium text-yellow-600">{hardwareData.memory.used} GB used</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: `${hardwareData.memory.percentage}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{hardwareData.memory.used} GB / {hardwareData.memory.total} GB</span>
            <span>{hardwareData.memory.percentage}% utilization</span>
          </div>
        </div>

        {/* Storage Section */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage: System Drive</span>
            <span className="text-sm font-medium text-yellow-600">{hardwareData.disk.used} GB used</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: `${hardwareData.disk.percentage}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{hardwareData.disk.percentage}% capacity</span>
            <span>{hardwareData.disk.used} GB / {hardwareData.disk.total} GB</span>
          </div>
        </div>

        {/* Network Section */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network: {hardwareData.network.interfaces} interfaces</span>
            <span className="text-sm font-medium text-green-600">{hardwareData.network.speed}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Active connections</span>
            <span>{hardwareData.network.speed} speed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareProfiler;
