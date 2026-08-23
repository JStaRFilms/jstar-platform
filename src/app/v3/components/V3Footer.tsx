'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

export function V3Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-16 px-4 sm:px-6 md:px-8 border-t border-[#AFC2D5]/15 bg-[#001514] text-[#AFC2D5]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#AFC2D5]/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xl text-[#FBFFFE] tracking-tight">
                J StaR Studios
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#B5E619]/10 text-[#B5E619] font-mono text-[10px] uppercase font-bold border border-[#B5E619]/30">
                V3 Live
              </span>
            </div>
            <p className="text-xs font-mono text-[#AFC2D5]/80 max-w-md">
              Creative Technology Studio · High-Retention Films · Digital Platforms · Applied AI Systems
            </p>
          </div>

          {/* Quick Nav Links & Back to Top */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase">
            <a href="#hero" className="hover:text-[#B5E619] transition-colors">
              Hero
            </a>
            <a href="#manifesto" className="hover:text-[#B5E619] transition-colors">
              Manifesto
            </a>
            <a href="#capabilities" className="hover:text-[#B5E619] transition-colors">
              Capabilities
            </a>
            <a href="#showcase" className="hover:text-[#B5E619] transition-colors">
              Showcase
            </a>
            <a href="#polymath" className="hover:text-[#B5E619] transition-colors">
              Polymath
            </a>
            <a href="#terminal" className="hover:text-[#B5E619] transition-colors">
              Terminal
            </a>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-[#001514] border border-[#AFC2D5]/30 flex items-center justify-center hover:border-[#B5E619] hover:text-[#B5E619] transition-colors ml-2"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Status Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B5E619] animate-pulse" />
            <span className="text-[#FBFFFE]">STUDIO STATUS:</span>
            <span className="text-[#B5E619]">AVAILABLE FOR SELECT COMMISSIONS</span>
          </div>

          <div className="flex items-center gap-4 text-[#AFC2D5]/70">
            <span>© {new Date().getFullYear()} J StaR Studios. All rights reserved.</span>
            <span>·</span>
            <span>LAGOS & GLOBAL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
