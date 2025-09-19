'use client';

import React from 'react';

/**
 * Props for SystemStatus component
 */
interface SystemStatusProps {
  /** Number of active flags */
  activeFlags: number;
  /** Number of flags in testing */
  testingFlags: number;
  /** Whether system is synced */
  isSynced: boolean;
}

/**
 * System Status Component
 * Displays current system status with status indicators
 * Mobile-first responsive design
 */
export const SystemStatus: React.FC<SystemStatusProps> = ({
  activeFlags,
  testingFlags,
  isSynced
}) => {
  return (
    <section>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Feature Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Control feature visibility across user tiers and traffic percentages
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center min-h-[24px]">
              <span className="status-indicator status-active mr-2"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {activeFlags} Active Flags
              </span>
            </div>
            <div className="flex items-center min-h-[24px]">
              <span className="status-indicator status-warning mr-2"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {testingFlags} In Testing
              </span>
            </div>
            <div className="flex items-center min-h-[24px]">
              <span className={`status-indicator ${isSynced ? 'status-active' : 'status-critical'} mr-2`}></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isSynced ? 'All Synced' : 'Sync Issues'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
