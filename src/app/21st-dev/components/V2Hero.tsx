'use client';

import React from 'react';
import Link from 'next/link';
import MorphingHeadline from './MorphingHeadline';
import ScrambleText from './ScrambleText';
import V2MagneticButton from './V2MagneticButton';
import NeuralNoiseCanvas from './NeuralNoiseCanvas';
import { ArrowUpRight, Play, Terminal, Sparkles } from 'lucide-react';

const CYCLING_TERMS = [
  'WORTH WATCHING',
  'WORTH RUNNING',
  'HIGH RETENTION',
  'LOCALLY INFERRED',
  'ART DIRECTED',
];

export const V2Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 px-6 overflow-hidden border-b border-powder-blue/15">
      {/* Background Neural WebGL Canvas (Soft Ambient 25%) */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <NeuralNoiseCanvas color={[0.71, 0.90, 0.10]} opacity={0.35} speed={0.001} />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-12">
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-powder-blue/70">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-chartreuse animate-pulse" />
            <ScrambleText text="J_STAR_STUDIOS // CREATIVE_TECHNOLOGY" />
          </div>
          <div className="flex items-center gap-6">
            <ScrambleText text="STATUS: ACCEPTING_Q3_SCOPES" />
            <ScrambleText text="LOC: LAGOS_GLOBAL" />
          </div>
        </div>

        {/* Monumental Editorial Headline */}
        <div className="max-w-5xl space-y-6">
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-ghost-white leading-[1.02]">
            WE BUILD STORIES <br />
            <span className="text-powder-blue/80 font-normal">AND SOFTWARE</span> <br />
            <MorphingHeadline words={CYCLING_TERMS} />
          </h1>

          <p className="text-lg sm:text-2xl text-powder-blue/90 max-w-2xl font-light leading-relaxed">
            Independent creative studio directing high-retention cinematic media, full-stack software, and custom AI creator workflows.
          </p>
        </div>

        {/* Primary CTAs with Magnetic Spring Physics */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <V2MagneticButton
            variant="primary"
            onClick={() => {
              const el = document.getElementById('inquiry');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Initiate Project Scope</span>
            <ArrowUpRight className="w-4 h-4" />
          </V2MagneticButton>

          <V2MagneticButton
            variant="secondary"
            onClick={() => {
              const el = document.getElementById('work');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore Work Archive</span>
            <Terminal className="w-4 h-4" />
          </V2MagneticButton>
        </div>

        {/* Clean Architectural Metrics Grid (No sloppy pills) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-powder-blue/15">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-ghost-white tracking-tight">
              280<span className="text-chartreuse">+</span>
            </span>
            <p className="text-xs font-mono uppercase tracking-wider text-powder-blue/70">
              <ScrambleText text="Videos Produced & Directed" />
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-ghost-white tracking-tight">
              176K<span className="text-chartreuse">+</span>
            </span>
            <p className="text-xs font-mono uppercase tracking-wider text-powder-blue/70">
              <ScrambleText text="Organic Audience Views" />
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-ghost-white tracking-tight">
              8<span className="text-chartreuse">+</span>
            </span>
            <p className="text-xs font-mono uppercase tracking-wider text-powder-blue/70">
              <ScrambleText text="Partner Channels & Orgs" />
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-ghost-white tracking-tight">
              11.73<span className="text-chartreuse">s</span>
            </span>
            <p className="text-xs font-mono uppercase tracking-wider text-powder-blue/70">
              <ScrambleText text="National Speedcube Record" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V2Hero;
