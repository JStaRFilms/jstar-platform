'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HeroSlide } from '../hooks/useHeroSlides';
import { useSlideshowConfig } from '../../HomePage/hooks/useSlideshowConfig';

/**
 * Props for LivePreview component
 */
interface LivePreviewProps {
  /** The slide to preview */
  slide: HeroSlide | null;
  /** Loading state */
  loading?: boolean;
  /** All available slides for navigation */
  allSlides?: HeroSlide[];
  /** Callback when slide changes */
  onSlideChange?: (slide: HeroSlide) => void;
}

/**
 * LivePreview Component
 * Shows a live preview of the selected hero slide in the admin interface
 * Features: Modal popup, keyboard navigation, on-screen arrows, interactive buttons
 * Mobile-first responsive design with proper accessibility
 */
const LivePreview: React.FC<LivePreviewProps> = ({
  slide,
  loading = false,
  allSlides = [],
  onSlideChange
}) => {
  // Get current slideshow configuration
  const { config: slideshowConfig } = useSlideshowConfig();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalSlide, setCurrentModalSlide] = useState<HeroSlide | null>(null);

  // Find current slide index for navigation
  const currentSlideIndex = slide ? allSlides.findIndex(s => s.id === slide.id) : -1;

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen || allSlides.length === 0) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateToSlide('prev');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateToSlide('next');
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen, currentModalSlide, allSlides]);

  // Navigation functions
  const navigateToSlide = (direction: 'prev' | 'next') => {
    if (!currentModalSlide || allSlides.length === 0) return;

    const currentIndex = allSlides.findIndex(s => s.id === currentModalSlide.id);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allSlides.length - 1;
    } else {
      newIndex = currentIndex < allSlides.length - 1 ? currentIndex + 1 : 0;
    }

    const newSlide = allSlides[newIndex];
    setCurrentModalSlide(newSlide);
    onSlideChange?.(newSlide);
  };

  // Modal functions
  const openModal = () => {
    if (slide) {
      setCurrentModalSlide(slide);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModalSlide(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no slide is selected
  if (!slide) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg
            className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm sm:text-base font-medium mb-2">
            No Slide Selected
          </p>
          <p className="text-xs sm:text-sm">
            Click on a slide in the list above to see its preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Preview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300" onClick={openModal}>
        {/* Sleek Compact Header */}
        <div className="bg-gradient-to-r from-jstar-blue via-faith-purple to-growth-green p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base font-semibold truncate">
                  Live Preview
                </h2>
                <p className="text-xs sm:text-sm text-white/90 truncate">
                  {slide.titleLine1} • {slide.titleLine2}
                </p>
              </div>
            </div>

            {/* Configuration indicator - compact */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs flex-shrink-0">
              <span className="px-1.5 py-0.5 bg-white/15 rounded-full backdrop-blur-sm text-xs">
                {slideshowConfig.transitionEffect}
              </span>
              <span className="px-1.5 py-0.5 bg-white/15 rounded-full backdrop-blur-sm text-xs">
                {slideshowConfig.transitionDuration}ms
              </span>
            </div>

            {/* Mobile config indicator */}
            <div className="sm:hidden flex items-center gap-1 text-xs flex-shrink-0">
              <span className="px-1 py-0.5 bg-white/15 rounded-full backdrop-blur-sm text-xs">
                {slideshowConfig.transitionEffect}
              </span>
            </div>
          </div>
        </div>

        {/* Preview Container */}
        <div className="relative">
          {/* Mini hero section */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full filter blur-2xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/20 rounded-full filter blur-2xl animate-pulse animation-delay-1000"></div>
            </div>

            {/* Content overlay */}
            <div className="relative h-full flex items-center">
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Text Content */}
                  <div className="lg:w-1/2 text-center lg:text-left">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      slide.id.includes('1') || slide.id.includes('default-1')
                        ? 'bg-primary/20 text-primary'
                        : 'bg-jstar-blue/20 text-jstar-blue'
                    }`}>
                      {slide.tagline}
                    </span>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-3">
                      <span className="text-white">{slide.titleLine1}</span>
                      <br />
                      <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                        slide.id.includes('1') || slide.id.includes('default-1')
                          ? 'from-primary to-accent'
                          : 'from-jstar-blue to-faith-purple'
                      }`}>
                        {slide.titleLine2}
                      </span>
                    </h1>
                    <p className="text-sm text-gray-300 mb-4 max-w-lg mx-auto lg:mx-0 line-clamp-2">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
                      <button className={`px-4 py-2 bg-gradient-to-r ${slide.buttonGradient} text-white rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                        Start Your Project
                      </button>
                      <button className={`px-4 py-2 bg-transparent border border-white/30 text-white rounded-lg font-medium text-sm hover:bg-white/10 transition-all duration-300 hover:scale-105`}>
                        View Our Work
                      </button>
                    </div>
                  </div>

                  {/* Image Content */}
                  <div className="lg:w-1/2 flex justify-center relative mt-4 lg:mt-0">
                    <div className="relative w-full max-w-xs">
                      <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl -z-10"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20">
                        <Image
                          src={slide.imageUrl || '/placeholder-image.jpg'}
                          alt={slide.altText || "Slide preview"}
                          width={400}
                          height={267}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <h3 className="text-sm font-bold mb-1">{slide.projectTitle || 'Latest Project'}</h3>
                            <p className="text-xs text-gray-200">{slide.projectDesc || 'Brand Storytelling'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration info for mobile */}
          <div className="sm:hidden p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded">
                {slideshowConfig.transitionEffect}
              </span>
              <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded">
                {slideshowConfig.transitionDuration}ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Preview */}
      {isModalOpen && currentModalSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-jstar-blue via-faith-purple to-growth-green p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentModalSlide.titleLine1}
                  </h2>
                  <p className="text-white/80 mt-1">
                    {currentModalSlide.titleLine2}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Close preview"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="relative">
              {/* Large hero section */}
              <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/20 rounded-full filter blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
                </div>

                {/* Content overlay */}
                <div className="relative h-full flex items-center">
                  <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                      {/* Text Content */}
                      <div className="lg:w-1/2 text-center lg:text-left">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                          currentModalSlide.id.includes('1') || currentModalSlide.id.includes('default-1')
                            ? 'bg-primary/20 text-primary'
                            : 'bg-jstar-blue/20 text-jstar-blue'
                        }`}>
                          {currentModalSlide.tagline}
                        </span>
                        <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-6">
                          <span className="text-white">{currentModalSlide.titleLine1}</span>
                          <br />
                          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                            currentModalSlide.id.includes('1') || currentModalSlide.id.includes('default-1')
                              ? 'from-primary to-accent'
                              : 'from-jstar-blue to-faith-purple'
                          }`}>
                            {currentModalSlide.titleLine2}
                          </span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                          {currentModalSlide.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                          <button className={`px-6 py-3 bg-gradient-to-r ${currentModalSlide.buttonGradient} text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                            Start Your Project
                          </button>
                          <button className={`px-6 py-3 bg-transparent border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105`}>
                            View Our Work
                          </button>
                        </div>
                      </div>

                      {/* Image Content */}
                      <div className="lg:w-1/2 flex justify-center relative mt-8 lg:mt-0">
                        <div className="relative w-full max-w-md">
                          <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl -z-10"></div>
                          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                            <Image
                              src={currentModalSlide.imageUrl || '/placeholder-image.jpg'}
                              alt={currentModalSlide.altText || "Slide preview"}
                              width={600}
                              height={400}
                              className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                              <div className="text-white">
                                <h3 className="text-lg font-bold mb-2">{currentModalSlide.projectTitle || 'Latest Project'}</h3>
                                <p className="text-sm text-gray-200">{currentModalSlide.projectDesc || 'Brand Storytelling for Tech Startup'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {allSlides.length > 1 && (
              <>
                <button
                  onClick={() => navigateToSlide('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button
                  onClick={() => navigateToSlide('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </>
            )}

            {/* Slide Counter */}
            {allSlides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                {allSlides.findIndex(s => s.id === currentModalSlide.id) + 1} / {allSlides.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LivePreview;
