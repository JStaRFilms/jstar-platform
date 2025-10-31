
import React from 'react';
import { founderData } from '../../../content/about-me';

const AboutHero = () => {
  return (
    <section className="hero-bg min-h-[60vh] flex items-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">{founderData.name}</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {founderData.bio}
          </p>
          <div className="flex flex-wrap gap-3">
            {founderData.tags.map((tag, index) => (
              <span key={index} className={`px-3 py-1 ${
                index === 0 ? 'bg-jstar-blue/20 text-jstar-blue' :
                index === 1 ? 'bg-faith-purple/20 text-faith-purple' :
                index === 2 ? 'bg-growth-green/20 text-growth-green' :
                'bg-white/10 text-white'
              } rounded-full text-sm`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
