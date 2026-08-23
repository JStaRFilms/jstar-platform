'use client';

import React from 'react';
import Link from 'next/link';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { MagneticCursor } from '@/components/motion/MagneticCursor';
import V2Hero from './components/V2Hero';
import V2Manifesto from './components/V2Manifesto';
import V2Capabilities from './components/V2Capabilities';
import V2Portfolio from './components/V2Portfolio';
import V2Founder from './components/V2Founder';
import V2Inquiry from './components/V2Inquiry';
import ScrambleText from './components/ScrambleText';
import { ArrowLeft, ExternalLink, Github, Youtube, Linkedin, Instagram } from 'lucide-react';

export default function V2LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <SmoothScrollProvider>
      <MagneticCursor />
      <div className="min-h-screen bg-ink-black text-ghost-white selection:bg-chartreuse selection:text-ink-black font-sans antialiased">
        {/* Architectural Sticky Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-ink-black/80 backdrop-blur-md border-b border-powder-blue/15">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-base font-extrabold tracking-tight text-ghost-white hover:text-chartreuse transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-chartreuse animate-pulse" />
              <span>J StaR <span className="text-chartreuse">Studios</span></span>
            </Link>

            {/* Navlinks */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-powder-blue/80">
              <a href="#capabilities" className="hover:text-chartreuse transition-colors">
                [ 01 // DIVISIONS ]
              </a>
              <a href="#work" className="hover:text-chartreuse transition-colors">
                [ 02 // SELECTED WORK ]
              </a>
              <Link href="/about" className="hover:text-chartreuse transition-colors">
                [ 03 // FOUNDER BIO ]
              </Link>
              <Link href="/john-gpt" className="hover:text-chartreuse transition-colors text-chartreuse font-bold">
                [ JOHNGPT AI ]
              </Link>
            </nav>

            <a
              href="#inquiry"
              className="px-4 py-2 rounded-full bg-chartreuse text-ink-black text-xs font-mono font-bold shadow-glow-chartreuse hover:bg-chartreuse/90 transition-all"
            >
              Start Project
            </a>
          </div>
        </header>

        {/* Main Landing Page Sequence */}
        <main>
          <V2Hero />
          <V2Manifesto />
          <V2Capabilities />
          <V2Portfolio />
          <V2Founder />
          <V2Inquiry />
        </main>

        {/* Minimalist Editorial Footer */}
        <footer className="py-16 px-6 bg-ink-black border-t border-powder-blue/15 text-xs font-mono text-powder-blue/60">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-chartreuse" />
              <span>J STAR STUDIOS © {currentYear} // ALL RIGHTS RESERVED</span>
            </div>

            <div className="flex items-center gap-6 text-powder-blue/80">
              <a href="https://github.com/JStaRFilms" target="_blank" rel="noopener noreferrer" className="hover:text-chartreuse">GITHUB</a>
              <a href="https://youtube.com/@jstarfilms" target="_blank" rel="noopener noreferrer" className="hover:text-chartreuse">YOUTUBE</a>
              <a href="https://www.linkedin.com/in/saxy/" target="_blank" rel="noopener noreferrer" className="hover:text-chartreuse">LINKEDIN</a>
              <a href="https://instagram.com/jstarfilms" target="_blank" rel="noopener noreferrer" className="hover:text-chartreuse">INSTAGRAM</a>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
