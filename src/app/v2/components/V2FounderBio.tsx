'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrambleText from './ScrambleText';
import KineticBorderCard from './KineticBorderCard';
import { Trophy, Mic, Music, ArrowUpRight, Box } from 'lucide-react';

export const V2FounderBio: React.FC = () => {
  return (
    <section id="founder" className="py-28 px-6 bg-ink-black relative border-b border-powder-blue/15">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono text-chartreuse uppercase tracking-widest block">
            <ScrambleText text="05 // THE FOUNDER & ARCHITECT" />
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
            John Oluleke-Oke
          </h2>
          <p className="text-sm sm:text-base font-mono text-chartreuse">
            Creative Technologist · Filmmaker · Product Software Engineer · National Speedcubing Champion
          </p>
        </div>

        {/* Bento Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Story (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-chartreuse/40 flex-shrink-0 shadow-lg">
                  <Image
                    src="/me/me2.jpg"
                    alt="John Oluleke-Oke"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-ghost-white">John Oluleke-Oke</h3>
                  <p className="text-xs font-mono text-powder-blue/70">Lagos, Nigeria · Global Remote</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-chartreuse animate-pulse" />
                    <span className="text-[11px] font-mono text-chartreuse font-bold">FOUNDER & DIRECTOR</span>
                  </div>
                </div>
              </div>

              <blockquote className="text-base sm:text-lg text-ghost-white/90 font-light leading-relaxed italic border-l-2 border-chartreuse pl-4 py-1">
                {`"Solving problems at high speed is my baseline. Whether it's finding the shortest rotation path for a Rubik's cube under 12 seconds or architecting an offline neural inference pipeline in Python, I obsess over elegance, zero latency, and cinematic emotion."`}
              </blockquote>

              {/* Achievement Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-ink-black border border-powder-blue/10 space-y-1">
                  <div className="flex items-center gap-2 text-chartreuse text-xs font-mono font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Gold Medals</span>
                  </div>
                  <span className="text-[11px] text-powder-blue/70 block">National Speedcube</span>
                </div>

                <div className="p-3.5 rounded-xl bg-ink-black border border-powder-blue/10 space-y-1">
                  <div className="flex items-center gap-2 text-toffee-brown text-xs font-mono font-bold">
                    <Mic className="w-3.5 h-3.5" />
                    <span>TEDx Speaker</span>
                  </div>
                  <span className="text-[11px] text-powder-blue/70 block">Elizade University</span>
                </div>

                <div className="p-3.5 rounded-xl bg-ink-black border border-powder-blue/10 space-y-1">
                  <div className="flex items-center gap-2 text-powder-blue text-xs font-mono font-bold">
                    <Music className="w-3.5 h-3.5" />
                    <span>ABRSM Sax</span>
                  </div>
                  <span className="text-[11px] text-powder-blue/70 block">Alto Grade 5</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-powder-blue/10 flex items-center justify-between text-xs font-mono">
              <span className="text-powder-blue/60">Official WCA ID: 2022JOHN41</span>
              <Link href="/about" className="text-chartreuse font-bold flex items-center gap-1 hover:underline">
                <span>Read Full Biography & Timeline</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Speedcubing & Technical Benchmark Card (5 Cols) */}
          <div className="lg:col-span-5">
            <KineticBorderCard glowColor="#B5E619" className="h-full">
              <div className="h-full flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-chartreuse mb-4">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Box className="w-4 h-4" />
                      <span>SPEEDCUBING BENCHMARKS</span>
                    </div>
                    <span className="text-powder-blue/60">OFFICIAL WCA</span>
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="p-4 rounded-2xl bg-ink-black border border-powder-blue/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-powder-blue/60 uppercase">3x3x3 Single PR</span>
                        <h4 className="text-2xl font-bold font-mono text-chartreuse">11.73s</h4>
                      </div>
                      <span className="text-xs font-mono text-ghost-white font-semibold">National Podiums</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-ink-black border border-powder-blue/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-powder-blue/60 uppercase">2x2x2 Single PR</span>
                        <h4 className="text-2xl font-bold font-mono text-toffee-brown">3.53s</h4>
                      </div>
                      <span className="text-xs font-mono text-ghost-white font-semibold">National Gold</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-ink-black border border-powder-blue/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-powder-blue/60 uppercase">Directed Output</span>
                        <h4 className="text-2xl font-bold font-mono text-ghost-white">280+ Masters</h4>
                      </div>
                      <span className="text-xs font-mono text-powder-blue/80 font-semibold">176K+ Views</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-mono text-powder-blue/70 leading-relaxed pt-2 border-t border-powder-blue/10">
                  High-speed 3D spatial pattern recognition translates directly into clean software architecture, rapid debugging intuition, and frame-accurate editing tempo.
                </p>
              </div>
            </KineticBorderCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2FounderBio;
