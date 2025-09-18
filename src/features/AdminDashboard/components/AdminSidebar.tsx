import React from 'react';
import Link from 'next/link';

/**
 * Props for AdminSidebar component
 */
interface AdminSidebarProps {
  /** Currently active section(s) */
  activeSection?: string | string[];
}

/**
 * Admin Sidebar Navigation Component
 * Provides navigation for all admin modules and system management
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection = 'dashboard'
}) => {
  // Helper function to check if a section is active
  const isActive = (section: string) => {
    if (Array.isArray(activeSection)) {
      return activeSection.includes(section);
    }
    return activeSection === section;
  };

  // Helper function to get the appropriate class for active state
  const getActiveClass = (section: string) => {
    if (!isActive(section)) {
      return 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white';
    }

    // If multiple sections are active, style differently
    if (Array.isArray(activeSection) && activeSection.length > 1) {
      // Dashboard gets a different style when it's a parent of an active sub-page
      if (section === 'dashboard') {
        return 'active-parent text-gray-700 dark:text-gray-200 bg-gradient-to-r from-jstar-blue/10 to-faith-purple/10';
      }
      // Current page gets the full active style
      return 'active text-gray-700 dark:text-gray-200';
    }

    // Single active section
    return 'active text-gray-700 dark:text-gray-200';
  };

  return (
    <>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="p-2 rounded-full bg-jstar-blue text-white hover:bg-faith-purple transition-all duration-300"
          aria-label="Toggle dark/light theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
      </div>

      <div className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          J StaR Admin
        </Link>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Platform Modules
          </h3>
          <nav className="space-y-1">
            <Link
              href="/admin"
              className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('dashboard')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14m-4 6h8"></path>
              </svg>
              Dashboard
            </Link>
            <Link
              href="/admin/cms"
              className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('cms')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              CMS
            </Link>
            <Link
              href="/admin/johngpt"
              className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('johngpt')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              JohnGPT
            </Link>
            <Link
              href="/admin/cge"
              className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('cge')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14m-4 6h8"></path>
              </svg>
              CGE Tools
            </Link>
            <Link
              href="/admin/users"
              className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('users')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              User Management
            </Link>
            <Link
              href="/admin/analytics"
              className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('analytics')}`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14m-4 6h8"></path>
              </svg>
              Analytics
            </Link>
          </nav>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            System Management
          </h3>
          <nav className="space-y-1">
            <Link href="/admin/system-diagnostic" className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('system-diagnostic')}`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              System Diagnostics
            </Link>
            <Link href="/admin/migration-center" className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('migration-center')}`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              Migration Center
            </Link>
            <Link href="/admin/security" className={`sidebar-item flex items-center p-2 rounded-lg ${getActiveClass('security')}`}>
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Security
            </Link>
          </nav>
        </div>

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
    </>
  );
};
