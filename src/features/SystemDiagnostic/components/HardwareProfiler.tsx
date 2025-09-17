'use client';

import React from 'react';
import { Zap } from 'lucide-react';

const HardwareProfiler: React.FC = () => {
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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU: Intel Core i7-11800H</span>
            <span className="text-sm font-medium text-yellow-600">68°C</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>8 cores / 16 threads</span>
            <span>72% utilization</span>
          </div>
        </div>

        {/* GPU Section */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GPU: NVIDIA RTX 3070</span>
            <span className="text-sm font-medium text-yellow-600">78°C</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>8GB VRAM / 16GB system RAM</span>
            <span>85% utilization</span>
          </div>
        </div>

        {/* Storage Section */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage: Samsung 980 Pro 1TB</span>
            <span className="text-sm font-medium text-yellow-600">45.2 GB used</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>78% capacity</span>
            <span>45.2 GB / 60 GB (Vault)</span>
          </div>
        </div>

        {/* Network Section */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network: Wi-Fi 6 (AX201)</span>
            <span className="text-sm font-medium text-green-600">58 Mbps</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Latency: 24 ms</span>
            <span>58 Mbps download speed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareProfiler;
