'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioProject, manualProjects } from '@/content/portfolio';
import PortfolioCard from '@/features/HomePage/components/PortfolioCard';
import PortfolioModal from '@/features/HomePage/components/PortfolioModal';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';
import { usePortfolioFilter } from '@/features/HomePage/hooks/usePortfolioFilter';
import { isMobileDevice } from '@/lib/scrollAnimationUtils';

const PortfolioGrid = () => {
  const { activeFilter, handleFilterChange } = usePortfolioFilter('all');
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [initialTime, setInitialTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Use scroll animation hook - re-using logic from PortfolioSection
  // Note: We'll initialize this after data loads
  const filteredItems = activeFilter === 'all'
    ? portfolioProjects
    : portfolioProjects.filter(item => item.category === activeFilter);

  // Scroll animation hook
  const { refs, visibilityStates } = useScrollAnimationMulti<HTMLDivElement>({
    count: filteredItems.length,
    staggerDelay: 100,
    threshold: 0.1,
    triggerOnce: true,
  });

  // Check for mobile device on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);

        // Fetch unified portfolio data from database
        const response = await fetch('/api/portfolio?showHidden=true');
        const data = response.ok ? await response.json() : { projects: [] };

        // data.projects already contains mapped projects sorted by order/date
        setPortfolioProjects(data.projects);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Fallback to manual projects only if API fails completely
        setPortfolioProjects(manualProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const getTagColor = (tag: string, index: number) => {
    const colors = [
      'bg-primary/20 text-primary dark:text-accent',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    ];
    return colors[index % colors.length];
  };

  const handleProjectClick = (project: PortfolioProject, startTime: number = 0) => {
    setSelectedProject(project);
    setInitialTime(startTime);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setInitialTime(0);
  };

  return (
    <>
      <section className="py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((project, index) => (
                  <div
                    key={project.id}
                    ref={refs[index]}
                    className="h-full"
                  >
                    <PortfolioCard
                      project={project}
                      onClick={(startTime) => handleProjectClick(project, startTime)}
                      getTagColor={getTagColor}
                      forceHover={isMobile && visibilityStates[index]}
                      isModalOpen={selectedProject?.id === project.id}
                    />
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 dark:text-gray-400">No projects found in this category.</p>
                  <button
                    onClick={() => handleFilterChange('all')}
                    className="mt-4 text-primary hover:underline"
                  >
                    View all projects
                  </button>
                </div>
              )}

              {/* Load More Button - Logic not fully implemented yet, just visual for now if list is huge */}
              {filteredItems.length > 9 && (
                <div className="text-center mt-12">
                  <div className="text-sm text-gray-500 mb-4">Showing all {filteredItems.length} projects</div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Portfolio Modal */}
      <PortfolioModal
        project={selectedProject}
        onClose={closeModal}
        isOpen={selectedProject !== null}
        initialTime={initialTime}
        onNext={() => {
          const currentIndex = filteredItems.findIndex(p => p.id === selectedProject?.id);
          if (currentIndex < filteredItems.length - 1) {
            setSelectedProject(filteredItems[currentIndex + 1]);
            setInitialTime(0);
          }
        }}
        onPrev={() => {
          const currentIndex = filteredItems.findIndex(p => p.id === selectedProject?.id);
          if (currentIndex > 0) {
            setSelectedProject(filteredItems[currentIndex - 1]);
            setInitialTime(0);
          }
        }}
        hasNext={selectedProject ? filteredItems.findIndex(p => p.id === selectedProject.id) < filteredItems.length - 1 : false}
        hasPrev={selectedProject ? filteredItems.findIndex(p => p.id === selectedProject.id) > 0 : false}
      />
    </>
  );
};

export default PortfolioGrid;
