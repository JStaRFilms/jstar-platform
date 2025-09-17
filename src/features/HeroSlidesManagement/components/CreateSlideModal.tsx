'use client';

import React, { useEffect } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';
import CreateSlideForm from './CreateSlideForm';

/**
 * Props for CreateSlideModal component
 */
interface CreateSlideModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when slide is submitted */
  onSubmit: (slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Loading state */
  loading?: boolean;
}

/**
 * Create Slide Modal Component
 * Modal wrapper for the create slide form
 * Mobile-first responsive design with proper focus management
 */
export const CreateSlideModal: React.FC<CreateSlideModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-slide-title"
        aria-describedby="create-slide-description"
      >
        {/* Modal Content */}
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  id="create-slide-title"
                  className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
                >
                  Create New Hero Slide
                </h2>
                <p
                  id="create-slide-description"
                  className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                >
                  Add a new slide to your homepage hero carousel
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            <CreateSlideForm
              onSubmit={onSubmit}
              onCancel={onClose}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};
