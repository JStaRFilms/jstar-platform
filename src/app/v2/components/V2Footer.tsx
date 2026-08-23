'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Github, Youtube, Linkedin, Instagram, Sparkles } from 'lucide-react';

export const V2Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 px-6 bg-ink-black border-t border-powder-blue/15 text-xs font-mono text-powder-blue/70">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Footer Tier */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-powder-blue/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-base font-extrabold tracking-tight text-ghost-white">
              <span className="w-2.5 h-2.5 rounded-full bg-chartreuse animate-pulse" />
              <span>J StaR <span className="text-chartreuse">Studios</span></span>
            </div>
            <p className="text-xs text-powder-blue/60 max-w-sm">
              Cinematic media production, full-stack software development, and offline AI creator tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/JStaRFilms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-chartreuse transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GITHUB</span>
            </a>
            <a
              href="https://youtube.com/@jstarfilms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-chartreuse transition-colors"
            >
              <Youtube className="w-4 h-4" />
              <span>YOUTUBE</span>
            </a>
            <a
              href="https://www.linkedin.com/in/saxy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-chartreuse transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LINKEDIN</span>
            </a>
            <a
              href="https://instagram.com/jstarfilms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-chartreuse transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>INSTAGRAM</span>
            </a>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-powder-blue/50">
          <div className="flex items-center gap-4">
            <span>© {currentYear} J STAR STUDIOS // ALL RIGHTS RESERVED</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline text-chartreuse">OFFICIAL 5-COLOR SYSTEM</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/john-gpt" className="text-chartreuse hover:underline font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>JohnGPT Multi-Engine</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-ghost-white transition-colors cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default V2Footer;
