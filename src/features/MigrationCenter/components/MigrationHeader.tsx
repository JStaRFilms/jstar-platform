import React from 'react';

/**
 * Migration Center Header Component
 * Displays the main title, description, and primary action buttons
 */
export const MigrationHeader: React.FC = () => {
  const handleStartMigration = () => {
    // TODO: Implement migration start logic
    console.log('Starting migration...');
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Searching:', query);
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
            Migration Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Seamless transition between local and cloud database environments
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartMigration}
            className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Start Migration
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search migration history..."
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent transition-colors"
            />
            <svg className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};
