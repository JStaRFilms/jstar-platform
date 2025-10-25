
import React from 'react';

const FeaturedProducts = () => {
  return (
    <section id="featured" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hand-picked digital products that will accelerate your creative journey and help you achieve your goals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="product-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg relative">
            <div className="tier-badge">
              <span className="px-3 py-1 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-full text-xs font-bold">
                BEST SELLER
              </span>
            </div>
            <div className="h-48 bg-gradient-to-br from-jstar-blue to-faith-purple flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <p className="font-medium">Complete Course</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">YouTube Virality Masterclass</h3>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                  Course
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                The complete system for creating viral YouTube content, from ideation to optimization.
                Used by creators who&apos;ve grown to 100K+ subscribers.
              </p>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {/* 5 stars */}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(128 reviews)</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₦45,000</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">₦60,000</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="product-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg relative">
            <div className="h-48 bg-gradient-to-br from-faith-purple to-growth-green flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p className="font-medium">Template Pack</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Wedding Film Editing Templates</h3>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs font-medium">
                  Templates
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Professional Premiere Pro and DaVinci Resolve templates for wedding filmmakers.
                Includes color grades, transitions, and lower thirds.
              </p>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {/* 4.5 stars */}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(86 reviews)</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₦15,000</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="product-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg relative">
            <div className="tier-badge">
              <span className="px-3 py-1 bg-growth-green text-white rounded-full text-xs font-bold">
                NEW
              </span>
            </div>
            <div className="h-48 bg-gradient-to-br from-growth-green to-jstar-blue flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                </div>
                <p className="font-medium">AI Tool</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">JohnGPT Creator Assistant</h3>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium">
                  Tool
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Your AI-powered creative partner that helps with content ideation, scriptwriting,
                and YouTube optimization. Works with any AI model.
              </p>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {/* 5 stars */}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(214 reviews)</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₦25,000</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/month</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default FeaturedProducts;