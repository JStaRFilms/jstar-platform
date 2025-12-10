'use client';

import React from 'react';
import { PROFILE_DATA } from '../data/portfolio';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutHero = () => {
  const { ref: containerRef, isVisible } = useScrollAnimation({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={containerRef} className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-jstar-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-faith-purple/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-30 animate-pulse animation-delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl">
          <div
            className={`inline-block px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up' : ''}`}
          >
            <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent font-medium text-sm tracking-wide uppercase">
              The Creative Operating System
            </span>
          </div>

          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-1' : ''}`}>
            Hello, I'm <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {PROFILE_DATA.name}
            </span>
          </h1>

          {/* Role/Title */}
          <h2 className={`text-xl md:text-2xl font-medium mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-2' : ''}`}>
            {PROFILE_DATA.role}
          </h2>

          {/* Intro Text */}
          <p className={`text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mb-10 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-3' : ''}`}>
            {PROFILE_DATA.about}
          </p>

          <div className={`flex flex-wrap gap-4 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-4' : ''}`}>
            <a
              href={PROFILE_DATA.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-white/20"
            >
              <span>Contact Me</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              href="/portfolio"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 backdrop-blur-md transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1"
            >
              View Work
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in delay-1000' : ''}`}>
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default AboutHero;
