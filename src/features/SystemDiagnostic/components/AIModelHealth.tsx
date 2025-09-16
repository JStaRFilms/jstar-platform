'use client';

import React from 'react';
import { RefreshCw, Zap } from 'lucide-react';

const AIModelHealth: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Model Health</h2>
        <div className="flex space-x-2">
          <button className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Refresh
          </button>
          <button className="text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
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
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium">
              Running
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">VRAM</div>
              <div className="font-medium text-gray-900 dark:text-white">7.8/8 GB</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
              <div className="font-medium text-gray-900 dark:text-white">1.2s</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tokens/sec</div>
              <div className="font-medium text-gray-900 dark:text-white">28</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <div className="font-medium text-green-600">Healthy</div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Recommendation:</strong> Model is running near VRAM capacity. Consider switching to Llama3-8B for better performance during client calls.
            </p>
          </div>
        </div>

        {/* LM Studio Status */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">LM Studio (Mistral)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Local LLM Client</p>
            </div>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium">
              Running
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">VRAM</div>
              <div className="font-medium text-gray-900 dark:text-white">3.2/8 GB</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
              <div className="font-medium text-gray-900 dark:text-white">0.8s</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tokens/sec</div>
              <div className="font-medium text-gray-900 dark:text-white">42</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <div className="font-medium text-green-600">Optimal</div>
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
