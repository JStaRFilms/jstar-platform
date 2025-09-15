
import React from 'react';

const FeaturedArticle = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Article</h2>
          <div className="blog-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-2/3">
                <div className="h-64 md:h-full bg-gradient-to-br from-jstar-blue to-faith-purple flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <p className="font-medium">Featured Article Banner</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-jstar-blue/20 text-jstar-blue rounded-full text-sm">Video Production</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">Tutorial</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  The 5 Secrets to Creating Viral YouTube Thumbnails
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Learn the proven techniques I use to create thumbnails that stop the scroll and drive massive engagement on YouTube.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-full flex items-center justify-center text-white font-bold mr-3">
                      JO
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">John Oluleke-Oke</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Jan 15, 2024 • 8 min read</div>
                    </div>
                  </div>
                  <button className="text-jstar-blue hover:text-faith-purple">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
