'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import V2MagneticButton from './V2MagneticButton';

export const V2Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-black/85 backdrop-blur-xl border-b border-powder-blue/15">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Identity */}
        <Link
          href="/v2"
          className="flex items-center gap-3 text-base font-extrabold tracking-tight text-ghost-white hover:text-chartreuse transition-colors group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-chartreuse animate-pulse shadow-glow-chartreuse" />
          <span className="tracking-tight">
            J StaR <span className="text-chartreuse group-hover:underline">Studios</span>
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-mono bg-powder-blue/10 text-powder-blue/80 border border-powder-blue/20">
            CREATIVE_TECH
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono text-powder-blue/80">
          <a href="#manifesto" className="hover:text-chartreuse transition-colors">
            [ 01 // PHILOSOPHY ]
          </a>
          <a href="#capabilities" className="hover:text-chartreuse transition-colors">
            [ 02 // DIVISIONS ]
          </a>
          <a href="#work" className="hover:text-chartreuse transition-colors">
            [ 03 // WORK ]
          </a>
          <a href="#labs" className="hover:text-chartreuse transition-colors">
            [ 04 // LABS ]
          </a>
          <a href="#founder" className="hover:text-chartreuse transition-colors">
            [ 05 // ARCHITECT ]
          </a>
          <Link
            href="/john-gpt"
            className="flex items-center gap-1 text-chartreuse font-bold hover:text-chartreuse/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>[ JOHNGPT AI ]</span>
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          <V2MagneticButton
            variant="primary"
            strength={0.25}
            onClick={() => {
              const el = document.getElementById('inquiry');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Start Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </V2MagneticButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-card border border-powder-blue/20 text-powder-blue hover:text-ghost-white focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ink-black/98 border-b border-powder-blue/15 px-6 py-6 space-y-4 font-mono text-xs text-powder-blue/90 animate-fadeIn">
          <a
            href="#manifesto"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-chartreuse border-b border-powder-blue/10"
          >
            [ 01 // PHILOSOPHY ]
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-chartreuse border-b border-powder-blue/10"
          >
            [ 02 // THREE DIVISIONS ]
          </a>
          <a
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-chartreuse border-b border-powder-blue/10"
          >
            [ 03 // SELECTED WORK ]
          </a>
          <a
            href="#labs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-chartreuse border-b border-powder-blue/10"
          >
            [ 04 // STUDIO LABS ]
          </a>
          <a
            href="#founder"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-chartreuse border-b border-powder-blue/10"
          >
            [ 05 // THE FOUNDER ]
          </a>
          <Link
            href="/john-gpt"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-chartreuse font-bold"
          >
            [ JOHNGPT MULTI-ENGINE AI ]
          </Link>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('inquiry');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 rounded-full bg-chartreuse text-ink-black font-bold font-mono text-xs text-center flex items-center justify-center gap-1.5"
            >
              <span>Initiate Project Scope</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default V2Header;
