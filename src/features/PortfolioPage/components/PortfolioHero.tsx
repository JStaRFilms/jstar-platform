
import React from 'react';

const PortfolioHero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          My <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Portfolio</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          A showcase of cinematic storytelling, innovative app development, and memorable event coverage.
          Each project reflects my commitment to excellence and faith-inspired creativity.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1 bg-jstar-blue/20 text-jstar-blue rounded-full text-sm">50+ Projects</span>
          <span className="px-3 py-1 bg-faith-purple/20 text-faith-purple rounded-full text-sm">1M+ Views</span>
          <span className="px-3 py-1 bg-growth-green/20 text-growth-green rounded-full text-sm">Global Clients</span>
        </div>
      </div>
    </section>
  );
};

export default PortfolioHero;
