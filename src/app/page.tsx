import React from 'react';
import HeroSection from '@/features/HomePage/components/HeroSection';
import ManifestoSection from '@/features/HomePage/components/ManifestoSection';
import CapabilitiesSection from '@/features/HomePage/components/CapabilitiesSection';
import PortfolioSection from '@/features/HomePage/components/PortfolioSection';
import FounderStorySection from '@/features/HomePage/components/FounderStorySection';
import TestimonialsSection from '@/features/HomePage/components/TestimonialsSection';
import ProjectInquirySection from '@/features/HomePage/components/ProjectInquirySection';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { MagneticCursor } from '@/components/motion/MagneticCursor';

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <MagneticCursor />
      <main className="min-h-screen bg-ink-black text-ghost-white selection:bg-chartreuse selection:text-ink-black">
        <HeroSection />
        <ManifestoSection />
        <CapabilitiesSection />
        <PortfolioSection />
        <FounderStorySection />
        <TestimonialsSection />
        <ProjectInquirySection />
      </main>
    </SmoothScrollProvider>
  );
}
