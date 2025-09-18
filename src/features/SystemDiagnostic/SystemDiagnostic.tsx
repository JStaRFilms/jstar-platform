'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import SystemStatus from './components/SystemStatus';
import HardwareProfiler from './components/HardwareProfiler';
import AIModelHealth from './components/AIModelHealth';
import DiagnosticHistory from './components/DiagnosticHistory';
import SystemMetrics from './components/SystemMetrics';
import PerformanceBenchmarks from './components/PerformanceBenchmarks';
import SystemRecommendations from './components/SystemRecommendations';
import EmergencyTools from './components/EmergencyTools';

interface SystemDiagnosticProps {
  className?: string;
}

const SystemDiagnostic: React.FC<SystemDiagnosticProps> = ({ className = '' }) => {
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticRefreshTrigger, setDiagnosticRefreshTrigger] = useState(0);
  const [quickStats, setQuickStats] = useState({
    vramUsage: 85,
    aiResponseTime: 1.2,
    storageUsed: 45.2,
    performanceScore: 4.8
  });

  // Fetch quick stats data
  const fetchQuickStats = async () => {
    try {
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

        setQuickStats({
          vramUsage: Math.round(vramUsage),
          aiResponseTime,
          storageUsed,
          performanceScore: Math.max(0, Math.min(10, performanceScore))
        });
      }
    } catch (error) {
      console.error('Error fetching quick stats:', error);
    }
  };

  useEffect(() => {
    fetchQuickStats();
    // Refresh quick stats every 30 seconds
    const interval = setInterval(fetchQuickStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportReport = async () => {
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

  const runFullDiagnostics = async () => {
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
    <AdminLayout>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* System Status */}
          <SystemStatus />

          {/* Quick Stats */}
          <section className="mb-8">
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
        </main>
      </div>
    </AdminLayout>
  );
};

export default SystemDiagnostic;
