'use client';

import React, { useState, useRef } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';

/**
 * Props for SlideOrderManager component
 */
interface SlideOrderManagerProps {
  /** Array of hero slides to reorder */
  slides: HeroSlide[];
  /** Callback when slides are reordered */
  onReorder?: (reorderedSlides: HeroSlide[]) => void;
  /** Loading state */
  loading?: boolean;
}

/**
 * SlideOrderManager Component
 * Provides drag and drop functionality for reordering hero slides
 * Updates the sortOrder property and persists changes via API
 */
const SlideOrderManager: React.FC<SlideOrderManagerProps> = ({
  slides,
  onReorder,
  loading = false
}) => {
  const [draggedSlide, setDraggedSlide] = useState<HeroSlide | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const dragStartRef = useRef<number>(0);

  // Sort slides by sortOrder for display
  const sortedSlides = [...slides].sort((a, b) => a.sortOrder - b.sortOrder);

  /**
   * Handle drag start
   */
  const handleDragStart = (e: React.DragEvent, slide: HeroSlide, index: number) => {
    setDraggedSlide(slide);
    dragStartRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);

    // Enhanced drag visual feedback
    const target = e.currentTarget as HTMLElement;
    target.classList.add('opacity-50', 'scale-105', 'rotate-2', 'shadow-2xl', 'z-50');
    target.style.transform = 'scale(1.05) rotate(2deg)';
    target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedSlide(null);
    setDragOverIndex(null);

    // Clean up all drag styles
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('opacity-50', 'scale-105', 'rotate-2', 'shadow-2xl', 'z-50');
    target.style.transform = '';
    target.style.boxShadow = '';
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  /**
   * Handle drag leave
   */
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  /**
   * Handle drop
   */
  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (!draggedSlide || dragStartRef.current === dropIndex) {
      setDraggedSlide(null);
      setDragOverIndex(null);
      return;
    }

    // Create new order
    const newSlides = [...sortedSlides];
    const draggedIndex = dragStartRef.current;

    // Remove dragged item
    const [removed] = newSlides.splice(draggedIndex, 1);

    // Insert at new position
    newSlides.splice(dropIndex, 0, removed);

    // Update sortOrder for all slides
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      sortOrder: index + 1
    }));

    setDraggedSlide(null);
    setDragOverIndex(null);

    // Call onReorder callback
    onReorder?.(updatedSlides);

    // Persist changes to API
    await updateSlideOrder(updatedSlides);
  };

  /**
   * Update slide order via API
   */
  const updateSlideOrder = async (slidesToUpdate: HeroSlide[]) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/hero-slides/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides: slidesToUpdate.map(slide => ({
            id: slide.id,
            sortOrder: slide.sortOrder
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update slide order: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to update slide order');
      }

      // Show success message
      console.log('Slide order updated successfully');
    } catch (error) {
      console.error('Error updating slide order:', error);
      // Revert changes on error
      onReorder?.(slides);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Slide Order
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag and drop to reorder slides
            </p>
          </div>
        </div>

        {/* Status indicator */}
        {isUpdating && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Saving...
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">How to reorder:</p>
            <p>Drag any slide up or down to change its position. The new order will be saved automatically.</p>
          </div>
        </div>
      </div>

      {/* Slides List */}
      <div className="space-y-3">
        {sortedSlides.map((slide, index) => (
          <div
            key={slide.id}
            draggable
            onDragStart={(e) => handleDragStart(e, slide, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-move
              ${dragOverIndex === index
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
              }
              ${draggedSlide?.id === slide.id ? 'opacity-50' : 'hover:border-primary/50'}
            `}
          >
            {/* Drag Handle */}
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
              </svg>
            </div>

            {/* Slide Number */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {index + 1}
            </div>

            {/* Slide Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {slide.titleLine1}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {slide.titleLine2}
              </p>
            </div>

            {/* Status Indicator */}
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                slide.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {slide.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Drag Indicator */}
            <div className="flex-shrink-0 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedSlides.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-sm font-medium mb-2">No slides to reorder</p>
          <p className="text-xs">Add some slides first to manage their order</p>
        </div>
      )}

      {/* Footer with save status */}
      {sortedSlides.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {sortedSlides.length} slide{sortedSlides.length !== 1 ? 's' : ''} • Drag to reorder
            </span>
            {isUpdating ? (
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                Saving changes...
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Order saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideOrderManager;
