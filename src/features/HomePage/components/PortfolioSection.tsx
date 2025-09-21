
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePortfolioFilter } from '../hooks/usePortfolioFilter';
import { PlayCircleIcon, ArrowRightIcon } from '../../../components/icons/static-icons';

const portfolioItems = [
  {
    id: 1, category: 'video', title: 'Luxury Wedding Film',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80',
    tags: ['4K Video', 'Wedding', 'Cinematic'],
    description: 'A breathtaking cinematic wedding film captured in 4K with stunning aerial shots.'
  },
  {
    id: 2, category: 'web', title: 'E-commerce Platform',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop',
    tags: ['E-commerce', 'React', 'Node.js'],
    description: 'A high-performance online store with seamless checkout and inventory management.'
  },
  {
    id: 3, category: 'branding', title: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    tags: ['Logo', 'Branding', 'Identity'],
    description: 'Complete brand identity system including logo, colors, and typography.'
  },
  {
    id: 4, category: 'video', title: 'Music Video Production',
    image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    tags: ['Music Video', 'Performance', '4K'],
    description: 'High-energy music video featuring dynamic performances and creative visuals.'
  },
  {
    id: 5, category: 'web', title: 'Fitness Mobile App',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    tags: ['Mobile App', 'React Native', 'UI/UX'],
    description: 'A comprehensive fitness tracking application with personalized workout plans.'
  },
];

const PortfolioSection = () => {
  const { activeFilter, handleFilterChange } = usePortfolioFilter('all');

  const filteredItems = activeFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

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
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
              }`}
              data-filter="all"
            >
              All Projects
            </button>
            <button
              onClick={() => handleFilterChange('video')}
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${
                activeFilter === 'video'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
              }`}
              data-filter="video"
            >
              Video Production
            </button>
            <button
              onClick={() => handleFilterChange('web')}
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${
                activeFilter === 'web'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
              }`}
              data-filter="web"
            >
              Web Development
            </button>
            <button
              onClick={() => handleFilterChange('branding')}
              className={`portfolio-filter px-5 py-2.5 rounded-full font-medium transition-colors ${
                activeFilter === 'branding'
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
        {/* First Row - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {filteredItems.slice(0, 2).map(item => (
            <div key={item.id} className="portfolio-item group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
              <div className={`aspect-video overflow-hidden ${item.category === 'video' ? 'bg-gradient-to-br from-primary to-accent' : item.category === 'web' ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                <Image src={item.image} alt={item.title} fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map((tag, index) => (
                        <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(tag, index)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                  </div>
                </div>
                {item.category === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <PlayCircleIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{getCategoryLabel(item.category)}</p>
                  </div>
                  <a href="#" className="text-primary dark:text-accent hover:opacity-80 transition-opacity ml-4 flex-shrink-0">
                    <ArrowRightIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {filteredItems.slice(2).map(item => (
            <div key={item.id} className="portfolio-item group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
              <div className={`aspect-video overflow-hidden ${item.category === 'video' ? 'bg-gradient-to-br from-rose-500 to-pink-500' : item.category === 'web' ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                <Image src={item.image} alt={item.title} fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map((tag, index) => (
                        <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(tag, index)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                  </div>
                </div>
                {item.category === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <PlayCircleIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{getCategoryLabel(item.category)}</p>
                  </div>
                  <a href="#" className="text-primary dark:text-accent hover:opacity-80 transition-opacity ml-4 flex-shrink-0">
                    <ArrowRightIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/portfolio" className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            View Full Portfolio
            <ArrowRightIcon className="ml-2 -mr-1 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
