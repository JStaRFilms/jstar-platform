
import React from 'react';

const AboutHero = () => {
  return (
    <section className="hero-bg min-h-[60vh] flex items-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">John Oluleke-Oke</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Filmmaker, app developer, and AI creator building faith-inspired content and tools that empower creators worldwide.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-jstar-blue/20 text-jstar-blue rounded-full text-sm">Filmmaker</span>
            <span className="px-3 py-1 bg-faith-purple/20 text-faith-purple rounded-full text-sm">Developer</span>
            <span className="px-3 py-1 bg-growth-green/20 text-growth-green rounded-full text-sm">AI Creator</span>
            <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">Faith-Driven</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
