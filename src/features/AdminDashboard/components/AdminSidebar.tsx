import React from 'react';
import Link from 'next/link';

/**
 * Props for AdminSidebar component
 */
interface AdminSidebarProps {
  /** Currently active category */
  activeCategory?: string;
  /** Callback when category changes */
  onCategoryChange?: (category: string) => void;
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Callback to toggle sidebar collapse */
  onToggleCollapse?: () => void;
  /** Whether device is mobile */
  isMobile?: boolean;
}

/**
 * Admin Sidebar Navigation Component
 * Provides navigation for all admin modules and system management with 12 top-level categories
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeCategory = 'dashboard',
  onCategoryChange,
  collapsed = false,
  onToggleCollapse,
  isMobile = false
}) => {
  // Helper function to check if a category is active
  const isActive = (category: string) => {
    return activeCategory === category;
  };

  // Helper function to get the appropriate class for active state
  const getActiveClass = (category: string) => {
    if (!isActive(category)) {
      return 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700';
    }

    // Active category gets red highlighting as requested
    return 'active text-white bg-red-500 hover:bg-red-600 shadow-lg';
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    // Close sidebar on mobile after selection
    if (isMobile && onToggleCollapse) {
      onToggleCollapse();
    }
  };

  // Define the 12 top-level categories
  const categories = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14m-4 6h8' },
    { id: 'johngpt-config', label: 'JohnGPT Config', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'cms', label: 'CMS', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'user-management', label: 'User Management', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'cge-admin', label: 'CGE Admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14m-4 6h8' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5v-2a3 3 0 00-5.356-1.857M15 17H9m6 0v-2c0-.656-.126-1.283-.356-1.857M9 17H4v-2a3 3 0 015.356-1.857M9 17v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14m-4 6h8' },
    { id: 'payments', label: 'Payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'obsidian', label: 'Obsidian', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'automations', label: 'Automations', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'operations', label: 'Operations', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'emergency', label: 'Emergency', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' }
  ];

  return (
    <>
      {/* Sidebar - Only render if not collapsed */}
      {!collapsed && (
        <div className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-transform duration-300 ${isMobile ? 'transform' : ''}`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              J StaR Admin
            </Link>
          </div>

          <div className="p-4 overflow-y-auto h-full pb-20">
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 ${getActiveClass(category.id)}`}
                >
                  <svg className="h-5 w-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon} />
                  </svg>
                  <span className="text-sm font-medium truncate">{category.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-admin-red to-red-500 flex items-center justify-center">
                  <span className="text-white font-bold">JO</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">John Oluleke-Oke</p>
                  <div className="flex items-center">
                    <span className="status-indicator status-active"></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Admin Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
