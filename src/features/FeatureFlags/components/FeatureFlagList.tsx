'use client';

import React from 'react';
import { FeatureFlagItem } from './FeatureFlagItem';

/**
 * Props for FeatureFlagList component
 */
interface FeatureFlagListProps {
  /** Array of feature flags to display */
  flags: Array<{
    id: string;
    name: string;
    description: string;
    tier: string;
    tierClass: string;
    status: 'enabled' | 'disabled' | 'partial';
    rolloutPercentage: number;
    createdDate: string;
    targetUsers: string;
  }>;
  /** Current filter selection */
  statusFilter: string;
  /** Callback when status filter changes */
  onStatusFilterChange: (filter: string) => void;
  /** Callback when edit button is clicked */
  onEditFlag: (id: string) => void;
  /** Callback when rollback button is clicked */
  onRollbackFlag: (id: string) => void;
}

/**
 * Feature Flag List Component
 * Displays a list of feature flags with filtering and actions
 * Mobile-first responsive design with proper grid layout
 */
export const FeatureFlagList: React.FC<FeatureFlagListProps> = ({
  flags,
  statusFilter,
  onStatusFilterChange,
  onEditFlag,
  onRollbackFlag
}) => {
  const filteredFlags = flags.filter(flag => {
    if (statusFilter === 'All Statuses') return true;
    if (statusFilter === 'Enabled') return flag.status === 'enabled';
    if (statusFilter === 'Disabled') return flag.status === 'disabled';
    if (statusFilter === 'Partial Rollout') return flag.status === 'partial';
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Feature Flags
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[40px]"
          >
            <option>All Statuses</option>
            <option>Enabled</option>
            <option>Disabled</option>
            <option>Partial Rollout</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFlags.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No feature flags match the current filter.
          </div>
        ) : (
          filteredFlags.map((flag) => (
            <FeatureFlagItem
              key={flag.id}
              flag={flag}
              onEdit={onEditFlag}
              onRollback={onRollbackFlag}
            />
          ))
        )}
      </div>
    </div>
  );
};
