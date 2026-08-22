'use client';

import React from 'react';
import Link from 'next/link';
import { businessInfo } from '../../content/contact';
import { Youtube, Linkedin, Instagram, Github, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-black text-ghost-white pt-20 pb-12 border-t border-powder-blue/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Col 1: Studio Identity (4 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-ghost-white tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-chartreuse animate-pulse" />
              <span>J StaR <span className="text-chartreuse">Studios</span></span>
            </Link>
            <p className="text-sm text-powder-blue/80 max-w-sm leading-relaxed">
              Creative Technology Studio. Directing cinematic media, architecting high-performance digital products, and building AI workflows for creators.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/JStaRFilms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-card border border-powder-blue/20 flex items-center justify-center text-powder-blue hover:text-chartreuse hover:border-chartreuse transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@jstarfilms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-card border border-powder-blue/20 flex items-center justify-center text-powder-blue hover:text-chartreuse hover:border-chartreuse transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/saxy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-card border border-powder-blue/20 flex items-center justify-center text-powder-blue hover:text-chartreuse hover:border-chartreuse transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/jstarfilms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-card border border-powder-blue/20 flex items-center justify-center text-powder-blue hover:text-chartreuse hover:border-chartreuse transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Studio Divisions (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-chartreuse">
              Studio Divisions
            </h4>
            <ul className="space-y-2 text-sm text-powder-blue/80">
              <li>
                <Link href="/#capabilities" className="hover:text-chartreuse transition-colors">
                  J StaR Films (Media & Post)
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-chartreuse transition-colors">
                  J StaR Labs (Web & Desktop Apps)
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-chartreuse transition-colors">
                  J StaR AI (Workflows & LLMs)
                </Link>
              </li>
              <li>
                <Link href="/john-gpt" className="hover:text-chartreuse transition-colors flex items-center gap-1">
                  <span>JohnGPT Assistant</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-chartreuse">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-powder-blue/80">
              <li>
                <Link href="/#selected-work" className="hover:text-chartreuse transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-chartreuse transition-colors">
                  About & Polymath
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-chartreuse transition-colors">
                  Full Archive
                </Link>
              </li>
              <li>
                <Link href="/#inquiry" className="hover:text-chartreuse transition-colors">
                  Project Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Telemetry & Status (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-chartreuse">
              Status
            </h4>
            <div className="p-3.5 rounded-xl bg-card border border-powder-blue/15 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-chartreuse animate-pulse" />
                <span className="text-xs font-mono font-bold text-ghost-white">Accepting Scopes</span>
              </div>
              <p className="text-[11px] font-mono text-powder-blue/70">
                Q3 / Q4 2026 Production Window Open
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-powder-blue/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-powder-blue/60">
          <p>© {currentYear} J StaR Studios. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-chartreuse transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-chartreuse transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
