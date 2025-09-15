
import React from 'react';

const ContactHero = () => {
  return (
    <section className="hero-bg min-h-[50vh] flex items-center relative pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're looking for cinematic storytelling, custom app development, or AI-powered creator tools,
            I'm here to help bring your vision to life.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-jstar-blue/20 text-jstar-blue rounded-full text-sm">Wedding Cinematography</span>
            <span className="px-3 py-1 bg-faith-purple/20 text-faith-purple rounded-full text-sm">App Development</span>
            <span className="px-3 py-1 bg-growth-green/20 text-growth-green rounded-full text-sm">AI Creator Tools</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
