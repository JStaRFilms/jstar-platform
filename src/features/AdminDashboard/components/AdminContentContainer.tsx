'use client';

import React from 'react';

/**
 * Props for AdminContentContainer component
 */
interface AdminContentContainerProps {
  /** Current active category */
  category: string;
  /** Currently active sub-item */
  subItem: string;
  /** Child components to render */
  children: React.ReactNode;
}

/**
 * Admin Content Container Component
 * Provides the main content area wrapper with proper styling and layout
 * Handles different content layouts based on category and sub-item
 */
export const AdminContentContainer: React.FC<AdminContentContainerProps> = ({
  category,
  subItem,
  children
}) => {
  // Get container styling based on category
  const getContainerClasses = () => {
    const baseClasses = "flex-1 p-4 bg-gray-50 dark:bg-gray-900 min-h-screen";

    // Category-specific styling
    const categoryClasses: Record<string, string> = {
      'dashboard': "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
      'emergency': "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      'security': "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      'analytics': "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      'payments': "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
    };

    return `${baseClasses} ${categoryClasses[category] || ''}`;
  };

  // Get content wrapper styling
  const getContentWrapperClasses = () => {
    const baseClasses = "max-w-7xl mx-auto";

    // Sub-item specific layouts
    if (subItem === 'overview') {
      return `${baseClasses} space-y-6`;
    }

    return `${baseClasses} space-y-4`;
  };

  return (
    <main className={getContainerClasses()}>
      <div className={getContentWrapperClasses()}>
        {/* Category Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {category.replace('-', ' ')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {getCategoryDescription(category)}
              </p>
            </div>

            {/* Category-specific actions */}
            <div className="flex items-center space-x-3">
              {getCategoryActions(category, subItem)}
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex mt-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Admin
                </span>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400 capitalize">
                    {category.replace('-', ' ')}
                  </span>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-500">
                    {subItem === 'hero-slides' ? 'Hero Slides' : subItem.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </main>
  );
};

// Helper function to get category descriptions
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    'dashboard': 'System overview and quick access to all admin functions',
    'johngpt-config': 'AI assistant configuration and persona management',
    'cms': 'Content management system for website content',
    'user-management': 'User accounts, roles, and permissions management',
    'cge-admin': 'Creator Growth Engine administration and tools',
    'notifications': 'System and user notification management',
    'analytics': 'Platform analytics and performance metrics',
    'payments': 'Payment processing and billing management',
    'security': 'Security settings and threat monitoring',
    'obsidian': 'Knowledge base and documentation management',
    'automations': 'Workflow automation and process management',
    'operations': 'System operations and maintenance',
    'emergency': 'Emergency controls and system recovery'
  };

  return descriptions[category] || 'Administrative functions and settings';
}

// Helper function to get category-specific actions
function getCategoryActions(category: string, subItem: string): React.ReactNode {
  const actions: Record<string, React.ReactNode> = {
    'dashboard': (
      <>
        <button className="px-4 py-2 bg-jstar-blue text-white rounded-lg hover:bg-faith-purple transition-colors text-sm font-medium">
          Refresh Data
        </button>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
          Export Report
        </button>
      </>
    ),
    'emergency': (
      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium animate-pulse">
        Emergency Mode
      </button>
    ),
    'security': (
      <>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
          Security Scan
        </button>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
          Audit Logs
        </button>
      </>
    )
  };

  return actions[category] || null;
}
