
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePortfolioFilter } from '../hooks/usePortfolioFilter';
import { ArrowRightIcon } from '../../../components/icons/static-icons';
import { PortfolioProject, manualProjects } from '../../../content/portfolio';
import PortfolioCard from './PortfolioCard';
import PortfolioModal from './PortfolioModal';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';
import { isMobileDevice } from '@/lib/scrollAnimationUtils';

const PortfolioSection = () => {
  const { activeFilter, handleFilterChange } = usePortfolioFilter('all');
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Smart curation engine: manual projects first (by order), then YouTube videos
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);

        // Fetch YouTube playlist data
        const youtubeResponse = await fetch('/api/portfolio/youtube-playlist');
        const youtubeData = youtubeResponse.ok ? await youtubeResponse.json() : { projects: [] };

        // Combine manual projects and YouTube projects
        const allProjects = [
          ...manualProjects,
          ...youtubeData.projects
        ];

        // Sort: manual projects by order first, then YouTube by date
        allProjects.sort((a, b) => {
          if (a.source === 'manual' && b.source === 'manual') {
            return (a.order || 999) - (b.order || 999);
          }
          if (a.source === 'manual') return -1;
          if (b.source === 'manual') return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });

        setPortfolioProjects(allProjects);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Fallback to manual projects only
        setPortfolioProjects(manualProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const filteredItems = activeFilter === 'all'
    ? portfolioProjects
    : portfolioProjects.filter(item => item.category === activeFilter);

  // Scroll animation hook
  const { refs, visibilityStates } = useScrollAnimationMulti<HTMLDivElement>({
    count: filteredItems.length,
    staggerDelay: 100,
    threshold: 0.2, // Slightly higher threshold for better UX
    triggerOnce: false, // Allow animations to reset when out of view
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'video': return 'Video Production';
      case 'web': return 'Web Development';
      case 'branding': return 'Branding';
      default: return category;
    }
  };

  const getTagColor = (tag: string, index: number) => {
    const colors = [
      'bg-primary/20 text-primary dark:text-accent',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    ];
    return colors[index % colors.length];
  };

  const handleProjectClick = (project: PortfolioProject) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="portfolio" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-accent rounded-full text-sm font-medium mb-4">
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Showcase of </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Excellence</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A curated collection of our best work, showcasing our expertise in video production, web development, and creative solutions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1.5">
            <button
              onClick={() => handleFilterChange('all')}
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${activeFilter === 'all'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                }`}
              data-filter="all"
            >
              All Projects
            </button>
            <button
              onClick={() => handleFilterChange('video')}
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${activeFilter === 'video'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                }`}
              data-filter="video"
            >
              Video Production
            </button>
            <button
              onClick={() => handleFilterChange('web')}
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${activeFilter === 'web'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                }`}
              data-filter="web"
            >
              Web Development
            </button>
            <button
              onClick={() => handleFilterChange('branding')}
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${activeFilter === 'branding'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                }`}
              data-filter="branding"
            >
              Branding
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* First Row - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {filteredItems.slice(0, 2).map((project, index) => (
                <div
                  key={project.id}
                  ref={refs[index]}
                  className="h-full"
                >
                  <PortfolioCard
                    project={project}
                    onClick={() => handleProjectClick(project)}
                    getTagColor={getTagColor}
                    forceHover={isMobile && visibilityStates[index]}
                  />
                </div>
              ))}
            </div>

            {/* Second Row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {filteredItems.slice(2, 5).map((project, index) => (
                <div
                  key={project.id}
                  ref={refs[index + 2]} // Offset index by 2 since we sliced the first 2
                  className="h-full"
                >
                  <PortfolioCard
                    project={project}
                    onClick={() => handleProjectClick(project)}
                    getTagColor={getTagColor}
                    forceHover={isMobile && visibilityStates[index + 2]}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link href="/portfolio" className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            View Full Portfolio
            <ArrowRightIcon className="ml-2 -mr-1 w-5 h-5" />
          </Link>
        </div>

        {/* Portfolio Modal */}
        <PortfolioModal
          project={selectedProject}
          onClose={closeModal}
          isOpen={selectedProject !== null}
        />
      </div>
    </section>
  );
};

export default PortfolioSection;
