
import React from 'react';

const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            From the Blog
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Insights on creativity, technology, and faith.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <div className="blog-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-48 bg-gradient-to-br from-jstar-blue to-faith-purple flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Video Production</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                The 5 Secrets to Creating Viral YouTube Thumbnails
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Learn the proven techniques to create thumbnails that stop the scroll.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">Jan 15, 2024 • 8 min read</div>
            </div>
          </div>

          {/* Blog Post 2 */}
          <div className="blog-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-48 bg-gradient-to-br from-faith-purple to-growth-green flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">App Development</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Building Your First Mobile App with React Native
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                A step-by-step guide to creating your first mobile application.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">Jan 10, 2024 • 12 min read</div>
            </div>
          </div>

          {/* Blog Post 3 */}
          <div className="blog-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-48 bg-gradient-to-br from-growth-green to-jstar-blue flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">AI Tools</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                How AI is Changing the Game for Content Creators
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Exploring the impact of AI on the creative industry.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">Jan 5, 2024 • 6 min read</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Read More Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
