'use client';

import React, { useState } from 'react';

const portfolioItems = [
  {
    id: 'wedding1',
    title: 'The Johnson Wedding',
    category: 'Wedding',
    description: 'A cinematic highlight film capturing the joy and emotion of Sarah and Michael\'s special day, featuring drone footage and professional color grading.',
    tags: ['Drone', '4K', 'Color Grading'],
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'app1',
    title: 'TechSummit 2023 App',
    category: 'App',
    description: 'A custom mobile application developed for the annual TechSummit conference, featuring schedules, networking tools, and real-time updates.',
    tags: ['React Native', 'Firebase', 'Real-time'],
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'event1',
    title: 'GlobalTech Annual Gala',
    category: 'Event',
    description: 'Comprehensive coverage of GlobalTech\'s annual gala event, including keynote speeches, networking sessions, and a professionally edited highlight reel.',
    tags: ['Multi-Camera', 'Live Streaming', 'Highlight Reel'],
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'brand1',
    title: 'Hope Foundation Brand Video',
    category: 'Brand',
    description: 'An emotional brand story created for the Hope Foundation, showcasing their mission, impact, and the lives they\'ve changed through compelling storytelling.',
    tags: ['Narrative', 'Interviews', 'Motion Graphics'],
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'app2',
    title: 'FitLife Mobile App',
    category: 'App',
    description: 'A comprehensive health and fitness tracking application that helps users achieve their wellness goals with personalized workout plans and progress tracking.',
    tags: ['React Native', 'HealthKit', 'Personalization'],
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'wedding2',
    title: 'The Martinez Wedding',
    category: 'Wedding',
    description: 'A full-length documentary style wedding film capturing every moment of Elena and Carlos\'s beautiful ceremony and reception in stunning 4K.',
    tags: ['Documentary', '4K', 'Cinematic'],
    imageUrl: '/placeholder.svg',
  },
];

const PortfolioGrid = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxContent, setLightboxContent] = useState({ image: '', caption: '' });

  const openLightbox = (image: string, caption: string) => {
    setLightboxContent({ image, caption });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div key={item.id} className="portfolio-item bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="portfolio-image">
                  <div className="h-64 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <p className="font-medium">{item.title}</p>
                    </div>
                  </div>
                  <div className="portfolio-overlay">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-200 mb-4">{item.description}</p>
                    <button onClick={() => openLightbox(item.imageUrl, item.title)} className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      View Project
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <span className={`px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Load More Projects
            </button>
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <div id="lightbox" className="lightbox" style={{ display: 'block' }} onClick={closeLightbox}>
          <span className="absolute top-6 right-6 text-white text-3xl cursor-pointer" onClick={closeLightbox}>&times;</span>
          <img id="lightbox-img" className="lightbox-content" src={lightboxContent.image} alt={lightboxContent.caption} />
          <div id="lightbox-caption" className="lightbox-caption">{lightboxContent.caption}</div>
        </div>
      )}
    </>
  );
};

export default PortfolioGrid;
