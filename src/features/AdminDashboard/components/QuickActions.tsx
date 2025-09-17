'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Quick Actions Component
 * Provides quick access to frequently used admin functions
 */
export const QuickActions: React.FC = () => {
  const quickActions = [
    {
      title: 'New Product',
      href: '/admin/cms/products/new',
      icon: (
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      )
    },
    {
      title: 'Edit Brand Voice',
      href: '/admin/johngpt/system-prompt',
      icon: (
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      )
    },
    {
      title: 'Tune Virality OS',
      href: '/admin/cge/virality-os/config',
      icon: (
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      title: 'Manage Users',
      href: '/admin/users',
      icon: (
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <a href="#" className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">View all</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="quick-action flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-admin-red to-red-500 flex items-center justify-center mb-3">
              {action.icon}
            </div>
            <span className="text-sm text-center text-gray-700 dark:text-gray-300">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
