'use client';

import React from 'react';
import { QuickStats } from '@/features/AdminDashboard/components/QuickStats';
import { QuickActions } from '@/features/AdminDashboard/components/QuickActions';
import { RecentActivity } from '@/features/AdminDashboard/components/RecentActivity';
import { ModuleAccess } from '@/features/AdminDashboard/components/ModuleAccess';

/**
 * CMS (Content Management System) Main Page
 * Central hub for all content management operations
 * Provides overview of content, publishing tools, and analytics
 * Now integrated with the new navigation pattern
 */
export default function CMSPage() {
  return (
    <>
      {/* CMS Overview */}
      <div className="admin-card-spaced">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">
          Content Management System
        </h2>
        <p className="text-muted-foreground">
          Manage your website content, pages, blog posts, and media assets from this central hub.
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main CMS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Content Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity (as Recent Content) */}
          <RecentActivity />

          {/* Content Management Tools */}
          <div className="admin-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content Management
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Pages</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage website pages and navigation</p>
                <button className="px-3 py-1 bg-jstar-blue text-white text-sm rounded hover:bg-faith-purple transition-colors">
                  Manage Pages
                </button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Blog Posts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Create and edit blog content</p>
                <button className="px-3 py-1 bg-jstar-blue text-white text-sm rounded hover:bg-faith-purple transition-colors">
                  Manage Posts
                </button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Media Library</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Upload and organize media files</p>
                <button className="px-3 py-1 bg-jstar-blue text-white text-sm rounded hover:bg-faith-purple transition-colors">
                  Browse Media
                </button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Templates</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage page templates and layouts</p>
                <button className="px-3 py-1 bg-jstar-blue text-white text-sm rounded hover:bg-faith-purple transition-colors">
                  Edit Templates
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Analytics & Tools */}
        <div className="space-y-6">
          {/* Module Access (as Content Analytics) */}
          <ModuleAccess />

          {/* Content Tools */}
          <div className="admin-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content Tools
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-jstar-blue text-white rounded-lg hover:bg-faith-purple transition-colors text-sm font-medium">
                Bulk Import Content
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                Export Content
              </button>
              <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                SEO Optimization
              </button>
              <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                Content Analytics
              </button>
            </div>
          </div>

          {/* Publishing Status */}
          <div className="admin-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publishing Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Published Pages</span>
                <span className="text-sm font-medium text-green-600">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Draft Pages</span>
                <span className="text-sm font-medium text-yellow-600">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Scheduled Posts</span>
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
