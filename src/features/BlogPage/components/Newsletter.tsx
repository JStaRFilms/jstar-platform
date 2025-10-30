
import React from 'react';

const Newsletter = () => {
  return (
    <section id="subscribe" className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Subscribe to My Newsletter
        </h2>
        <p className="text-xl text-muted mb-8">
          Get the latest insights on creativity, technology, and faith delivered straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white" />
          <button className="px-8 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
