import React from 'react';

/**
 * Current Configuration Component
 * Displays the current database configuration details
 */
export const CurrentConfiguration: React.FC = () => {
  const configItems = [
    {
      label: 'Database Type',
      value: 'SQLite'
    },
    {
      label: 'Location',
      value: 'Local (C:\\jstar\\data\\platform.db)'
    },
    {
      label: 'ORM',
      value: 'Prisma'
    },
    {
      label: 'Schema Version',
      value: 'v2.1.4'
    },
    {
      label: 'Last Backup',
      value: 'June 15, 2024 • 2 hours ago'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Current Configuration</h2>
      <div className="space-y-4">
        {configItems.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
            <div className="font-medium text-gray-900 dark:text-white">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
