import React from 'react';
import Link from 'next/link';

/**
 * Quick Actions Component
 * Provides quick access to common admin functions
 */
export const QuickActions: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <Link href="#" className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">View all</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/cms/products/new" className="quick-action flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center mb-3">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <span className="text-sm text-center text-gray-700 dark:text-gray-300">New Product</span>
        </Link>
        <Link href="/admin/johngpt/system-prompt" className="quick-action flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center mb-3">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <span className="text-sm text-center text-gray-700 dark:text-gray-300">Edit Brand Voice</span>
        </Link>
        <Link href="/admin/cge/virality-os/config" className="quick-action flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center mb-3">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span className="text-sm text-center text-gray-700 dark:text-gray-300">Tune Virality OS</span>
        </Link>
        <Link href="/admin/users" className="quick-action flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center mb-3">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <span className="text-sm text-center text-gray-700 dark:text-gray-300">Manage Users</span>
        </Link>
      </div>
    </div>
  );
};
