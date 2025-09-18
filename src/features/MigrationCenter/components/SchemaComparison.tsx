import React, { useState } from 'react';

/**
 * Schema Comparison Component
 * Displays schema differences between source and target databases
 */
export const SchemaComparison: React.FC = () => {
  const [selectedComparison, setSelectedComparison] = useState('SQLite (Local) → Supabase');

  const schemaChanges = [
    {
      type: 'added' as const,
      table: 'users',
      changes: [
        { field: 'id INTEGER PRIMARY KEY AUTOINCREMENT', target: 'id UUID PRIMARY KEY DEFAULT gen_random_uuid()' },
        { field: 'tier VARCHAR(20) NOT NULL' },
        { field: 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
      ]
    },
    {
      type: 'modified' as const,
      table: 'products',
      changes: [
        { field: 'price DECIMAL(10,2) NOT NULL', target: 'price NUMERIC(10,2) NOT NULL' },
        { field: 'file_path TEXT NOT NULL', target: 'download_url TEXT NOT NULL' }
      ]
    },
    {
      type: 'added' as const,
      table: 'conversation_history',
      changes: [
        { field: 'id UUID PRIMARY KEY DEFAULT gen_random_uuid()' },
        { field: 'user_id UUID NOT NULL' },
        { field: 'content TEXT NOT NULL' },
        { field: 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
      ]
    }
  ];

  const getDiffClass = (type: string) => {
    switch (type) {
      case 'added': return 'diff-added';
      case 'removed': return 'diff-removed';
      case 'modified': return 'diff-modified';
      default: return '';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'added': return 'border-green-500';
      case 'removed': return 'border-red-500';
      case 'modified': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'added': return '+';
      case 'removed': return '-';
      case 'modified': return '~';
      default: return '?';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'added': return 'Added';
      case 'removed': return 'Removed';
      case 'modified': return 'Modified';
      default: return 'Unknown';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'removed': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'modified': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schema Comparison</h2>
        <div className="flex space-x-2">
          <select
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option>SQLite (Local) → Supabase</option>
            <option>SQLite (Local) → PostgreSQL</option>
            <option>SQLite (Local) → MySQL</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {schemaChanges.map((change, index) => (
          <div key={index} className={`schema-diff ${getDiffClass(change.type)} p-3 rounded-lg hover:bg-opacity-80 transition-colors`}>
            <div className="flex justify-between">
              <div className="font-mono text-gray-900 dark:text-white">
                {getTypeIcon(change.type)} TABLE "{change.table}"
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getTypeColor(change.type)}`}>
                {getTypeLabel(change.type)}
              </span>
            </div>
            <div className={`mt-2 pl-4 border-l-2 ${getBorderColor(change.type)}`}>
              {change.changes.map((fieldChange, fieldIndex) => (
                <div key={fieldIndex}>
                  {fieldChange.target ? (
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-700 dark:text-gray-300">{fieldChange.field}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{fieldChange.target}</span>
                    </div>
                  ) : (
                    <div className="font-mono text-gray-700 dark:text-gray-300">{fieldChange.field}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
