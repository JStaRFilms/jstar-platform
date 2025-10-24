
import React from 'react';
import Link from 'next/link';

const AboutCta = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-jstar-blue to-faith-purple">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Interested in Working Together?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Whether you need cinematic video production, custom app development, or AI-powered creator tools,
          I&apos;d love to hear about your project.
        </p>
        <Link href="/contact" className="inline-block px-8 py-4 bg-white text-jstar-blue font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors">
          Let&apos;s Connect
        </Link>
      </div>
    </section>);

};

export default AboutCta;