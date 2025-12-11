'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PROFILE_DATA } from '../data/portfolio';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Code, Video, Youtube, ExternalLink } from 'lucide-react';
import { HeroImageCarousel } from './HeroImageCarousel';

const HERO_IMAGES = {
  tech: [
    '/me/me.jpg', // Main professional headshot
    '/me/sax.jpg',         // New upload
    '/me/me3.jpg',         // New upload
    '/me/me2.jpg',
  ],
  creator: [
    '/me/mobile-cam.jpg',
    '/me/thumbnail.jpg',
    '/me/mobile-cam2.jpg',
    '/me/cam.jpg',
  ]
};

const AboutHero = () => {
  const { ref: containerRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1
  });

  const [mode, setMode] = useState<'tech' | 'creator'>('tech');

  return (
    <section ref={containerRef} className="relative min-h-[95vh] flex items-center overflow-hidden bg-black selection:bg-white/20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000 pointer-events-none">
        {/* Tech Mode BG */}
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-slate-950 transition-opacity duration-1000 ${mode === 'tech' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 transition-opacity duration-1000 ${mode === 'tech' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 transition-opacity duration-1000 ${mode === 'tech' ? 'opacity-100' : 'opacity-0'}`} />

        {/* Creator Mode BG */}
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-purple-950/20 transition-opacity duration-1000 ${mode === 'creator' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 transition-opacity duration-1000 ${mode === 'creator' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-opacity duration-1000 ${mode === 'creator' ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-8 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <div className="order-2 md:order-1 relative z-20 pb-20 md:pb-0 -mt-54 md:mt-0">
            {/* Personality Toggle */}
            <div
              className={`inline-flex p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-8 cursor-pointer scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up' : ''}`}
            >
              <button
                onClick={() => setMode('tech')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${mode === 'tech' ? 'bg-jstar-blue text-white shadow-lg shadow-blue-500/25' : 'text-gray-400 hover:text-white'}`}
              >
                <Code className="w-3 h-3" />
                Technologist
              </button>
              <button
                onClick={() => setMode('creator')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${mode === 'creator' ? 'bg-faith-purple text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white'}`}
              >
                <Video className="w-3 h-3" />
                Filmmaker
              </button>
            </div>

            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.9] tracking-tight scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-1' : ''}`}>
              Hello, I'm <br />
              <span className={`bg-clip-text text-transparent bg-gradient-to-r transition-all duration-1000 ${mode === 'tech' ? 'from-white via-blue-200 to-blue-400' : 'from-white via-purple-200 to-pink-400'}`}>
                {PROFILE_DATA.name.split(' ')[0]}
              </span>.
            </h1>

            <h2 className={`text-xl md:text-2xl font-medium mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-2' : ''}`}>
              {PROFILE_DATA.role}
            </h2>

            <p className={`text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg mb-10 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-3' : ''}`}>
              {PROFILE_DATA.about}
            </p>

            <div className={`flex flex-wrap gap-4 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up scroll-stagger-4' : ''}`}>
              <a
                href={PROFILE_DATA.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 rounded-full bg-red-600 text-white font-bold transition-all duration-300 hover:bg-red-700 flex items-center gap-3 overflow-hidden shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 flex items-center gap-2">
                  <Youtube className="w-5 h-5 fill-current" />
                  Watch My Content
                </span>
              </a>

              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 backdrop-blur-md transition-all duration-300 flex items-center gap-2 hover:-translate-y-1"
              >
                View Work
                <ExternalLink className="w-4 h-4 opacity-50" />
              </Link>
            </div>
          </div>

          {/* Right: Hero Image Carousel */}
          <div className={`order-1 md:order-2 relative h-[50vh] md:h-auto w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-1/2 z-10 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in delay-500' : ''}`}>
            {/* Image Mask Wrapper */}
            <div className="absolute inset-x-4 bottom-0 top-0 md:inset-0 md:left-[-20%] z-10 flex items-end justify-center md:items-center">
              <div
                className="relative w-full h-full md:h-[90%] opacity-90 transition-all duration-700 hover:scale-[1.02] rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
              >
                <HeroImageCarousel
                  mode={mode}
                  images={HERO_IMAGES}
                />
                {/* Mobile Gradient Overlay */}
                <div className="md:hidden absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black pointer-events-none z-10" />
                {/* Inner Shadow/Gradient for depth */}
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none z-20" />

                {/* Desktop Mask Adjustment (Moved Inside to scale with image and prevent bleed) */}
                <div
                  className="hidden md:block absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent pointer-events-none z-30"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`hidden md:flex absolute bottom-10 left-10 md:left-1/2 md:-translate-x-1/2 animate-bounce z-20 scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in delay-1000' : ''}`}>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll-hint" />
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
