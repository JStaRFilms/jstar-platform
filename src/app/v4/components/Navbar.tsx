'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Films', href: '#disciplines', num: '01' },
    { label: 'Labs', href: '#disciplines', num: '02' },
    { label: 'Intelligence', href: '#disciplines', num: '03' },
    { label: 'Selected Work', href: '#work', num: '04' },
    { label: 'About', href: '#about', num: '05' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#001514]/85 backdrop-blur-md border-b border-[#AFC2D5]/10 py-3.5 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/v4" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#B5E619] flex items-center justify-center font-black text-[#001514] text-base tracking-tighter group-hover:scale-105 transition-transform">
            JS
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-sm text-[#FBFFFE] uppercase group-hover:text-[#B5E619] transition-colors">
              J StaR
            </span>
            <span className="text-[10px] font-mono text-[#AFC2D5]/70 tracking-widest uppercase">
              Creative Tech Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 border border-[#AFC2D5]/15 rounded-full px-6 py-2 bg-[#001514]/60 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-mono text-[#AFC2D5] hover:text-[#FBFFFE] transition-colors flex items-center gap-1.5 group"
            >
              <span className="text-[#B5E619]/60 group-hover:text-[#B5E619] transition-colors text-[10px]">
                {link.num}
              </span>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Status */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#AFC2D5]/80 bg-[#8E592F]/15 border border-[#8E592F]/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#B5E619] animate-pulse" />
            <span>Available for commissions</span>
          </div>
          <a
            href="#contact"
            className="flex items-center gap-2 bg-[#B5E619] hover:bg-[#c2f325] text-[#001514] px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-200 hover:shadow-[0_0_20px_rgba(181,230,25,0.4)]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#FBFFFE] p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#001514]/95 backdrop-blur-xl border-b border-[#AFC2D5]/15 px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-mono text-[#AFC2D5] hover:text-[#FBFFFE] py-2 border-b border-[#AFC2D5]/10"
              >
                <span>{link.label}</span>
                <span className="text-[#B5E619] text-xs">{link.num}</span>
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#B5E619] text-[#001514] px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
