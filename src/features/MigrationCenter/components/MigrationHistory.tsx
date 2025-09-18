import React from 'react';

/**
 * Migration History Component
 * Displays a list of past migration attempts with details and status
 */
export const MigrationHistory: React.FC = () => {
  const migrationHistory = [
    {
      id: 1,
      title: 'SQLite → Supabase',
      date: 'June 15, 2024',
      records: '12,458 records',
      status: 'successful' as const,
      duration: '2.4 min'
    },
    {
      id: 2,
      title: 'SQLite → Supabase (Test)',
      date: 'June 10, 2024',
      records: '12,458 records',
      status: 'partial' as const,
      duration: '1.8 min'
    },
    {
      id: 3,
      title: 'SQLite → PostgreSQL',
      date: 'June 5, 2024',
      records: '11,234 records',
      status: 'successful' as const,
      duration: '3.2 min'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'partial': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'successful': return 'Successful';
      case 'partial': return 'Partial';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  const handleViewDetails = (migrationId: number) => {
    // TODO: Implement view details functionality
    console.log('Viewing details for migration:', migrationId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Migration History</h2>
      <div className="space-y-4">
        {migrationHistory.map((migration) => (
          <div key={migration.id} className="migration-step p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{migration.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {migration.date} • {migration.records}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(migration.status)}`}>
                {getStatusText(migration.status)}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Duration: {migration.duration}
              </div>
              <button
                onClick={() => handleViewDetails(migration.id)}
                className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium hover:underline transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
