'use client';

import React from 'react';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { MagneticCursor } from '@/components/motion/MagneticCursor';
import V2Header from './components/V2Header';
import V2Hero from './components/V2Hero';
import V2Manifesto from './components/V2Manifesto';
import V2Capabilities from './components/V2Capabilities';
import V2SelectedWork from './components/V2SelectedWork';
import V2StudioLabs from './components/V2StudioLabs';
import V2FounderBio from './components/V2FounderBio';
import V2InquirySection from './components/V2InquirySection';
import V2Footer from './components/V2Footer';

export default function V2LandingPage() {
  return (
    <SmoothScrollProvider>
      <MagneticCursor />
      <div className="min-h-screen bg-ink-black text-ghost-white selection:bg-chartreuse selection:text-ink-black font-sans antialiased">
        {/* Architectural Sticky HUD Navigation */}
        <V2Header />

        {/* Main Experience Sequence */}
        <main>
          <V2Hero />
          <V2Manifesto />
          <V2Capabilities />
          <V2SelectedWork />
          <V2StudioLabs />
          <V2FounderBio />
          <V2InquirySection />
        </main>

        {/* Minimalist Editorial Footer */}
        <V2Footer />
      </div>
    </SmoothScrollProvider>
  );
}
