'use client';

import React from 'react';
import { SystemStatusData, SystemMetrics } from '../types';

/**
 * Props for the SystemStatus component
 */
interface SystemStatusProps {
  /** Optional className for styling */
  className?: string;
  /** Enhanced system status data */
  systemStatus?: SystemStatusData;
  /** System metrics data */
  systemMetrics?: SystemMetrics;
  /** Loading state */
  isLoading?: boolean;
  /** Last updated timestamp */
  lastUpdated?: Date;
  /** Refresh callback */
  onRefresh?: () => void;
  /** System health score */
  healthScore?: number;
  /** Status color class */
  statusColor?: string;
}

/**
 * SystemStatus Component
 * Displays the current status of the communications system with advanced monitoring
 * Shows precision tracking, system metrics, and real-time status indicators
 */
export const SystemStatus: React.FC<SystemStatusProps> = ({
  className = '',
  systemStatus,
  systemMetrics,
  isLoading = false,
  lastUpdated,
  onRefresh,
  healthScore,
  statusColor = 'status-active'
}) => {
  // Use enhanced data if available, otherwise fall back to basic props
  const contactFormActive = systemStatus?.contactFormActive ?? true;
  const autoResponderActive = systemStatus?.autoResponderActive ?? true;
  const lastSubmissionTime = systemStatus?.lastSubmissionTime ?? '15 min ago';
  const precisionLevel = systemStatus?.precisionLevel ?? 85.714;
  const systemLoad = systemStatus?.systemLoad ?? 99.743;

  // Format last updated time
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <section className={`mb-8 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Status Dashboard
              </h2>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  title="Refresh status"
                >
                  <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Precision monitoring: <span className="detail-tracker font-mono text-blue-600 dark:text-blue-400">{precisionLevel.toFixed(3)}%</span>
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-500">
                  Last updated: {formatLastUpdated(lastUpdated)}
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">Last Submission</div>
              <div className="font-mono text-gray-800 dark:text-gray-200 mt-1">{lastSubmissionTime}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">Auto-responder</div>
              <div className="font-mono text-gray-800 dark:text-gray-200 mt-1 flex items-center">
                <span className={`status-indicator ${autoResponderActive ? 'status-active' : 'status-critical'} mr-2`}></span>
                {autoResponderActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">System Load</div>
              <div className="font-mono text-gray-800 dark:text-gray-200 mt-1">{systemLoad.toFixed(3)}%</div>
            </div>
          </div>
        </div>

        {/* System Health Score */}
        {healthScore !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Health</span>
              <div className="flex items-center">
                <span className={`status-indicator ${statusColor} mr-2`}></span>
                <span className="text-sm font-mono text-gray-800 dark:text-gray-200">{healthScore}%</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  statusColor === 'status-active' ? 'bg-green-500' :
                  statusColor === 'status-warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
