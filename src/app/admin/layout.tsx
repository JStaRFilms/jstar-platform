'use client';

import React, { useState, useEffect } from 'react';
import type { Metadata } from "next";
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/features/AdminDashboard/components/AdminSidebar';
import { AdminSubNavigation } from '@/features/AdminDashboard/components/AdminSubNavigation';
import { AdminContentContainer } from '@/features/AdminDashboard/components/AdminContentContainer';

/**
 * Admin Layout Component
 * Provides the main layout structure for all admin pages with new navigation pattern
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Navigation state management
  const [activeCategory, setActiveCategory] = useState('dashboard');
  const [activeSubItem, setActiveSubItem] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine active state from pathname
  useEffect(() => {
    if (!pathname) return;

    // Remove leading /admin from pathname
    const path = pathname.replace('/admin', '');

    // Map of routes to categories and sub-items
    const routeMap: Record<string, { category: string; subItem: string }> = {
      '': { category: 'dashboard', subItem: 'overview' },
      '/': { category: 'dashboard', subItem: 'overview' },
      '/system-diagnostic': { category: 'dashboard', subItem: 'system-diagnostic' },
      '/migration-center': { category: 'dashboard', subItem: 'migration-center' },
      '/feature-flags': { category: 'dashboard', subItem: 'feature-flags' },
      '/cms': { category: 'cms', subItem: 'overview' },
      '/cms/hero-slides': { category: 'cms', subItem: 'hero-slides' },
      '/johngpt-config': { category: 'johngpt-config', subItem: 'overview' },
      '/user-management': { category: 'user-management', subItem: 'overview' },
      '/cge-admin': { category: 'cge-admin', subItem: 'overview' },
      '/notifications': { category: 'notifications', subItem: 'overview' },
      '/analytics': { category: 'analytics', subItem: 'overview' },
      '/payments': { category: 'payments', subItem: 'overview' },
      '/security': { category: 'security', subItem: 'overview' },
      '/obsidian': { category: 'obsidian', subItem: 'overview' },
      '/automations': { category: 'automations', subItem: 'overview' },
      '/operations': { category: 'operations', subItem: 'overview' },
      '/emergency': { category: 'emergency', subItem: 'overview' }
    };

    const routeInfo = routeMap[path];
    if (routeInfo) {
      setActiveCategory(routeInfo.category);
      setActiveSubItem(routeInfo.subItem);
    }
  }, [pathname]);

  // Handle sidebar category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset to first sub-item when changing categories
    setActiveSubItem('overview');
  };

  // Handle sub-navigation change
  const handleSubItemChange = (subItem: string) => {
    setActiveSubItem(subItem);
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="p-2 rounded-full bg-jstar-blue text-white hover:bg-faith-purple transition-all duration-300 shadow-lg"
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

      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-jstar-blue text-white hover:bg-faith-purple transition-all duration-300 shadow-lg"
            aria-label="Toggle sidebar menu"
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
                d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
              />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar - Always rendered, controlled by CSS for mobile overlay */}
      <AdminSidebar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area - Always full width, sidebar overlays on mobile */}
      <div className="transition-all duration-300 lg:ml-64">
        {/* Sub-Navigation */}
        <AdminSubNavigation
          category={activeCategory}
          activeSubItem={activeSubItem}
          onSubItemChange={handleSubItemChange}
        />

        {/* Content Container */}
        <AdminContentContainer
          category={activeCategory}
          subItem={activeSubItem}
        >
          {children}
        </AdminContentContainer>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}
