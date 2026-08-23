'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  const [lagosTime, setLagosTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setLagosTime(new Intl.DateTimeFormat([], options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="py-16 px-6 sm:px-8 border-t border-[#AFC2D5]/15 bg-[#001514] text-[#FBFFFE] relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#AFC2D5]/10">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#B5E619] flex items-center justify-center font-black text-[#001514] text-base tracking-tighter">
                  JS
                </div>
                <span className="font-bold tracking-wider text-base uppercase text-[#FBFFFE]">
                  J StaR Studios
                </span>
              </div>
              <p className="text-sm text-[#AFC2D5] max-w-sm leading-relaxed mb-6">
                Creative technology studio engineering cinematic films, bespoke digital products, and intelligent AI tools.
              </p>
            </div>

            {/* Timezone Indicator */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-[#AFC2D5]/15 bg-[#001514] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#B5E619]" />
              <span className="text-xs font-mono text-[#AFC2D5]">
                Lagos, NG (WAT): <strong className="text-[#FBFFFE]">{lagosTime || '19:10:00'}</strong>
              </span>
            </div>
          </div>

          {/* Links: Disciplines */}
          <div className="md:col-span-3">
            <div className="text-xs font-mono uppercase tracking-widest text-[#B5E619] mb-4">
              Disciplines
            </div>
            <ul className="space-y-2.5 text-xs font-mono text-[#AFC2D5]">
              <li>
                <a href="#disciplines" className="hover:text-[#FBFFFE] transition-colors">
                  01 / J StaR Films
                </a>
              </li>
              <li>
                <a href="#disciplines" className="hover:text-[#FBFFFE] transition-colors">
                  02 / J StaR Labs
                </a>
              </li>
              <li>
                <a href="#disciplines" className="hover:text-[#FBFFFE] transition-colors">
                  03 / J StaR Intelligence
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-[#FBFFFE] transition-colors">
                  04 / Selected Work
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Connect */}
          <div className="md:col-span-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[#B5E619] mb-4">
              Connect & Signals
            </div>
            <ul className="space-y-2.5 text-xs font-mono text-[#AFC2D5]">
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FBFFFE] transition-colors flex items-center justify-between group"
                >
                  <span>YouTube Channel</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-[#B5E619] transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FBFFFE] transition-colors flex items-center justify-between group"
                >
                  <span>GitHub Repositories</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-[#B5E619] transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@jstarstudios.com"
                  className="hover:text-[#FBFFFE] transition-colors flex items-center justify-between group"
                >
                  <span>Direct Inquiries</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-[#B5E619] transition-colors" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#AFC2D5]/60">
          <div>© 2026 J StaR Studios. Designed & Engineered from scratch.</div>
          <div className="flex items-center gap-4">
            <span className="text-[#8E592F]">v4.0.0-PROD</span>
            <span>•</span>
            <a href="#about" className="hover:text-[#FBFFFE] transition-colors">
              John Oluleke-Oke
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
