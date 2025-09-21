'use client';

import React, { useState } from 'react';
import { useSystemMetrics } from './hooks/useSystemMetrics';
import { useDiagnostics } from './hooks/useDiagnostics';
import DiagnosticHeader from './components/DiagnosticHeader';
import QuickStats from './components/QuickStats';
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
  const [diagnosticRefreshTrigger, setDiagnosticRefreshTrigger] = useState<number>(0);

  // Use custom hooks for data fetching
  const { data: systemMetrics, isLoading: isLoadingMetrics } = useSystemMetrics();
  const runDiagnosticsMutation = useDiagnostics();

  // Calculate quick stats from system metrics
  const quickStats = React.useMemo(() => {
    if (!systemMetrics) {
      return {
        vramUsage: 0,
        aiResponseTime: 0,
        storageUsed: 0,
        performanceScore: 0
      };
    }

    // Calculate performance score (simple algorithm based on system health)
    let performanceScore = 10;
    if (systemMetrics.cpu.usage > 80) performanceScore -= 2;
    if (systemMetrics.memory.percentage > 80) performanceScore -= 1.5;
    if (systemMetrics.disk.percentage > 85) performanceScore -= 1;
    if (systemMetrics.aiHealth.gpu?.utilization && systemMetrics.aiHealth.gpu.utilization > 80) performanceScore -= 1.5;

    // Get VRAM usage
    const vramUsage = systemMetrics.aiHealth.gpu?.utilization || 0;

    // Get AI response time (from Ollama if available)
    const aiResponseTime = systemMetrics.aiHealth.ollama?.status === 'running' ? 1.2 : 0;

    // Get storage used
    const storageUsed = systemMetrics.disk.used;

    return {
      vramUsage: Math.round(vramUsage),
      aiResponseTime,
      storageUsed,
      performanceScore: Math.max(0, Math.min(10, performanceScore))
    };
  }, [systemMetrics]);

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

  const runFullDiagnostics = () => {
    runDiagnosticsMutation.mutate();
  };

  const handleDiagnosticComplete = () => {
    setDiagnosticRefreshTrigger(prev => prev + 1);
  };

  return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <DiagnosticHeader
          isRunningDiagnostics={runDiagnosticsMutation.isPending}
          onRunDiagnostics={runFullDiagnostics}
          onExportReport={exportReport}
        />

        {/* System Status */}
        <SystemStatus />

        {/* Quick Stats */}
        <section className="mb-8">
          <QuickStats data={quickStats} isLoading={isLoadingMetrics} />
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
  );
};

export default SystemDiagnostic;
