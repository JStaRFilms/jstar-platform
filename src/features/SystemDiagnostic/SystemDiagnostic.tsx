'use client';

import React from 'react';
import AdminLayout from './components/AdminLayout';
import SystemStatus from './components/SystemStatus';
import HardwareProfiler from './components/HardwareProfiler';
import AIModelHealth from './components/AIModelHealth';
import DiagnosticHistory from './components/DiagnosticHistory';
import SystemMetrics from './components/SystemMetrics';
import PerformanceBenchmarks from './components/PerformanceBenchmarks';
import SystemRecommendations from './components/SystemRecommendations';
import EmergencyTools from './components/EmergencyTools';

interface SystemDiagnosticProps {
  className?: string;
}

const SystemDiagnostic: React.FC<SystemDiagnosticProps> = ({ className = '' }) => {
  return (
    <AdminLayout>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
                        System Diagnostics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Hardware profiling, AI model health, and performance diagnostics
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced">
                        <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Run Full Diagnostic
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium">
                        Export Report
                    </button>
                </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* System Status */}
          <SystemStatus />

          {/* Quick Stats */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-red-500 mb-2">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">VRAM Usage</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-purple-500 mb-2">1.2s</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Response Time</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-500 mb-2">45.2 GB</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Storage Used</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-red-500 mb-2">4.8/10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Performance Score</div>
              </div>
            </div>
          </section>

          {/* Main Diagnostic Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Primary Diagnostics */}
            <div className="lg:col-span-2 space-y-6">
              <HardwareProfiler />
              <AIModelHealth />
              <DiagnosticHistory />
            </div>

            {/* Right Column - Secondary Diagnostics */}
            <div className="space-y-6">
              <SystemMetrics />
              <PerformanceBenchmarks />
              <SystemRecommendations />
              <EmergencyTools />
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default SystemDiagnostic;
