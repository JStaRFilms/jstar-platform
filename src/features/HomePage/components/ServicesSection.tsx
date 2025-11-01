
'use client';

import React from 'react';
import Link from 'next/link';
import { serviceTiers } from '../../../content/services';
import ServiceTierCard from './ServiceTierCard';

/**
 * ServicesSection Component
 *
 * Professional services presentation component for J StaR Films homepage.
 * Displays partnership tiers with features, deliverables, and contact CTAs.
 */
const ServicesSection: React.FC = React.memo(() => {

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-accent rounded-full text-sm font-medium mb-4">
            Partnership Tiers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Strategic </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Partnership Models</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the partnership tier that aligns with your vision and goals. Each tier is designed to deliver exceptional results and lasting impact.
          </p>
        </div>

        {/* Partnership Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" role="grid" aria-label="Partnership tiers">
          {serviceTiers.map((tier) => (
            <ServiceTierCard key={tier.id} tier={tier} />
          ))}
        </div>

        {/* Custom Solution Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Have a Different Project in Mind?</h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
            Our tiers are just the beginning. We thrive on unique challenges. Let's discuss your specific vision and build a custom solution together.
          </p>
          <Link
            href="#contact"
            className="inline-block px-8 py-3 bg-white text-primary rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            Talk to Our Team
          </Link>
        </div>
      </div>
    </section>
  );

});

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;
