'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/features/AdminDashboard/components/AdminSidebar';
import { useHeroSlides, HeroSlide } from './hooks/useHeroSlides';
import { HeroSlidesHeader } from './components/HeroSlidesHeader';
import { HeroSlidesStats } from './components/HeroSlidesStats';
import { HeroSlidesGrid } from './components/HeroSlidesGrid';
import { CreateSlideModal } from './components/CreateSlideModal';

/**
 * Hero Slides Management Component
 * Main container for managing homepage hero slides
 * Follows mobile-first responsive design and component-driven architecture
 */
export const HeroSlidesManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const { slides, loading, error, createSlide, updateSlide, deleteSlide } = useHeroSlides();

  /**
   * Handle slide creation
   */
  const handleCreateSlide = async (slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createSlide(slideData);
      setIsCreateModalOpen(false);
      // TODO: Show success notification
    } catch (err) {
      console.error('Failed to create slide:', err);
      // TODO: Show error notification
    }
  };

  /**
   * Handle slide deletion
   */
  const handleDeleteSlide = async (slideId: string) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) {
      return;
    }

    try {
      await deleteSlide(slideId);
      // TODO: Show success notification
    } catch (err) {
      console.error('Failed to delete slide:', err);
      // TODO: Show error notification
    }
  };

  /**
   * Handle slide status toggle
   */
  const handleToggleSlide = async (slideId: string, isActive: boolean) => {
    try {
      await updateSlide(slideId, { isActive });
      // TODO: Show success notification
    } catch (err) {
      console.error('Failed to toggle slide status:', err);
      // TODO: Show error notification
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Sidebar - Hidden on mobile, shown on desktop */}
      <AdminSidebar activeSection="cms" />

      {/* Main Content - Responsive layout */}
      <div className="ml-0 md:ml-64 p-4 sm:p-6">
        {/* Header Section */}
        <HeroSlidesHeader
          onCreateClick={() => setIsCreateModalOpen(true)}
        />

        {/* Stats Section */}
        <HeroSlidesStats
          slides={slides}
          loading={loading}
        />

        {/* Main Content Grid */}
        <HeroSlidesGrid
          slides={slides}
          loading={loading}
          error={error}
          onSlideSelect={setSelectedSlide}
          onSlideEdit={setSelectedSlide}
          onSlideDelete={handleDeleteSlide}
          onSlideToggle={handleToggleSlide}
        />
      </div>

      {/* Create Slide Modal */}
      <CreateSlideModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSlide}
        loading={loading}
      />
    </div>
  );
};

export default HeroSlidesManagement;
