
import React from 'react';
import Link from 'next/link';

const StoreHero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Digital Products</span> for Creators & Developers
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Professional courses, templates, and AI-powered tools designed to help you create
              exceptional content, build better applications, and grow your audience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#featured" className="px-6 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Shop Featured
              </Link>
              <Link href="#courses" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                View Courses
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-jstar-blue/20 to-faith-purple/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-white mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Limited Time Offer
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Bundle Deals Available</h3>
              <p className="text-gray-300">Save up to 40% when you purchase courses together</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">25+</div>
                <div className="text-sm text-gray-300">Products</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-300">Happy Creators</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHero;
