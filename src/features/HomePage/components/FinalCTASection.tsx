
import React from 'react';
import Link from 'next/link';

/**
 * FinalCTASection component - The final call-to-action section of the homepage
 * Features a glassmorphism card with project consultation buttons and free creator bundle offer
 */
const FinalCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-jstar-blue to-faith-purple">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="glass-cta rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Create Something <span className="text-sacred-gold">Meaningful</span>?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you need cinematic video production, custom app development, or AI-powered creator tools, let's bring your vision to life with purpose and excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="mailto:contact@jstarfilms.com"
              className="inline-block px-8 py-4 bg-white text-jstar-blue font-bold rounded-xl text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Start Your Project
            </Link>
            <Link
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-bold rounded-xl text-lg hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              WhatsApp Consultation
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bundle-card rounded-xl p-5 flex items-start">
              <svg className="text-2xl text-sacred-gold mt-1 mr-4 flex-shrink-0 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Free Creator Resource Bundle</h3>
                <p className="text-white/80">Download our exclusive bundle of templates, guides, and resources used by professional creators.</p>
              </div>
              <button className="ml-auto px-4 py-2 bg-white text-jstar-blue rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-shrink-0">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
