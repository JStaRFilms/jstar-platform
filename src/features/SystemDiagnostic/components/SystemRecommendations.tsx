'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, HardDrive, Wifi, Cpu, Zap } from 'lucide-react';

interface SystemMetrics {
  cpu: { usage: number; cores: number; model: string };
  memory: { used: number; total: number; percentage: number };
  disk: { used: number; total: number; percentage: number };
  aiModels: { running: boolean; processes: any[]; totalMemory: number; uniqueProcesses: string[] };
  aiHealth: {
    ollama: { status: string; models_count: number; active_model?: string };
    lm_studio: { status: string; models_count: number; active_model?: string };
    gpu: { vram_used?: number; vram_total?: number; utilization?: number };
  };
  network: { interfaces: number; speed: string };
  uptime: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  icon: React.ReactNode;
  actionable: boolean;
}

const SystemRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const analyzeSystem = (metrics: SystemMetrics): Recommendation[] => {
    const recs: Recommendation[] = [];

    // VRAM Analysis
    if (metrics.aiHealth.gpu?.utilization && metrics.aiHealth.gpu.utilization > 85) {
      recs.push({
        id: 'vram-high',
        title: 'High VRAM Usage Detected',
        description: `GPU utilization at ${metrics.aiHealth.gpu.utilization}%. Consider switching to a lighter model or optimizing current workload.`,
        priority: 'high',
        action: 'Switch to Llama3-8B',
        icon: <Zap className="h-4 w-4" />,
        actionable: true
      });
    } else if (metrics.aiHealth.gpu?.utilization && metrics.aiHealth.gpu.utilization > 70) {
      recs.push({
        id: 'vram-medium',
        title: 'Monitor VRAM Usage',
        description: `GPU utilization at ${metrics.aiHealth.gpu.utilization}%. Keep an eye on performance during peak usage.`,
        priority: 'medium',
        action: 'Monitor Performance',
        icon: <Zap className="h-4 w-4" />,
        actionable: false
      });
    }

    // Storage Analysis
    if (metrics.disk.percentage > 85) {
      recs.push({
        id: 'storage-critical',
        title: 'Critical Storage Usage',
        description: `Storage at ${metrics.disk.percentage}% capacity (${metrics.disk.used}GB/${metrics.disk.total}GB). Immediate cleanup recommended.`,
        priority: 'high',
        action: 'Run Storage Cleanup',
        icon: <HardDrive className="h-4 w-4" />,
        actionable: true
      });
    } else if (metrics.disk.percentage > 75) {
      recs.push({
        id: 'storage-high',
        title: 'High Storage Usage',
        description: `Storage at ${metrics.disk.percentage}% capacity. Consider archiving old data or expanding storage.`,
        priority: 'medium',
        action: 'Archive Old Data',
        icon: <HardDrive className="h-4 w-4" />,
        actionable: true
      });
    }

    // CPU Analysis
    if (metrics.cpu.usage > 90) {
      recs.push({
        id: 'cpu-overload',
        title: 'CPU Overload Detected',
        description: `CPU usage at ${metrics.cpu.usage}%. System may be running multiple intensive tasks simultaneously.`,
        priority: 'high',
        action: 'Close Unnecessary Apps',
        icon: <Cpu className="h-4 w-4" />,
        actionable: true
      });
    } else if (metrics.cpu.usage > 70) {
      recs.push({
        id: 'cpu-high',
        title: 'High CPU Usage',
        description: `CPU usage at ${metrics.cpu.usage}%. Monitor for performance impact on AI operations.`,
        priority: 'medium',
        action: 'Monitor CPU Load',
        icon: <Cpu className="h-4 w-4" />,
        actionable: false
      });
    }

    // Memory Analysis
    if (metrics.memory.percentage > 90) {
      recs.push({
        id: 'memory-critical',
        title: 'Critical Memory Usage',
        description: `Memory usage at ${metrics.memory.percentage}%. System may become unstable.`,
        priority: 'high',
        action: 'Close Memory-Intensive Apps',
        icon: <AlertTriangle className="h-4 w-4" />,
        actionable: true
      });
    }

    // AI Model Specific Recommendations
    if (metrics.aiHealth.ollama.status === 'running' && metrics.aiHealth.ollama.active_model) {
      const modelName = metrics.aiHealth.ollama.active_model.toLowerCase();
      if (modelName.includes('70b') && metrics.aiHealth.gpu?.utilization && metrics.aiHealth.gpu.utilization > 80) {
        recs.push({
          id: 'model-optimization',
          title: 'Large Model Optimization',
          description: 'Running Llama3-70B with high GPU utilization. Consider using a smaller model for better performance.',
          priority: 'medium',
          action: 'Switch to Smaller Model',
          icon: <Zap className="h-4 w-4" />,
          actionable: true
        });
      }
    }

    // Network Analysis (basic)
    if (metrics.network.speed === '1Gbps' && metrics.aiModels.running) {
      recs.push({
        id: 'network-ai',
        title: 'Network for AI Operations',
        description: 'AI models are running locally. Network speed is adequate for current operations.',
        priority: 'low',
        action: 'Monitor Network',
        icon: <Wifi className="h-4 w-4" />,
        actionable: false
      });
    }

    // If no issues found, add a positive recommendation
    if (recs.length === 0) {
      recs.push({
        id: 'system-healthy',
        title: 'System Running Optimally',
        description: 'All system metrics are within normal ranges. AI operations are performing well.',
        priority: 'low',
        action: 'Continue Monitoring',
        icon: <AlertTriangle className="h-4 w-4" />,
        actionable: false
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/system-metrics');
        const data = await response.json();

        if (data.status === 'success' && data.data) {
          const recs = analyzeSystem(data.data);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Error fetching system metrics for recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Refresh recommendations every 60 seconds (less frequent than metrics)
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-500',
          bg: 'bg-red-50 dark:bg-red-900/20',
          badge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
          text: 'text-red-800 dark:text-red-200'
        };
      case 'medium':
        return {
          border: 'border-yellow-500',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
          text: 'text-yellow-800 dark:text-yellow-200'
        };
      case 'low':
        return {
          border: 'border-green-500',
          bg: 'bg-green-50 dark:bg-green-900/20',
          badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
          text: 'text-green-800 dark:text-green-200'
        };
      default:
        return {
          border: 'border-gray-500',
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          badge: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300',
          text: 'text-gray-800 dark:text-gray-200'
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">System Recommendations</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">System Recommendations</h2>
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const styles = getPriorityStyles(rec.priority);
          return (
            <div
              key={rec.id}
              className={`recommendation-card p-4 border-l-4 rounded-r-lg ${styles.border} ${styles.bg}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${styles.text}`}>
                    {rec.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{rec.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${styles.badge}`}>
                  {rec.priority}
                </span>
              </div>
              {rec.actionable && (
                <div className="mt-3">
                  <button className={`text-sm font-medium hover:opacity-80 transition-opacity ${styles.text}`}>
                    {rec.action}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemRecommendations;
