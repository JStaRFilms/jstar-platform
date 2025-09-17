'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Module Access Component
 * Displays available admin modules and their access status
 */
export const ModuleAccess: React.FC = () => {
  const modules = [
    {
      name: 'Hero Slides',
      description: 'Manage homepage hero carousel',
      status: 'active',
      href: '/admin/cms/hero-slides',
      icon: '🎨',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Content Management',
      description: 'Blog posts, pages, and media',
      status: 'available',
      href: '/admin/cms',
      icon: '📝',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      name: 'User Management',
      description: 'User accounts and permissions',
      status: 'coming_soon',
      href: '#',
      icon: '👥',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20'
    },
    {
      name: 'Analytics',
      description: 'Traffic and performance insights',
      status: 'coming_soon',
      href: '#',
      icon: '📊',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            Active
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            Available
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300">
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Module Access
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available administrative modules and features
          </p>
        </div>
        <div className="text-2xl">🔓</div>
      </div>

      <div className="space-y-3">
        {modules.map((module, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all ${
              module.status === 'active'
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                : module.status === 'available'
                ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 hover:shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/10 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg ${module.bgColor} ${module.color}`}>
                  <span className="text-sm" role="img" aria-label={module.name}>
                    {module.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {module.name}
                    </h3>
                    {getStatusBadge(module.status)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {module.description}
                  </p>
                </div>
              </div>
              {module.status !== 'coming_soon' && (
                <Link
                  href={module.href}
                  className={`p-2 rounded-lg transition-colors ${
                    module.status === 'active'
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                  aria-label={`Access ${module.name} module`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Module Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-500">1</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-500">1</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-500">2</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};
