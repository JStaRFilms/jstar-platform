'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { LensType, LENSES } from './v3-theme';

interface V3NavigationProps {
  activeLens: LensType;
  onSelectLens: (lens: LensType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function V3Navigation({
  activeLens,
  onSelectLens,
  soundEnabled,
  onToggleSound,
}: V3NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Polymath', href: '#polymath' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 md:px-8 pt-4 pb-2 ${
        scrolled ? 'backdrop-blur-md bg-[#001514]/75 border-b border-[#AFC2D5]/10 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Mark */}
        <a href="#hero" className="group flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-[#001514] border border-[#AFC2D5]/30 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(181,230,25,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B5E619]/20 via-transparent to-[#8E592F]/20 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="font-mono font-bold text-lg text-[#FBFFFE] tracking-tighter">JS</span>
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#B5E619] shadow-[0_0_8px_#B5E619]" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-wider text-sm text-[#FBFFFE] uppercase group-hover:text-[#B5E619] transition-colors">
              J StaR <span className="font-mono text-xs text-[#AFC2D5] font-normal">/ STUDIOS</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#AFC2D5]/70">
              CREATIVE TECH
            </span>
          </div>
        </a>

        {/* Desktop Navigation Dock */}
        <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#001514]/80 border border-[#AFC2D5]/20 backdrop-blur-xl shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#AFC2D5] hover:text-[#FBFFFE] hover:bg-[#AFC2D5]/10 rounded-full transition-all duration-200"
            >
              {link.label}
            </a>
          ))}

          <div className="h-4 w-px bg-[#AFC2D5]/20 mx-1" />

          {/* Quick Lens Switcher Pills */}
          <div className="flex items-center gap-1 pl-1">
            {(['film', 'code', 'ai', 'polymath'] as LensType[]).map((lensId) => {
              const lens = LENSES[lensId];
              const isActive = activeLens === lensId;
              return (
                <button
                  key={lensId}
                  onClick={() => onSelectLens(lensId)}
                  title={`Switch to ${lens.label} view`}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-full uppercase transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#B5E619] text-[#001514] font-bold shadow-[0_0_12px_rgba(181,230,25,0.4)]'
                      : 'text-[#AFC2D5]/80 hover:text-[#FBFFFE] hover:bg-[#AFC2D5]/10'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-[#001514]' : 'bg-[#AFC2D5]/40'
                    }`}
                  />
                  {lens.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right Actions: Sound Toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable UI feedback audio' : 'Enable UI feedback audio'}
            className="w-9 h-9 rounded-full bg-[#001514]/60 border border-[#AFC2D5]/20 flex items-center justify-center text-[#AFC2D5] hover:text-[#B5E619] hover:border-[#B5E619]/40 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#B5E619]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <a
            href="#terminal"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#001514] bg-[#B5E619] hover:bg-[#B5E619]/90 transition-all duration-300 shadow-[0_0_20px_rgba(181,230,25,0.25)] hover:shadow-[0_0_25px_rgba(181,230,25,0.45)] hover:scale-[1.02]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-full bg-[#001514]/60 border border-[#AFC2D5]/20 flex items-center justify-center text-[#AFC2D5]"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#B5E619]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 rounded-xl bg-[#001514] border border-[#AFC2D5]/20 flex items-center justify-center text-[#FBFFFE]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-3 p-5 rounded-2xl bg-[#001514]/95 border border-[#AFC2D5]/20 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#AFC2D5]/60 uppercase">
              Select Lens Perspective
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['film', 'code', 'ai', 'polymath'] as LensType[]).map((lensId) => {
                const lens = LENSES[lensId];
                const isActive = activeLens === lensId;
                return (
                  <button
                    key={lensId}
                    onClick={() => {
                      onSelectLens(lensId);
                      setMobileOpen(false);
                    }}
                    className={`px-3 py-2 text-xs font-mono rounded-xl uppercase flex items-center justify-between border transition-all ${
                      isActive
                        ? 'bg-[#B5E619] text-[#001514] font-bold border-[#B5E619]'
                        : 'bg-[#001514] text-[#AFC2D5] border-[#AFC2D5]/15'
                    }`}
                  >
                    <span>{lens.label}</span>
                    <span className="text-[10px] opacity-70">
                      {lensId === 'film' ? '🎬' : lensId === 'code' ? '💻' : lensId === 'ai' ? '🤖' : '⚡'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#AFC2D5]/15" />

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm text-[#FBFFFE] hover:text-[#B5E619] font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#terminal"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center py-3 rounded-xl bg-[#B5E619] text-[#001514] font-bold uppercase text-xs tracking-wider shadow-[0_0_15px_rgba(181,230,25,0.3)]"
          >
            Start a Project
          </a>
        </div>
      )}
    </header>
  );
}
