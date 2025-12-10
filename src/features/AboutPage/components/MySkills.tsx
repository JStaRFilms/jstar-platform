'use client';

import React from 'react';
import { PROFILE_DATA } from '../data/portfolio';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const MySkills = () => {
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
  const { ref: engRef, isVisible: isEngVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.2 });
  const { ref: creativeRef, isVisible: isCreativeVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-jstar-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-faith-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className={`text-center mb-16 scroll-animate-hidden ${isHeaderVisible ? 'scroll-animate-fade-in-up' : ''}`}>
          <h2 className="text-4xl font-bold text-white mb-6">
            Technical & Creative Arsenal
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            A hybrid skill set bridging the gap between complex engineering logic and cinematic storytelling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Engineering Skills */}
          <div
            ref={engRef}
            className={`bg-white/5 rounded-3xl p-10 border border-white/5 relative overflow-hidden group hover:border-jstar-blue/30 transition-all duration-500 scroll-animate-hidden ${isEngVisible ? 'scroll-animate-fade-in-left' : ''}`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-jstar-blue/20 flex items-center justify-center text-jstar-blue">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-jstar-blue to-blue-400 bg-clip-text text-transparent">
                  Engineering
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {PROFILE_DATA.skills.engineering.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-jstar-blue/10 border border-jstar-blue/20 rounded-lg text-blue-300 font-mono text-sm group-hover:bg-jstar-blue/20 transition-colors cursor-default hover:border-jstar-blue/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Creative Skills */}
          <div
            ref={creativeRef}
            className={`bg-white/5 rounded-3xl p-10 border border-white/5 relative overflow-hidden group hover:border-faith-purple/30 transition-all duration-500 scroll-animate-hidden ${isCreativeVisible ? 'scroll-animate-fade-in-right' : ''}`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-faith-purple/20 flex items-center justify-center text-faith-purple">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-faith-purple to-pink-400 bg-clip-text text-transparent">
                  Creative Production
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {PROFILE_DATA.skills.creative.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-faith-purple/10 border border-faith-purple/20 rounded-lg text-purple-300 font-mono text-sm group-hover:bg-faith-purple/20 transition-colors cursor-default hover:border-faith-purple/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MySkills;
