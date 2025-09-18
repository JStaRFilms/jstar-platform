'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Play, CheckCircle, AlertCircle } from 'lucide-react';

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

interface BenchmarkData {
  cpu: {
    singleCoreScore: number;
    multiCoreScore: number;
    utilization: number;
  };
  gpu: {
    available: boolean;
    tokensPerSec?: number;
    vramUsage?: string;
    utilization?: number;
  };
  memory: {
    totalGB: number;
    usedGB: number;
    bandwidthGBs: number;
  };
  storage: {
    readMBs: number;
    writeMBs: number;
  };
  network: {
    latencyMs: number;
    downloadMbps: number;
    uploadMbps: number;
  };
  timestamp: string;
  duration: string;
}

const HardwareProfiler: React.FC = () => {
  const [hardwareData, setHardwareData] = useState<HardwareData | null>(null);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkComplete, setBenchmarkComplete] = useState(false);

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

  const runBenchmark = async () => {
    try {
      setBenchmarking(true);
      setBenchmarkComplete(false);

      const response = await fetch('/api/admin/system-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        setBenchmarkData(data.data);
        setBenchmarkComplete(true);
      } else {
        console.error('Benchmark failed:', data.message);
      }
    } catch (error) {
      console.error('Error running benchmark:', error);
    } finally {
      setBenchmarking(false);
    }
  };

  useEffect(() => {
    fetchHardwareData();

    // Refresh every 15 seconds for hardware monitoring
    const interval = setInterval(fetchHardwareData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !hardwareData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hardware Profiler</h2>
        <button
          onClick={runBenchmark}
          disabled={benchmarking}
          className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {benchmarking ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border border-admin-red border-t-transparent"></div>
              Running...
            </>
          ) : benchmarkComplete ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Benchmark Complete
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              Run Benchmark
            </>
          )}
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
        <button
          onClick={runBenchmark}
          disabled={benchmarking}
          className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {benchmarking ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border border-admin-red border-t-transparent"></div>
              Running...
            </>
          ) : benchmarkComplete ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Benchmark Complete
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              Run Benchmark
            </>
          )}
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

        {/* Benchmark Results */}
        {benchmarkData && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Benchmark Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CPU Benchmark */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900 dark:text-white">CPU Performance</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Single Core:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.cpu.singleCoreScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Multi Core:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.cpu.multiCoreScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Utilization:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.cpu.utilization}%</span>
                  </div>
                </div>
              </div>

              {/* GPU Benchmark */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-gray-900 dark:text-white">GPU Performance</span>
                </div>
                <div className="space-y-1 text-sm">
                  {benchmarkData.gpu.available ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tokens/sec:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.gpu.tokensPerSec}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">VRAM:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.gpu.vramUsage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Utilization:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.gpu.utilization}%</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No GPU detected</div>
                  )}
                </div>
              </div>

              {/* Memory Benchmark */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Memory Performance</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total RAM:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.memory.totalGB} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Used:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.memory.usedGB} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bandwidth:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.memory.bandwidthGBs} GB/s</span>
                  </div>
                </div>
              </div>

              {/* Storage Benchmark */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Storage Performance</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Read Speed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.storage.readMBs} MB/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Write Speed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.storage.writeMBs} MB/s</span>
                  </div>
                </div>
              </div>

              {/* Network Benchmark */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-cyan-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Network Performance</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Latency:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.network.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Download:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.network.downloadMbps} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Upload:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{benchmarkData.network.uploadMbps} Mbps</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              {benchmarkData.duration} • Completed at {new Date(benchmarkData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HardwareProfiler;
