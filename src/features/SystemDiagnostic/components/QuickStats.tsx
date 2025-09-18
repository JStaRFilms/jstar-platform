import React from 'react';

interface QuickStatsData {
  vramUsage: number;
  aiResponseTime: number;
  storageUsed: number;
  performanceScore: number;
}

interface QuickStatsProps {
  /** The quick stats data to display */
  data: QuickStatsData;
  /** Whether the data is currently loading */
  isLoading: boolean;
}

/**
 * QuickStats Component
 * Displays key system metrics in a responsive grid layout
 */
const QuickStats: React.FC<QuickStatsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-red-500 mb-2">{data.vramUsage}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">VRAM Usage</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-purple-500 mb-2">{data.aiResponseTime}s</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">AI Response Time</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-green-500 mb-2">{data.storageUsed} GB</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Storage Used</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold text-red-500 mb-2">{data.performanceScore.toFixed(1)}/10</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Performance Score</div>
      </div>
    </div>
  );
};

export default QuickStats;
