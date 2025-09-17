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

const AIModelHealth: React.FC = () => {
  const [aiData, setAIData] = useState<AIModelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const response = await fetch('/api/admin/system-metrics');
        const data = await response.json();

        if (data.status === 'success' && data.data) {
          setAIData(data.data.aiModels);
        }
      } catch (error) {
        console.error('Error fetching AI model data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();

    // Refresh every 45 seconds for AI monitoring
    const interval = setInterval(fetchAIData, 45000);
    return () => clearInterval(interval);
  }, []);

  const getModelStatus = (modelName: string) => {
    if (!aiData) return { status: 'Unknown', color: 'gray' };

    const isRunning = aiData.uniqueProcesses.some(process =>
      process.toLowerCase().includes(modelName.toLowerCase())
    );

    return {
      status: isRunning ? 'Running' : 'Not Detected',
      color: isRunning ? 'green' : 'gray'
    };
  };

  const getVRAMUsage = (modelName: string) => {
    if (!aiData || !aiData.running) return 'N/A';

    // Mock VRAM usage based on model type - in production this would come from actual GPU monitoring
    if (modelName.toLowerCase().includes('llama3-70b')) return '7.8/8 GB';
    if (modelName.toLowerCase().includes('mistral')) return '3.2/8 GB';
    return '2.1/8 GB';
  };

  const getResponseTime = (modelName: string) => {
    if (!aiData || !aiData.running) return 'N/A';

    // Mock response times - in production this would be measured
    if (modelName.toLowerCase().includes('llama3-70b')) return '1.2s';
    if (modelName.toLowerCase().includes('mistral')) return '0.8s';
    return '0.6s';
  };

  const getTokensPerSec = (modelName: string) => {
    if (!aiData || !aiData.running) return 'N/A';

    // Mock token rates - in production this would be measured
    if (modelName.toLowerCase().includes('llama3-70b')) return '28';
    if (modelName.toLowerCase().includes('mistral')) return '42';
    return '35';
  };

  const getHealthStatus = (modelName: string) => {
    const status = getModelStatus(modelName);
    if (status.status === 'Running') {
      // Simple health check based on memory usage
      const vramUsage = getVRAMUsage(modelName);
      if (vramUsage.includes('7.8/8')) return 'Warning';
      return 'Healthy';
    }
    return 'Offline';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Model Health</h2>
        <div className="flex space-x-2">
          <button className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Refresh
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
              <h3 className="font-medium text-gray-900 dark:text-white">Ollama (Llama3-70B)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Local LLM Server</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              getModelStatus('ollama').color === 'green'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
            }`}>
              {getModelStatus('ollama').status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">VRAM</div>
              <div className="font-medium text-gray-900 dark:text-white">{getVRAMUsage('llama3-70b')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
              <div className="font-medium text-gray-900 dark:text-white">{getResponseTime('llama3-70b')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tokens/sec</div>
              <div className="font-medium text-gray-900 dark:text-white">{getTokensPerSec('llama3-70b')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <div className={`font-medium ${
                getHealthStatus('llama3-70b') === 'Healthy' ? 'text-green-600' :
                getHealthStatus('llama3-70b') === 'Warning' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {getHealthStatus('llama3-70b')}
              </div>
            </div>
          </div>
          {getHealthStatus('llama3-70b') === 'Warning' && (
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
              <h3 className="font-medium text-gray-900 dark:text-white">LM Studio (Mistral)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Local LLM Client</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              getModelStatus('LM Studio').color === 'green'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
            }`}>
              {getModelStatus('LM Studio').status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">VRAM</div>
              <div className="font-medium text-gray-900 dark:text-white">{getVRAMUsage('mistral')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
              <div className="font-medium text-gray-900 dark:text-white">{getResponseTime('mistral')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tokens/sec</div>
              <div className="font-medium text-gray-900 dark:text-white">{getTokensPerSec('mistral')}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <div className={`font-medium ${
                getHealthStatus('mistral') === 'Healthy' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {getHealthStatus('mistral') || 'Offline'}
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
