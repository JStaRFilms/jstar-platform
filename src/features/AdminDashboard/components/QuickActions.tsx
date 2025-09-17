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
      title: 'Manage Hero Slides',
      description: 'Create, edit, and organize homepage slides',
      icon: '🎨',
      href: '/admin/cms/hero-slides',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'View Website',
      description: 'Preview your public website',
      icon: '🌐',
      href: '/',
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      external: true
    },
    {
      title: 'System Diagnostics',
      description: 'Check system health and performance',
      icon: '🔧',
      href: '/admin/system-diagnostic',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'API Documentation',
      description: 'View available API endpoints',
      icon: '📚',
      href: '/api',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      external: true
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Frequently used administrative functions
          </p>
        </div>
        <div className="text-2xl">⚡</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className={`relative ${action.bgColor} ${action.borderColor} border rounded-lg p-4 hover:shadow-md transition-all duration-300 group`}
          >
            {action.external ? (
              <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white shadow-sm`}>
                    <span className="text-lg" role="img" aria-label={action.title}>
                      {action.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </div>
                </div>
              </a>
            ) : (
              <Link href={action.href} className="block">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white shadow-sm`}>
                    <span className="text-lg" role="img" aria-label={action.title}>
                      {action.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Additional Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="p-3 text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
            <div className="text-lg mb-1">📊</div>
            <div className="text-xs font-medium">Analytics</div>
          </button>
          <button className="p-3 text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
            <div className="text-lg mb-1">👥</div>
            <div className="text-xs font-medium">Users</div>
          </button>
          <button className="p-3 text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
            <div className="text-lg mb-1">⚙️</div>
            <div className="text-xs font-medium">Settings</div>
          </button>
          <button className="p-3 text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
            <div className="text-lg mb-1">📧</div>
            <div className="text-xs font-medium">Messages</div>
          </button>
        </div>
      </div>
    </div>
  );
};
