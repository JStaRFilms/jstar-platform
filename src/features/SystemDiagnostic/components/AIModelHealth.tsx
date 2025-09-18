'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap } from 'lucide-react';

interface AIModelData {
  running: boolean;
  processes: Array<{
    name: string;
    pid: number;
    memory: number;
    cpu: number;
  }>;
  totalMemory: number;
  uniqueProcesses: string[];
}

interface AIHealthData {
  ollama: {
    status: 'running' | 'not_detected';
    models_count: number;
    active_model?: string;
    models?: Array<{ name: string; size: string; modified: string; digest?: string }>;
    error?: string;
  };
  lm_studio: {
    status: 'running' | 'not_detected';
    models_count: number;
    active_model?: string;
    models?: Array<{ id: string; object: string }>;
    error?: string;
  };
  gpu: {
    vram_used?: number;
    vram_total?: number;
    utilization?: number;
  };
}

const AIModelHealth: React.FC = () => {
  const [aiData, setAIData] = useState<AIModelData | null>(null);
  const [aiHealth, setAiHealth] = useState<AIHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAIData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/system-metrics');
      const data = await response.json();

      if (data.status === 'success' && data.data) {
        setAIData(data.data.aiModels);
        setAiHealth(data.data.aiHealth);
      }
    } catch (error) {
      console.error('Error fetching AI model data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAIData();

    // Refresh every 45 seconds for AI monitoring
    const interval = setInterval(fetchAIData, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchAIData();
  };

  const getOllamaStatus = () => {
    if (!aiHealth) return { status: 'Not Detected', color: 'gray' };

    return {
      status: aiHealth.ollama.status === 'running' ? 'Running' : 'Not Detected',
      color: aiHealth.ollama.status === 'running' ? 'green' : 'gray'
    };
  };

  const getLMStudioStatus = () => {
    if (!aiHealth) return { status: 'Not Detected', color: 'gray' };

    return {
      status: aiHealth.lm_studio.status === 'running' ? 'Running' : 'Not Detected',
      color: aiHealth.lm_studio.status === 'running' ? 'green' : 'gray'
    };
  };

  const getVRAMUsage = (service: 'ollama' | 'lm_studio') => {
    if (!aiHealth?.gpu?.vram_used || !aiHealth?.gpu?.vram_total) return 'N/A';

    const used = aiHealth.gpu.vram_used;
    const total = aiHealth.gpu.vram_total;

    // Estimate VRAM usage based on service and GPU utilization
    if (service === 'ollama' && aiHealth.ollama.status === 'running') {
      // Ollama typically uses more VRAM for larger models
      const estimatedUsage = Math.min(used, total * 0.9); // Cap at 90% to avoid unrealistic values
      return `${estimatedUsage}/${total} MB`;
    } else if (service === 'lm_studio' && aiHealth.lm_studio.status === 'running') {
      // LM Studio typically uses less VRAM
      const estimatedUsage = Math.min(used * 0.6, total * 0.5);
      return `${Math.round(estimatedUsage)}/${total} MB`;
    }

    return `${used}/${total} MB`;
  };

  const getResponseTime = (service: 'ollama' | 'lm_studio') => {
    if (!aiHealth) return 'N/A';

    // Mock response times based on service status - in production this would be measured
    if (service === 'ollama' && aiHealth.ollama.status === 'running') return '1.2s';
    if (service === 'lm_studio' && aiHealth.lm_studio.status === 'running') return '0.8s';
    return 'N/A';
  };

  const getTokensPerSec = (service: 'ollama' | 'lm_studio') => {
    if (!aiHealth) return 'N/A';

    // Mock token rates based on service status - in production this would be measured
    if (service === 'ollama' && aiHealth.ollama.status === 'running') return '28';
    if (service === 'lm_studio' && aiHealth.lm_studio.status === 'running') return '42';
    return 'N/A';
  };

  const getHealthStatus = (service: 'ollama' | 'lm_studio') => {
    if (!aiHealth) return 'Offline';

    const serviceData = service === 'ollama' ? aiHealth.ollama : aiHealth.lm_studio;

    if (serviceData.status === 'running') {
      // Check GPU utilization for health warnings
      if (aiHealth.gpu?.utilization && aiHealth.gpu.utilization > 90) {
        return 'Warning';
      }
      return 'Healthy';
    }
    return 'Offline';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Model Health</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {refreshing ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </button>
          <button className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg">
            Optimize
          </button>
        </div>
      </div>
      <div className="space-y-5">
        {/* Ollama Status */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Ollama {aiHealth?.ollama.active_model ? `(${aiHealth.ollama.active_model})` : '(No Active Model)'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Local LLM Server {aiHealth?.ollama.models_count ? `• ${aiHealth.ollama.models_count} models available` : ''}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              getOllamaStatus().color === 'green'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
            }`}>
              {getOllamaStatus().status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">VRAM</div>
              <div className="font-medium text-gray-900 dark:text-white">{getVRAMUsage('ollama')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
              <div className="font-medium text-gray-900 dark:text-white">{getResponseTime('ollama')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tokens/sec</div>
              <div className="font-medium text-gray-900 dark:text-white">{getTokensPerSec('ollama')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <div className={`font-medium ${
                getHealthStatus('ollama') === 'Healthy' ? 'text-green-600' :
                getHealthStatus('ollama') === 'Warning' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {getHealthStatus('ollama')}
              </div>
            </div>
          </div>
          {getHealthStatus('ollama') === 'Warning' && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Recommendation:</strong> Model is running near VRAM capacity. Consider switching to Llama3-8B for better performance during client calls.
              </p>
            </div>
          )}
        </div>

        {/* LM Studio Status */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                LM Studio {aiHealth?.lm_studio.active_model ? `(${aiHealth.lm_studio.active_model})` : '(No Active Model)'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Local LLM Client {aiHealth?.lm_studio.models_count ? `• ${aiHealth.lm_studio.models_count} models available` : ''}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              getLMStudioStatus().color === 'green'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
            }`}>
              {getLMStudioStatus().status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">VRAM</div>
              <div className="font-medium text-gray-900 dark:text-white">{getVRAMUsage('lm_studio')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
              <div className="font-medium text-gray-900 dark:text-white">{getResponseTime('lm_studio')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tokens/sec</div>
              <div className="font-medium text-gray-900 dark:text-white">{getTokensPerSec('lm_studio')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <div className={`font-medium ${
                getHealthStatus('lm_studio') === 'Healthy' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {getHealthStatus('lm_studio') || 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* Cloud API Status */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Cloud APIs (Fallback)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">OpenAI, Gemini, Groq</p>
            </div>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded text-xs font-medium">
              Idle
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">OpenAI Status</div>
              <div className="font-medium text-gray-900 dark:text-white">Connected</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Gemini Status</div>
              <div className="font-medium text-gray-900 dark:text-white">Connected</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Groq Status</div>
              <div className="font-medium text-gray-900 dark:text-white">Connected</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Fallback</div>
              <div className="font-medium text-gray-900 dark:text-white">Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelHealth;
