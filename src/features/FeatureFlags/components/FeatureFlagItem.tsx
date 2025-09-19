'use client';

import React from 'react';

/**
 * Props for FeatureFlagItem component
 */
interface FeatureFlagItemProps {
  /** Feature flag data */
  flag: {
    id: string;
    name: string;
    description: string;
    tier: string;
    tierClass: string;
    status: 'enabled' | 'disabled' | 'partial';
    rolloutPercentage: number;
    createdDate: string;
    targetUsers: string;
  };
  /** Callback when edit button is clicked */
  onEdit: (id: string) => void;
  /** Callback when rollback button is clicked */
  onRollback: (id: string) => void;
}

/**
 * Feature Flag Item Component
 * Displays individual feature flag with status, rollout info, and actions
 * Mobile-first responsive design with touch-friendly interactions
 */
export const FeatureFlagItem: React.FC<FeatureFlagItemProps> = ({
  flag,
  onEdit,
  onRollback
}) => {
  const getStatusIndicator = (status: string) => {
    const indicators = {
      enabled: 'bg-green-500',
      disabled: 'bg-gray-400',
      partial: 'bg-yellow-500'
    };
    return indicators[status as keyof typeof indicators] || 'bg-gray-400';
  };

  return (
    <div className="feature-flag p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
            {flag.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {flag.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${flag.tierClass}`}>
              {flag.tier}
            </span>
            <span className={`flag-status ${getStatusIndicator(flag.status)}`}></span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Rollout: {flag.rolloutPercentage}% of {flag.targetUsers}
        </div>
        <div className="traffic-split">
          <div
            className="traffic-split-enabled"
            style={{ width: `${flag.rolloutPercentage}%` }}
          ></div>
          <div className="traffic-split-disabled"></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Created: {flag.createdDate}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(flag.id)}
            className="px-3 py-1 text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium min-h-[32px] flex items-center justify-center"
          >
            Edit
          </button>
          <button
            onClick={() => onRollback(flag.id)}
            className="px-3 py-1 text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium min-h-[32px] flex items-center justify-center"
          >
            Rollback
          </button>
        </div>
      </div>
    </div>
  );
};
