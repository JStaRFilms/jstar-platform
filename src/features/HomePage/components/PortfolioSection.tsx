import React from 'react';

const PortfolioSection: React.FC = () => {
  return (
    <section id="portfolio" className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Portfolio
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A showcase of cinematic storytelling and innovative app development.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Portfolio Item 1 */}
          <div className="portfolio-item bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-64 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-medium">Wedding Highlight Film</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">The Johnson Wedding</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Cinematic highlight film</p>
            </div>
          </div>

          {/* Portfolio Item 2 */}
          <div className="portfolio-item bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-64 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="font-medium">Conference App</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">TechSummit 2023 App</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Custom mobile app</p>
            </div>
          </div>

          {/* Portfolio Item 3 */}
          <div className="portfolio-item bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-64 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-medium">Corporate Event</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">GlobalTech Annual Gala</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Full event coverage</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            View Full Portfolio
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;