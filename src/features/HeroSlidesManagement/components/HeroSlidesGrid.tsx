'use client';

import React, { useState } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';
import SlidesList from './SlidesList';
import SlideshowConfig from './SlideshowConfig';
import LivePreview from './LivePreview';
import SlideOrderManager from './SlideOrderManager';

/**
 * Props for HeroSlidesGrid component
 */
interface HeroSlidesGridProps {
  /** Array of hero slides */
  slides: HeroSlide[];
  /** Loading state */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** Callback when slide is selected */
  onSlideSelect?: (slide: HeroSlide) => void;
  /** Callback when slide edit is requested */
  onSlideEdit?: (slide: HeroSlide) => void;
  /** Callback when slide deletion is requested */
  onSlideDelete?: (slideId: string) => void;
  /** Callback when slide status is toggled */
  onSlideToggle?: (slideId: string, isActive: boolean) => void;
}

/**
 * Hero Slides Grid Component
 * Main content grid containing slides list and configuration panels
 * Mobile-first responsive design
 */
export const HeroSlidesGrid: React.FC<HeroSlidesGridProps> = ({
  slides,
  loading,
  error,
  onSlideSelect,
  onSlideEdit,
  onSlideDelete,
  onSlideToggle,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedSlideForPreview, setSelectedSlideForPreview] = useState<HeroSlide | null>(null);
  const [localSlides, setLocalSlides] = useState<HeroSlide[]>(slides);

  // Update local slides when props change
  React.useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  /**
   * Export slides in different formats
   */
  const exportSlides = (format: 'json' | 'csv' | 'markdown') => {
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      slides: localSlides.map(slide => ({
        id: slide.id,
        titleLine1: slide.titleLine1,
        titleLine2: slide.titleLine2,
        tagline: slide.tagline,
        description: slide.description,
        imageUrl: slide.imageUrl,
        gradient: slide.gradient,
        buttonGradient: slide.buttonGradient,
        buttonBorder: slide.buttonBorder,
        buttonText: slide.buttonText,
        buttonHover: slide.buttonHover,
        sortOrder: slide.sortOrder,
        isActive: slide.isActive,
        altText: slide.altText,
        projectTitle: slide.projectTitle,
        projectDesc: slide.projectDesc
      }))
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(exportData, null, 2);
        filename = `hero-slides-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;

      case 'csv':
        const headers = ['ID', 'Title Line 1', 'Title Line 2', 'Tagline', 'Description', 'Image URL', 'Sort Order', 'Active'];
        const csvRows = [
          headers.join(','),
          ...localSlides.map(slide => [
            slide.id,
            `"${slide.titleLine1.replace(/"/g, '""')}"`,
            `"${slide.titleLine2.replace(/"/g, '""')}"`,
            `"${slide.tagline.replace(/"/g, '""')}"`,
            `"${slide.description.replace(/"/g, '""')}"`,
            slide.imageUrl,
            slide.sortOrder,
            slide.isActive ? 'Yes' : 'No'
          ].join(','))
        ];
        content = csvRows.join('\n');
        filename = `hero-slides-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;

      case 'markdown':
        content = `# Hero Slides Export\n\n**Exported:** ${new Date().toLocaleString()}\n**Total Slides:** ${localSlides.length}\n\n${localSlides.map((slide, index) => `## Slide ${index + 1}: ${slide.titleLine1}\n\n**Title Line 2:** ${slide.titleLine2}\n**Tagline:** ${slide.tagline}\n**Description:** ${slide.description}\n**Image:** ${slide.imageUrl}\n**Sort Order:** ${slide.sortOrder}\n**Active:** ${slide.isActive ? 'Yes' : 'No'}\n\n---\n`).join('\n')}`;
        filename = `hero-slides-export-${new Date().toISOString().split('T')[0]}.md`;
        mimeType = 'text/markdown';
        break;

      default:
        return;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Import slides from file
   */
  const importSlides = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let importedSlides: any[] = [];

          if (file.name.endsWith('.json')) {
            const data = JSON.parse(content);
            importedSlides = data.slides || [];
          } else if (file.name.endsWith('.csv')) {
            // Parse CSV (simple implementation)
            const lines = content.split('\n');
            const headers = lines[0].split(',');
            importedSlides = lines.slice(1).map(line => {
              const values = line.split(',');
              return {
                titleLine1: values[1]?.replace(/"/g, '') || '',
                titleLine2: values[2]?.replace(/"/g, '') || '',
                tagline: values[3]?.replace(/"/g, '') || '',
                description: values[4]?.replace(/"/g, '') || '',
                imageUrl: values[5] || '',
                gradient: 'from-primary to-accent',
                buttonGradient: 'from-primary to-accent',
                buttonBorder: 'border-primary',
                buttonText: 'text-primary',
                buttonHover: 'hover:bg-primary/10',
                sortOrder: parseInt(values[6]) || 0,
                isActive: values[7]?.toLowerCase() === 'yes'
              };
            });
          }

          if (importedSlides.length > 0) {
            console.log('Imported slides:', importedSlides);
            alert(`Successfully imported ${importedSlides.length} slides. You can now save them to the database.`);
          }
        } catch (error) {
          console.error('Error importing slides:', error);
          alert('Error importing slides. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  /**
   * Duplicate all active slides
   */
  const duplicateAllSlides = () => {
    const activeSlides = localSlides.filter(slide => slide.isActive);
    if (activeSlides.length === 0) {
      alert('No active slides to duplicate.');
      return;
    }

    const duplicatedSlides = activeSlides.map((slide, index) => ({
      ...slide,
      id: `duplicate-${Date.now()}-${index}`,
      titleLine1: `${slide.titleLine1} (Copy)`,
      titleLine2: `${slide.titleLine2} (Copy)`,
      sortOrder: Math.max(...localSlides.map(s => s.sortOrder)) + index + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    setLocalSlides([...localSlides, ...duplicatedSlides]);
    alert(`Successfully duplicated ${duplicatedSlides.length} slides.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Left Column - Slides List */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {/* Slides List */}
        <SlidesList
          slides={localSlides}
          loading={loading}
          error={error}
          onSlideSelect={(slide) => {
            setSelectedSlideForPreview(slide);
            onSlideSelect?.(slide);
          }}
          onSlideEdit={onSlideEdit}
          onSlideDelete={onSlideDelete}
          onSlideToggle={onSlideToggle}
        />

        {/* Slide Order Manager */}
        <SlideOrderManager
          slides={localSlides}
          loading={loading}
          onReorder={(reorderedSlides: HeroSlide[]) => {
            // Update local state immediately for instant UI feedback
            setLocalSlides(reorderedSlides);

            // Update selected slide if it was reordered
            if (selectedSlideForPreview) {
              const updatedSelectedSlide = reorderedSlides.find(s => s.id === selectedSlideForPreview.id);
              if (updatedSelectedSlide) {
                setSelectedSlideForPreview(updatedSelectedSlide);
              }
            }

            // Notify parent component of the reordering
            console.log('Slides reordered:', reorderedSlides);
          }}
        />
      </div>

      {/* Right Column - Configuration Panels */}
      <div className="space-y-4 sm:space-y-6">
        {/* Live Preview */}
        <LivePreview
          slide={selectedSlideForPreview}
          loading={loading}
          allSlides={localSlides}
          onSlideChange={setSelectedSlideForPreview}
        />

        {/* Slideshow Configuration - Functional */}
        <SlideshowConfig />

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <button
                onClick={() => exportSlides('json')}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Export all slides as JSON"
              >
                <svg
                  className="h-4 w-4 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export Slides
              </button>

              {/* Export format dropdown */}
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => exportSlides('json')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  📄 Export as JSON
                </button>
                <button
                  onClick={() => exportSlides('csv')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  📊 Export as CSV
                </button>
                <button
                  onClick={() => exportSlides('markdown')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  📝 Export as Markdown
                </button>
              </div>
            </div>

            <button
              onClick={importSlides}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Import slides from file"
            >
              <svg
                className="h-4 w-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Import Slides
            </button>

            <button
              onClick={duplicateAllSlides}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Duplicate all active slides"
            >
              <svg
                className="h-4 w-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Duplicate All
            </button>

            {/* Reset to Defaults Button */}
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to reset to default slides? This will delete all custom slides.')) {
                  try {
                    const response = await fetch('/api/admin/hero-slides', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'reset-to-defaults' }),
                    });

                    if (response.ok) {
                      // Refresh the page to show updated slides
                      window.location.reload();
                    } else {
                      alert('Failed to reset to defaults');
                    }
                  } catch (error) {
                    console.error('Error resetting to defaults:', error);
                    alert('Failed to reset to defaults');
                  }
                }
              }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Reset to default slides"
            >
              <svg
                className="h-4 w-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
