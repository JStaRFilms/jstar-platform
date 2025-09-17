'use client';

import React from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { SystemStatus } from './components/SystemStatus';
import { QuickStats } from './components/QuickStats';
import { QuickActions } from './components/QuickActions';
import { SystemHealth } from './components/SystemHealth';
import { RecentActivity } from './components/RecentActivity';
import { ModuleAccess } from './components/ModuleAccess';
import { SystemMetrics } from './components/SystemMetrics';
import { EmergencyPanel } from './components/EmergencyPanel';

/**
 * Main Admin Dashboard component
 * Provides comprehensive administrative interface for J StaR Films platform
 */
const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <AdminHeader />

        {/* System Status */}
        <SystemStatus />

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* System Health */}
            <SystemHealth />

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Right Column - Secondary Modules */}
          <div className="space-y-6">
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
};

export default AdminDashboard;
