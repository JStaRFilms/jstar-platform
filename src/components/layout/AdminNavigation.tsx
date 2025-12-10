'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SharedNavigation, NavigationProvider, useNavigation } from './SharedNavigation';
import {
  ShieldCheckIcon,
  FilmIcon,
  GiftIcon,
  EnvelopeIcon,
  PlayCircleIcon,
  PenFancyIcon,
  CommentsIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from '@/components/icons';

/**
 * Admin Navigation Integration
 * Enhanced admin navigation using the unified SharedNavigation system
 */

// Admin-specific navigation items
const adminNavigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: PlayCircleIcon,
    children: [
      { id: 'overview', label: 'Overview', href: '/admin' },
      { id: 'system-diagnostic', label: 'System Diagnostic', href: '/admin/system-diagnostic' },
      { id: 'migration-center', label: 'Migration Center', href: '/admin/migration-center' },
      { id: 'feature-flags', label: 'Feature Flags', href: '/admin/feature-flags' }
    ]
  },
  {
    id: 'cms',
    label: 'CMS',
    href: '/admin/cms',
    icon: FilmIcon,
    children: [
      { id: 'overview', label: 'Overview', href: '/admin/cms' },
      { id: 'hero-slides', label: 'Hero Slides', href: '/admin/cms/hero-slides' },
      { id: 'content-editor', label: 'Content Editor', href: '/admin/cms/content-editor' },
      { id: 'media-library', label: 'Media Library', href: '/admin/cms/media-library' },
      { id: 'templates', label: 'Templates', href: '/admin/cms/templates' },
      { id: 'publishing', label: 'Publishing', href: '/admin/cms/publishing' },
      { id: 'seo-settings', label: 'SEO Settings', href: '/admin/cms/seo-settings' }
    ]
  },
  {
    id: 'user',
    label: 'User Management',
    href: '/admin/user',
    icon: ShieldCheckIcon,
    children: [
      { id: 'overview', label: 'Overview', href: '/admin/user' },
      { id: 'user-list', label: 'User List', href: '/admin/user/user-list' },
      { id: 'lead-magnets', label: 'Lead Magnets', href: '/admin/users/lead-magnets' },
      { id: 'roles-permissions', label: 'Roles & Permissions', href: '/admin/user/roles-permissions' },
      { id: 'user-activity', label: 'User Activity', href: '/admin/user/user-activity' }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: CheckCircleIcon,
    children: [
      { id: 'overview', label: 'Overview', href: '/admin/analytics' },
      { id: 'traffic-analytics', label: 'Traffic Analytics', href: '/admin/analytics/traffic' },
      { id: 'user-analytics', label: 'User Analytics', href: '/admin/analytics/users' },
      { id: 'performance-metrics', label: 'Performance Metrics', href: '/admin/analytics/performance' },
      { id: 'reports', label: 'Reports', href: '/admin/analytics/reports' }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/admin/notifications',
    icon: EnvelopeIcon,
    children: [
      { id: 'overview', label: 'Overview', href: '/admin/notifications' },
      { id: 'system-notifications', label: 'System Notifications', href: '/admin/notifications/system' },
      { id: 'user-notifications', label: 'User Notifications', href: '/admin/notifications/user' },
      { id: 'communications-inbox', label: 'Communications Inbox', href: '/admin/communications/inbox' },
      { id: 'notification-settings', label: 'Notification Settings', href: '/admin/notifications/settings' }
    ]
  },
  {
    id: 'payments',
    label: 'Payments',
    href: '/admin/payments',
    icon: GiftIcon,
    children: [
      { id: 'overview', label: 'Overview', href: '/admin/payments' },
      { id: 'transactions', label: 'Transactions', href: '/admin/payments/transactions' },
      { id: 'billing', label: 'Billing', href: '/admin/payments/billing' },
      { id: 'payment-methods', label: 'Payment Methods', href: '/admin/payments/methods' },
      { id: 'refunds', label: 'Refunds', href: '/admin/payments/refunds' }
    ]
  }
];

// Admin Navigation Component
export const AdminNavigation: React.FC = () => {
  const pathname = usePathname();
  const { setMobileMenuOpen } = useNavigation();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeSubItem, setActiveSubItem] = useState<string>('');

  // Determine active category and sub-item from pathname
  useEffect(() => {
    if (!pathname) return;

    const path = pathname.replace('/admin', '');
    const segments = path.split('/').filter(Boolean);

    if (segments.length > 0) {
      const category = segments[0];
      const subItem = segments[1] || 'overview';

      setActiveCategory(category);
      setActiveSubItem(subItem);
    } else {
      setActiveCategory('dashboard');
      setActiveSubItem('overview');
    }
  }, [pathname]);

  // Handle navigation item click
  const _handleNavigationClick = (itemId: string) => {
    setActiveCategory(itemId);
    setActiveSubItem('overview');
    setMobileMenuOpen(false); // Close mobile menu on navigation
  };

  // Get current category's children
  const currentCategory = adminNavigationItems.find(item => item.id === activeCategory);
  const subNavigationItems = currentCategory?.children || [];

  return (
    <div className="admin-navigation">
      {/* Main Admin Navigation */}
      <SharedNavigation
        variant="admin"
        customItems={adminNavigationItems.map(item => ({
          ...item,
          badge: item.id === activeCategory ? 'active' : undefined
        }))}
        showBreadcrumbs={true}
        className="admin-nav-header"
      />

      {/* Admin Sub-Navigation */}
      {subNavigationItems.length > 0 && (
        <div className="admin-sub-navigation bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 py-3 overflow-x-auto" aria-label="Admin sub-navigation">
              {subNavigationItems.map((subItem) => (
                <Link
                  key={subItem.id}
                  href={subItem.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeSubItem === subItem.id
                      ? 'bg-jstar-blue text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-jstar-blue'
                    }`}
                  aria-current={activeSubItem === subItem.id ? 'page' : undefined}
                  onClick={() => setActiveSubItem(subItem.id)}
                >
                  {subItem.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Admin Context Indicator */}
      <div className="admin-context bg-gradient-to-r from-jstar-blue/10 to-faith-purple/10 border-b border-jstar-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-jstar-blue font-semibold">Admin Panel</span>
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {activeCategory.replace('-', ' ')}
              </span>
              {activeSubItem !== 'overview' && (
                <>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {activeSubItem.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                className="flex items-center px-3 py-1 text-xs bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-jstar-blue transition-colors"
                aria-label="Quick settings"
              >
                <PenFancyIcon className="h-3 w-3 mr-1" />
                Settings
              </button>

              <button
                className="flex items-center px-3 py-1 text-xs bg-jstar-blue text-white rounded-lg hover:bg-faith-purple transition-colors"
                aria-label="Quick help"
              >
                <CommentsIcon className="h-3 w-3 mr-1" />
                Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Navigation Provider (wraps admin pages)
export const AdminNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NavigationProvider>
      <div className="admin-layout">
        <AdminNavigation />
        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </NavigationProvider>
  );
};

export default AdminNavigation;
