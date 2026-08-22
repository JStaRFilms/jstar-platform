'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Hero3DCanvas } from '@/components/3d/Hero3DCanvas';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ArrowUpRight, Film, Cpu, Sparkles, Music } from 'lucide-react';

const CANONICAL_STATS = [
  { value: '280+', label: 'Videos Produced & Edited', sub: 'Broadcast, Documentary & Commercial' },
  { value: '176K+', label: 'Views Generated', sub: 'YouTube & Client Campaigns' },
  { value: '8+', label: 'Verified Brand Partners', sub: 'Enterprise & Creator Channels' },
  { value: '6+', label: 'Years Building', sub: 'Films, Code & Systems' },
];

const HERO_PILLARS = [
  { icon: Film, label: 'Cinematic Films', desc: 'Commercials, Docs & YouTube Strategy', href: '#capabilities' },
  { icon: Cpu, label: 'Software & Labs', desc: 'Local-first Desktop Apps & Modern Web', href: '#capabilities' },
  { icon: Sparkles, label: 'AI Creator Tools', desc: 'Custom LLMs & Creative Automation', href: '#capabilities' },
  { icon: Music, label: 'Creative Direction', desc: 'Holistic Audio & Visual Storytelling', href: '#founder' },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-ink-black text-ghost-white">
      {/* 1. Background Grid & Atmospheric Lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #AFC2D5 1px, transparent 1px), linear-gradient(to bottom, #AFC2D5 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
          }}
        />
        {/* Radial ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-toffee-brown/15 rounded-full filter blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-chartreuse/10 rounded-full filter blur-[120px]" />
      </div>

      {/* 2. Main Hero Content & 3D Centerpiece Layer */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Monospace HUD Metadata Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card/80 border border-powder-blue/20 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-chartreuse animate-pulse shadow-[0_0_8px_#B5E619]" />
              <span className="font-mono text-xs font-semibold tracking-wider text-powder-blue uppercase">
                J StaR Studios // Creative Technology
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
            >
              We build things <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-chartreuse via-ghost-white to-powder-blue">
                worth watching.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-powder-blue/90 max-w-xl font-normal leading-relaxed"
            >
              Where cinematic filmmaking meets intelligent software. We direct high-impact films, build local-first digital products, and engineer AI workflows for creators.
            </motion.p>

            {/* Primary & Secondary Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2 items-center"
            >
              <MagneticButton strength={0.4}>
                <Link
                  href="#inquiry"
                  data-cursor
                  data-cursor-text="START"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-chartreuse text-ink-black font-bold text-base shadow-glow-chartreuse hover:bg-chartreuse/90 hover:scale-[1.02] transition-all duration-300"
                >
                  Start a Project
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.3}>
                <Link
                  href="#selected-work"
                  data-cursor
                  data-cursor-text="EXPLORE"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-card/60 text-ghost-white border border-powder-blue/25 hover:border-chartreuse/60 hover:bg-card transition-all duration-300 text-sm font-medium"
                >
                  Explore Selected Work
                  <span className="text-powder-blue">↓</span>
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Optical Core */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Hero3DCanvas />
          </div>
        </div>
      </div>

      {/* 3. Canonical Metrics Strip */}
      <div className="max-w-7xl mx-auto px-6 w-full mt-10 mb-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-card/60 border border-powder-blue/15 backdrop-blur-xl">
          {CANONICAL_STATS.map((stat, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-chartreuse font-mono tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-ghost-white">
                {stat.label}
              </span>
              <span className="text-xs text-powder-blue/70">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Floating Hero Dock Tabs (Inspired by Finovate reference) */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HERO_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={idx}
                href={pillar.href}
                className="group flex items-center justify-between p-4 rounded-xl bg-card/40 hover:bg-card border border-powder-blue/10 hover:border-chartreuse/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-toffee-brown/20 group-hover:bg-chartreuse/20 flex items-center justify-center text-chartreuse transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono font-bold text-ghost-white group-hover:text-chartreuse transition-colors">
                      {pillar.label}
                    </span>
                    <span className="text-[11px] text-powder-blue/70">
                      {pillar.desc}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-powder-blue/40 group-hover:text-chartreuse transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
