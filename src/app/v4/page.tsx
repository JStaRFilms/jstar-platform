'use client';

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Disciplines from './components/Disciplines';
import SelectedWork from './components/SelectedWork';
import FounderStory from './components/FounderStory';
import ProofSection from './components/ProofSection';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';

export default function V4Page() {
  return (
    <div className="bg-[#001514] min-h-screen text-[#FBFFFE] selection:bg-[#B5E619] selection:text-[#001514] overflow-x-hidden">
      {/* Global Sticky Navigation */}
      <Navbar />

      {/* Main Experience Stream */}
      <main>
        {/* 00 / Hero Section */}
        <Hero />

        {/* 01 / Studio Thesis & Dual Brain */}
        <Manifesto />

        {/* 02 / Three Core Disciplines (Films, Labs, Intelligence) */}
        <Disciplines />

        {/* 03 / Selected Real Case Studies */}
        <SelectedWork />

        {/* 04 / Founder Spotlight (John Oluleke-Oke) */}
        <FounderStory />

        {/* 05 / Authentic Client Feedback */}
        <ProofSection />

        {/* 06 / Project Commission & Brief Trigger */}
        <ContactCTA />
      </main>

      {/* Minimalist Studio Footer */}
      <Footer />
    </div>
  );
}
