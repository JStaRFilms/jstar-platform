'use client';

import React from 'react';

/**
 * Props for QuickStats component
 */
interface QuickStatsProps {
  /** Total number of feature flags */
  totalFlags: number;
  /** Number of flags in development */
  inDevelopment: number;
  /** Number of fully deployed flags */
  fullyDeployed: number;
  /** Number of flags needing rollback */
  needsRollback: number;
}

/**
 * Quick Stats Component
 * Displays key metrics in a responsive grid layout
 * Mobile-first design with proper spacing
 */
export const QuickStats: React.FC<QuickStatsProps> = ({
  totalFlags,
  inDevelopment,
  fullyDeployed,
  needsRollback
}) => {
  const stats = [
    {
      label: 'Total Feature Flags',
      value: totalFlags,
      color: 'text-admin-red'
    },
    {
      label: 'In Development',
      value: inDevelopment,
      color: 'text-purple-500'
    },
    {
      label: 'Fully Deployed',
      value: fullyDeployed,
      color: 'text-green-500'
    },
    {
      label: 'Rollback Needed',
      value: needsRollback,
      color: 'text-red-500'
    }
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className={`text-2xl md:text-3xl font-bold mb-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
