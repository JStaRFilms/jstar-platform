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
      {/* Sidebar */}
      <AdminSidebar activeSection="dashboard" />

      {/* Main Content */}
      <div className="ml-64 p-6">
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
