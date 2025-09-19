'use client';

import React from 'react';
import { useFeatureFlags } from './hooks/useFeatureFlags';
import { FeatureFlagsHeader } from './components/FeatureFlagsHeader';
import { SystemStatus } from './components/SystemStatus';
import { QuickStats } from './components/QuickStats';
import { FeatureFlagList } from './components/FeatureFlagList';

/**
 * Main Feature Flags Container Component
 * Orchestrates all feature flag management functionality
 * Mobile-first responsive design with proper component composition
 */
export const FeatureFlags: React.FC = () => {
  const {
    searchTerm,
    statusFilter,
    showCreatePanel,
    featureFlags,
    stats,
    setSearchTerm,
    setStatusFilter,
    handleCreateFeature,
    handleEditFlag,
    handleRollbackFlag,
    handleCloseCreatePanel
  } = useFeatureFlags();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <FeatureFlagsHeader
        onCreateFeature={handleCreateFeature}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* System Status */}
      <SystemStatus
        activeFlags={18}
        testingFlags={3}
        isSynced={true}
      />

      {/* Quick Stats */}
      <QuickStats
        totalFlags={stats.total}
        inDevelopment={stats.inDevelopment}
        fullyDeployed={stats.fullyDeployed}
        needsRollback={stats.needsRollback}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Feature Flags List */}
        <div className="lg:col-span-2">
          <FeatureFlagList
            flags={featureFlags}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onEditFlag={handleEditFlag}
            onRollbackFlag={handleRollbackFlag}
          />
        </div>

        {/* Right Column - Configuration Panels */}
        <div className="space-y-6">
          {/* Create New Feature Panel */}
          {showCreatePanel && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                Create New Feature Flag
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., YouTube Virality OS"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the feature"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Feature ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value="youtube-virality-os"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]"
                    />
                    <svg className="h-5 w-5 absolute left-3 top-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default State
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]">
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Targeting Rules
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">User Tier</span>
                        <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium min-h-[32px] flex items-center justify-center">
                          Remove
                        </button>
                      </div>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[40px]">
                        <option>Any Tier</option>
                        <option>Guest</option>
                        <option>Tier 1</option>
                        <option>Tier 2</option>
                        <option>Tier 3</option>
                        <option>Admin</option>
                      </select>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Rollout Percentage</span>
                        <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium min-h-[32px] flex items-center justify-center">
                          Remove
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="100"
                          className="w-full accent-red-500"
                        />
                        <div className="text-center mt-1 font-medium">100%</div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium min-h-[44px] flex items-center justify-center">
                      + Add Targeting Rule
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCloseCreatePanel}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium min-h-[44px] flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium min-h-[44px] flex items-center justify-center">
                    Create Feature
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feature Configuration Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
              Feature Configuration
            </h2>
            <div className="space-y-5">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Feature ID</div>
                <div className="font-mono font-medium text-gray-900 dark:text-white">youtube-virality-os</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white min-h-[44px]">
                  <option>Enabled</option>
                  <option>Disabled</option>
                  <option>Partial Rollout</option>
                </select>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Targeting Rules
                </h3>
                <div className="space-y-3">
                  <div className="targeting-rule p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">User Tier</span>
                      <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium min-h-[32px] flex items-center justify-center">
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Available to: Tier 2, Tier 3
                    </div>
                  </div>
                  <div className="targeting-rule p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Rollout Percentage</span>
                      <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium min-h-[32px] flex items-center justify-center">
                        Edit
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="100"
                        className="w-full accent-red-500"
                      />
                      <div className="text-center mt-1 font-medium">100%</div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium min-h-[44px] flex items-center justify-center">
                    + Add Targeting Rule
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Feature Analytics
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Enabled Users</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">1,247</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Usage Rate</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">78.4%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Engagement Score</span>
                      <span className="text-sm font-medium text-green-600">+12.4%</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium min-h-[44px] flex items-center justify-center">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
