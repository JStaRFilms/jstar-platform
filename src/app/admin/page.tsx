'use client';

import React from 'react';
import { AdminSidebar } from '@/features/AdminDashboard/components/AdminSidebar';
import { AdminHeader } from '@/features/AdminDashboard/components/AdminHeader';
import { SystemStatus } from '@/features/AdminDashboard/components/SystemStatus';
import { QuickStats } from '@/features/AdminDashboard/components/QuickStats';
import { QuickActions } from '@/features/AdminDashboard/components/QuickActions';
import { SystemHealth } from '@/features/AdminDashboard/components/SystemHealth';
import { RecentActivity } from '@/features/AdminDashboard/components/RecentActivity';
import { ModuleAccess } from '@/features/AdminDashboard/components/ModuleAccess';
import { SystemMetrics } from '@/features/AdminDashboard/components/SystemMetrics';
import { EmergencyPanel } from '@/features/AdminDashboard/components/EmergencyPanel';

/**
 * Main Admin Dashboard Page
 * Central hub for all administrative functions
 * Provides comprehensive overview of platform health and quick access to modules
 */
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="p-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:bg-faith-purple transition-all duration-300 shadow-lg"
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

      {/* Sidebar */}
      <AdminSidebar activeSection="dashboard" />

      {/* Main Content */}
      <div className="ml-0 md:ml-64 p-4 sm:p-6">
        {/* Header */}
        <AdminHeader />

        {/* System Status */}
        <SystemStatus />

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Primary Modules */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* System Health */}
            <SystemHealth />

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Right Column - Secondary Modules */}
          <div className="space-y-4 sm:space-y-6">
            {/* Module Access */}
            <ModuleAccess />

            {/* System Metrics */}
            <SystemMetrics />

            {/* Emergency Panel */}
            <EmergencyPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
