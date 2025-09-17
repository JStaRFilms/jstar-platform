import React from 'react';
import Link from 'next/link';

/**
 * Module Access Component
 * Provides quick access to different admin modules
 */
export const ModuleAccess: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Module Access</h2>
      <div className="space-y-4">
        <Link href="/admin/cms" className="module-card block p-4 border-l-2 border-transparent hover:border-red-500 rounded-r-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Content Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage website content</p>
            </div>
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/admin/johngpt" className="module-card block p-4 border-l-2 border-transparent hover:border-red-500 rounded-r-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">JohnGPT Configuration</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage AI assistant settings</p>
            </div>
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/admin/cge" className="module-card block p-4 border-l-2 border-transparent hover:border-red-500 rounded-r-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Creator Growth Engine</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Access all CGE tools</p>
            </div>
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/admin/users" className="module-card block p-4 border-l-2 border-transparent hover:border-red-500 rounded-r-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">User Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage user accounts & tiers</p>
            </div>
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/admin/analytics" className="module-card block p-4 border-l-2 border-transparent hover:border-red-500 rounded-r-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View platform metrics</p>
            </div>
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
