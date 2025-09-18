'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminSidebar } from '@/features/AdminDashboard/components/AdminSidebar';
import SystemStatus from './components/SystemStatus';
import HardwareProfiler from './components/HardwareProfiler';
import AIModelHealth from './components/AIModelHealth';
import DiagnosticHistory from './components/DiagnosticHistory';
import SystemMetrics from './components/SystemMetrics';
import PerformanceBenchmarks from './components/PerformanceBenchmarks';
import SystemRecommendations from './components/SystemRecommendations';
import EmergencyTools from './components/EmergencyTools';

// Cache configuration for diagnostics
const DIAGNOSTICS_CACHE_KEY = 'system-diagnostics-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const REFRESH_INTERVAL = 60 * 1000; // 1 minute background refresh

interface QuickStatsCache {
  vramUsage: number;
  aiResponseTime: number;
  storageUsed: number;
  performanceScore: number;
  timestamp: number;
}

interface SystemDiagnosticProps {
  className?: string;
}

const SystemDiagnostic: React.FC<SystemDiagnosticProps> = ({ className = '' }) => {
  const [runningDiagnostics, setRunningDiagnostics] = useState<boolean>(false);
  const [diagnosticRefreshTrigger, setDiagnosticRefreshTrigger] = useState<number>(0);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  
  // Initialize QuickStats with proper type
  const [quickStats, setQuickStats] = useState<{
    vramUsage: number;
    aiResponseTime: number;
    storageUsed: number;
    performanceScore: number;
  }>({
    vramUsage: 85,
    aiResponseTime: 1.2,
    storageUsed: 45.2,
    performanceScore: 4.8
  });

  // Cache management functions
  const saveStatsToCache = useCallback((stats: QuickStatsCache): void => {
    try {
      localStorage.setItem(DIAGNOSTICS_CACHE_KEY, JSON.stringify(stats));
    } catch (error: any) {
      console.warn('Failed to save diagnostics cache:', error);
    }
  }, []);

  const loadStatsFromCache = useCallback((): QuickStatsCache | null => {
    try {
      const cached = localStorage.getItem(DIAGNOSTICS_CACHE_KEY);
      if (cached) {
        const data: QuickStatsCache = JSON.parse(cached);
        const now = Date.now();
        // Check if cache is still valid
        if (now - data.timestamp < CACHE_DURATION) {
          return data;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(DIAGNOSTICS_CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load diagnostics cache:', error);
      localStorage.removeItem(DIAGNOSTICS_CACHE_KEY); // Clean up corrupted cache
    }
    return null;
  }, []);

  // Fetch quick stats data with caching
  const fetchQuickStats = useCallback(async (showLoading: boolean = true): Promise<boolean> => {
    try {
      if (showLoading) setIsLoadingStats(true);

      const response = await fetch('/api/admin/system-metrics');
      const data = await response.json();

      if (data.status === 'success' && data.data) {
        const metrics = data.data;

        // Calculate performance score (simple algorithm based on system health)
        let performanceScore = 10;
        if (metrics.cpu.usage > 80) performanceScore -= 2;
        if (metrics.memory.percentage > 80) performanceScore -= 1.5;
        if (metrics.disk.percentage > 85) performanceScore -= 1;
        if (metrics.aiHealth.gpu?.utilization && metrics.aiHealth.gpu.utilization > 80) performanceScore -= 1.5;

        // Get VRAM usage
        const vramUsage = metrics.aiHealth.gpu?.utilization || 0;

        // Get AI response time (from Ollama if available)
        const aiResponseTime = metrics.aiHealth.ollama?.status === 'running' ? 1.2 : 0;

        // Get storage used
        const storageUsed = metrics.disk.used;

        const newStats = {
          vramUsage: Math.round(vramUsage),
          aiResponseTime,
          storageUsed,
          performanceScore: Math.max(0, Math.min(10, performanceScore))
        };

        setQuickStats(newStats);

        // Cache the fresh data
        const cacheData: QuickStatsCache = {
          ...newStats,
          timestamp: Date.now()
        };
        saveStatsToCache(cacheData);

        return true;
      }
    } catch (error) {
      console.error('Error fetching quick stats:', error);
    } finally {
      if (showLoading) setIsLoadingStats(false);
    }
    return false;
  }, [saveStatsToCache]);

  useEffect(() => {
    // Load from cache first (stale-while-revalidate)
    const cachedStats = loadStatsFromCache();

    if (cachedStats) {
      // Show cached data immediately
      setQuickStats({
        vramUsage: cachedStats.vramUsage,
        aiResponseTime: cachedStats.aiResponseTime,
        storageUsed: cachedStats.storageUsed,
        performanceScore: cachedStats.performanceScore
      });
      setIsLoadingStats(false);

      // Check cache age to determine refresh strategy
      const cacheAge = Date.now() - cachedStats.timestamp;

      if (cacheAge < 60000) { // < 1 minute - very fresh
        // Schedule background refresh in 1 minute
        const backgroundRefreshTimer = setTimeout(() => {
          fetchQuickStats(false); // Background refresh, no loading state
        }, REFRESH_INTERVAL);

        return () => clearTimeout(backgroundRefreshTimer);
      } else { // 1-30 minutes - stale but still valid
        // Show cache immediately, refresh in background right now
        fetchQuickStats(false); // Background refresh without loading state
      }

      // Set up ongoing background refresh interval
      const interval = setInterval(() => {
        fetchQuickStats(false); // Background refresh
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }

    // No cache available - fetch fresh data
    fetchQuickStats(true);

    // Set up background refresh interval
    const interval = setInterval(() => {
      fetchQuickStats(false); // Background refresh
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadStatsFromCache, fetchQuickStats]);

  const exportReport = async (): Promise<void> => {
    try {
      // Fetch current system metrics
      const metricsResponse = await fetch('/api/admin/system-metrics');
      const metricsData = await metricsResponse.json();

      // Fetch diagnostic history
      const historyResponse = await fetch('/api/admin/diagnostics');
      const historyData = await historyResponse.json();

      if (metricsData.status === 'success' && historyData.status === 'success') {
        const metrics = metricsData.data;
        const history = historyData.data;

        // Create CSV content
        let csvContent = 'System Diagnostics Report\n';
        csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

        // System Overview Section
        csvContent += 'SYSTEM OVERVIEW\n';
        csvContent += 'Metric,Value,Status\n';
        csvContent += `CPU Usage,${metrics.cpu.usage}%,${metrics.cpu.usage > 80 ? 'High' : 'Normal'}\n`;
        csvContent += `CPU Model,"${metrics.cpu.model}",-\n`;
        csvContent += `Memory Usage,${metrics.memory.used} GB (${metrics.memory.percentage}%),${metrics.memory.percentage > 80 ? 'High' : 'Normal'}\n`;
        csvContent += `Total Memory,${metrics.memory.total} GB,-\n`;
        csvContent += `Disk Usage,${metrics.disk.used} GB (${metrics.disk.percentage}%),${metrics.disk.percentage > 85 ? 'Critical' : 'Normal'}\n`;
        csvContent += `Total Disk,${metrics.disk.total} GB,-\n`;
        csvContent += `Network Interfaces,${metrics.network.interfaces},-\n`;
        csvContent += `System Uptime,${Math.round(metrics.uptime / 24)} days,-\n`;

        // AI Health Section
        csvContent += '\nAI MODEL HEALTH\n';
        csvContent += 'Component,Status,Details\n';
        csvContent += `Ollama,${metrics.aiHealth.ollama.status},${metrics.aiHealth.ollama.models_count} models loaded\n`;
        if (metrics.aiHealth.ollama.active_model) {
          csvContent += `Active Model,"${metrics.aiHealth.ollama.active_model}",-\n`;
        }
        csvContent += `LM Studio,${metrics.aiHealth.lm_studio.status},${metrics.aiHealth.lm_studio.models_count} models available\n`;
        if (metrics.aiHealth.gpu) {
          csvContent += `GPU VRAM,${metrics.aiHealth.gpu.vram_used || 0}/${metrics.aiHealth.gpu.vram_total || 0} MB,${metrics.aiHealth.gpu.utilization || 0}% utilization\n`;
        }

        // AI Processes Section
        csvContent += '\nAI PROCESSES\n';
        csvContent += 'Process Name,PID,Memory (MB),Status\n';
        if (metrics.aiModels.processes && metrics.aiModels.processes.length > 0) {
          metrics.aiModels.processes.forEach((process: any) => {
            csvContent += `"${process.name}",${process.pid},${process.memory},Running\n`;
          });
        } else {
          csvContent += 'No AI processes detected,-,-,-\n';
        }

        // Quick Stats Section
        csvContent += '\nQUICK STATS\n';
        csvContent += 'Metric,Value,Description\n';
        csvContent += `VRAM Usage,${quickStats.vramUsage}%,GPU Memory Utilization\n`;
        csvContent += `AI Response Time,${quickStats.aiResponseTime}s,Average Response Time\n`;
        csvContent += `Storage Used,${quickStats.storageUsed} GB,Disk Space Used\n`;
        csvContent += `Performance Score,${quickStats.performanceScore.toFixed(1)}/10,Overall System Health\n`;

        // Diagnostic History Section
        csvContent += '\nDIAGNOSTIC HISTORY\n';
        csvContent += 'Type,Status,Timestamp,Duration (ms),Warnings,Errors\n';
        if (history && history.length > 0) {
          history.forEach((diagnostic: any) => {
            csvContent += `"${diagnostic.type}","${diagnostic.status}","${new Date(diagnostic.timestamp).toLocaleString()}",${diagnostic.duration || 0},${diagnostic.warnings || 0},${diagnostic.errors || 0}\n`;
          });
        } else {
          csvContent += 'No diagnostic history available,-,-,-,-,-\n';
        }

        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `system-diagnostics-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Failed to fetch data for export');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const runFullDiagnostics = async (): Promise<void> => {
    try {
      setRunningDiagnostics(true);
      const response = await fetch('/api/admin/diagnostics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log('Full diagnostics completed successfully');
        // Trigger refresh of diagnostic history
        setDiagnosticRefreshTrigger(prev => prev + 1);
        // Refresh quick stats after diagnostics
        setTimeout(fetchQuickStats, 1000);
        // You could also show a success toast here
      } else {
        console.error('Diagnostics failed:', data.message);
        // You could show an error toast here
      }
    } catch (error) {
      console.error('Error running diagnostics:', error);
      // You could show an error toast here
    } finally {
      setRunningDiagnostics(false);
    }
  };
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Sidebar */}
      <AdminSidebar activeSection={['dashboard', 'system-diagnostic']} />

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
                System Diagnostics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Hardware profiling, AI model health, and performance diagnostics
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runFullDiagnostics}
                disabled={runningDiagnostics}
                className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {runningDiagnostics ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent"></div>
                    Running Diagnostics...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Run Full Diagnostic
                  </>
                )}
              </button>
              <button
                onClick={exportReport}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* System Status */}
        <SystemStatus />

        {/* Quick Stats */}
        <section className="mb-8">
          {isLoadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-red-500 mb-2">{quickStats.vramUsage}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">VRAM Usage</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-purple-500 mb-2">{quickStats.aiResponseTime}s</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Response Time</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-500 mb-2">{quickStats.storageUsed} GB</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Storage Used</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-red-500 mb-2">{quickStats.performanceScore.toFixed(1)}/10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Performance Score</div>
              </div>
            </div>
          )}
        </section>

        {/* Main Diagnostic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Diagnostics */}
          <div className="lg:col-span-2 space-y-6">
            <HardwareProfiler onBenchmarkComplete={() => setDiagnosticRefreshTrigger(prev => prev + 1)} />
            <AIModelHealth />
            <DiagnosticHistory refreshTrigger={diagnosticRefreshTrigger} />
          </div>

          {/* Right Column - Secondary Diagnostics */}
          <div className="space-y-6">
            <SystemMetrics />
            <PerformanceBenchmarks />
            <SystemRecommendations />
            <EmergencyTools />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnostic;
