import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-bg min-h-screen flex items-center relative">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-black/50 to-transparent flex items-center justify-center">
          <div className="text-center text-white opacity-20">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg">Cinematic Background Video</p>
            <p className="text-sm opacity-75">60fps drone footage placeholder</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Brand Badge */}
          <div className="animate-fade-in-up mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <span className="w-2 h-2 bg-growth-green rounded-full mr-2 animate-pulse"></span>
              J StaR Films • Creative Operating System
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up animate-delay-1">
            Where Faith Meets <br />
            <span className="bg-gradient-to-r from-faith-purple to-growth-green bg-clip-text text-transparent">Film</span> and{' '}
            <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Future</span>
          </h1>

          {/* Subtitle (PRD Mission Statement) */}
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animate-delay-2">
            I build cinematic experiences that blend technical excellence with faith-inspired storytelling, 
            while creating AI-powered tools that help creators grow their impact and reach.
          </p>

          {/* CTA Buttons (Tier-aware - FR001) */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-in-up animate-delay-3">
            <button className="btn-enhanced px-8 py-4 bg-gradient-to-r from-jstar-blue to-faith-purple text-white font-bold rounded-xl text-lg">
              View My Work
            </button>
            <button className="btn-enhanced px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 font-bold rounded-xl text-lg">
              Explore Creator Tools
            </button>
          </div>

          {/* Lead Magnet (FR012) */}
          <div className="animate-fade-in-up animate-delay-3">
            <div className="inline-flex items-center bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-4 text-white cursor-pointer hover:bg-black/40 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-growth-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <div className="font-semibold">Free Resource: 10 Viral YouTube Title Formulas</div>
                <div className="text-sm text-gray-300">Download the exact templates I use to craft compelling titles</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Scroll to explore</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;