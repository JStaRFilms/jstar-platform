'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/features/AdminDashboard/components/AdminSidebar';
import { useHeroSlides, HeroSlide } from './hooks/useHeroSlides';
import SlidesList from './components/SlidesList';
import CreateSlideForm from './components/CreateSlideForm';

/**
 * Hero Slides Management Component
 * Main container for managing homepage hero slides
 */
export const HeroSlidesManagement: React.FC = () => {
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const { slides, loading, error, createSlide, updateSlide, deleteSlide } = useHeroSlides();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <a href="/admin/cms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  CMS
                </a>
                <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                <span className="text-gray-900 dark:text-white">Hero Slides</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Hero Slides Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create, edit, and manage homepage hero slides
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                onClick={() => setIsCreatePanelOpen(true)}
              >
                <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create New Slide
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search slides..."
                  className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <svg className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* System Status */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Hero Slides Status</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Current slides and configuration
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center">
                  <span className="status-indicator status-active"></span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">4 Active Slides</span>
                </div>
                <div className="flex items-center">
                  <span className="status-indicator status-active"></span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Connected</span>
                </div>
                <div className="flex items-center">
                  <span className="status-indicator status-active"></span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Advance: 7s</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-red-500 mb-2">4</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Slides</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-500 mb-2">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Slides</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-500 mb-2">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Inactive Slides</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-500 mb-2">7s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Slide Interval</div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Slides List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Slides List */}
            <SlidesList
              slides={slides}
              loading={loading}
              error={error}
              onSlideSelect={setSelectedSlide}
              onSlideEdit={(slide) => {
                setSelectedSlide(slide);
                // TODO: Open edit modal/form
              }}
              onSlideDelete={async (slideId) => {
                try {
                  await deleteSlide(slideId);
                } catch (err) {
                  console.error('Failed to delete slide:', err);
                  // TODO: Show error notification
                }
              }}
              onSlideToggle={async (slideId, isActive) => {
                try {
                  await updateSlide(slideId, { isActive });
                } catch (err) {
                  console.error('Failed to toggle slide status:', err);
                  // TODO: Show error notification
                }
              }}
            />

            {/* Slide Reordering Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Slide Order</h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Slide reordering functionality will be implemented here</p>
              </div>
            </div>
          </div>

          {/* Right Column - Configuration */}
          <div className="space-y-6">
            {/* Create New Slide Panel */}
            {isCreatePanelOpen && (
              <CreateSlideForm
                onSubmit={async (slideData) => {
                  try {
                    await createSlide(slideData);
                    setIsCreatePanelOpen(false);
                    // TODO: Show success notification
                  } catch (err) {
                    console.error('Failed to create slide:', err);
                    // TODO: Show error notification
                  }
                }}
                onCancel={() => setIsCreatePanelOpen(false)}
                loading={loading}
              />
            )}

            {/* Slide Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Slide Configuration</h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Configuration panel will be implemented here</p>
              </div>
            </div>

            {/* Slide Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Slide Preview</h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Live preview will be implemented here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlidesManagement;
