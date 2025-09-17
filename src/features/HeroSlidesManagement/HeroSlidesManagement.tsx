'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/features/AdminDashboard/components/AdminSidebar';
import { useHeroSlides, HeroSlide } from './hooks/useHeroSlides';
import { HeroSlidesHeader } from './components/HeroSlidesHeader';
import { HeroSlidesStats } from './components/HeroSlidesStats';
import { HeroSlidesGrid } from './components/HeroSlidesGrid';
import { CreateSlideModal } from './components/CreateSlideModal';
import { EditSlideModal } from './components/EditSlideModal';

/**
 * Hero Slides Management Component
 * Main container for managing homepage hero slides
 * Follows mobile-first responsive design and component-driven architecture
 */
export const HeroSlidesManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    // Find the slide being deleted
    const slideToDelete = slides.find(slide => slide.id === slideId);

    // Prevent deletion if it would leave zero active slides
    if (slideToDelete?.isActive) {
      const activeSlidesCount = slides.filter(slide => slide.isActive && slide.id !== slideId).length;
      if (activeSlidesCount === 0) {
        alert('Cannot delete this slide. At least one slide must remain active.');
        return;
      }
    }

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
      // Prevent disabling if it would leave zero active slides
      if (!isActive) {
        const activeSlidesCount = slides.filter(slide => slide.isActive).length;
        if (activeSlidesCount <= 1) {
          alert('Cannot disable this slide. At least one slide must remain active.');
          return;
        }
      }

      await updateSlide(slideId, { isActive });
      // TODO: Show success notification
    } catch (err) {
      console.error('Failed to toggle slide status:', err);
      // TODO: Show error notification
    }
  };

  /**
   * Handle slide editing
   */
  const handleEditSlide = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsEditModalOpen(true);
  };

  /**
   * Handle slide update
   */
  const handleUpdateSlide = async (slideData: Partial<HeroSlide>) => {
    if (!selectedSlide) return;

    try {
      await updateSlide(selectedSlide.id, slideData);
      setIsEditModalOpen(false);
      setSelectedSlide(null);
      // TODO: Show success notification
    } catch (err) {
      console.error('Failed to update slide:', err);
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
          onSlideEdit={handleEditSlide}
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

      {/* Edit Slide Modal */}
      <EditSlideModal
        isOpen={isEditModalOpen}
        slide={selectedSlide}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSlide(null);
        }}
        onSubmit={handleUpdateSlide}
        loading={loading}
      />
    </div>
  );
};

export default HeroSlidesManagement;
