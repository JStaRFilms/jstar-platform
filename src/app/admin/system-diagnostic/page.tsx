'use client';

import React from 'react';
import { AdminSidebar } from '@/features/AdminDashboard/components/AdminSidebar';
import { SystemDiagnosticHeader } from '@/features/AdminDashboard/components/SystemDiagnosticHeader';
import { DatabaseHealth } from '@/features/AdminDashboard/components/DatabaseHealth';
import { APIHealth } from '@/features/AdminDashboard/components/APIHealth';
import { PerformanceMetrics } from '@/features/AdminDashboard/components/PerformanceMetrics';
import { SystemResources } from '@/features/AdminDashboard/components/SystemResources';
import { DiagnosticTools } from '@/features/AdminDashboard/components/DiagnosticTools';

/**
 * System Diagnostics Page
 * Comprehensive system health monitoring and diagnostic tools
 */
export default function SystemDiagnosticPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar activeSection="system-diagnostic" />

      {/* Main Content */}
      <div className="ml-0 md:ml-64 p-4 sm:p-6">
        {/* Header */}
        <SystemDiagnosticHeader />

        {/* Diagnostic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Database Health */}
          <DatabaseHealth />

          {/* API Health */}
          <APIHealth />

          {/* Performance Metrics */}
          <PerformanceMetrics />

          {/* System Resources */}
          <SystemResources />
        </div>

        {/* Diagnostic Tools */}
        <div className="mt-6">
          <DiagnosticTools />
        </div>
      </div>
    </div>
  );
}
