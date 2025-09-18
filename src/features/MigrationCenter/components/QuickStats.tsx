import React from 'react';

/**
 * Quick Stats Component
 * Displays key database metrics and migration statistics
 */
export const QuickStats: React.FC = () => {
  const stats = [
    {
      label: 'Current Database',
      value: 'SQLite',
      color: 'text-admin-red'
    },
    {
      label: 'Records',
      value: '12,458',
      color: 'text-purple-500'
    },
    {
      label: 'Schema Match',
      value: '99.8%',
      color: 'text-green-500'
    },
    {
      label: 'Pending Migrations',
      value: '0',
      color: 'text-red-500'
    }
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className={`text-2xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
