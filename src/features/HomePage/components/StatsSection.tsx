
import React from 'react';

const StatsSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in-up">
            <div className="text-3xl font-bold text-jstar-blue mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400">Video Projects</div>
          </div>
          <div className="animate-fade-in-up animate-delay-1">
            <div className="text-3xl font-bold text-faith-purple mb-2">15+</div>
            <div className="text-gray-600 dark:text-gray-400">Apps Developed</div>
          </div>
          <div className="animate-fade-in-up animate-delay-2">
            <div className="text-3xl font-bold text-growth-green mb-2">1M+</div>
            <div className="text-gray-600 dark:text-gray-400">Views Generated</div>
          </div>
          <div className="animate-fade-in-up animate-delay-3">
            <div className="text-3xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent mb-2">5+</div>
            <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
