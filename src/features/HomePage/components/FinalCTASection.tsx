
'use client';

import React, { useState } from 'react';

/**
 * Props for the FinalCTASection component
 */
interface FinalCTASectionProps {
  /** Optional custom download URL - defaults to admin-configurable value */
  downloadUrl?: string;
  /** Optional callback for handling project start */
  onStartProject?: () => void;
  /** Optional callback for WhatsApp consultation */
  onWhatsAppConsultation?: () => void;
}

/**
 * FinalCTASection component - The final call-to-action section of the homepage
 * Features a glassmorphism card with project consultation buttons and free creator bundle offer
 *
 * @param props - Component props
 * @returns JSX.Element
 */
const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  downloadUrl = '/downloads/creator-bundle.zip',
  onStartProject,
  onWhatsAppConsultation
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Handles the start project action with authentication-aware routing
   */
  const handleStartProject = () => {
    if (onStartProject) {
      onStartProject();
    } else {
      // TODO: Implement authentication check
      // For now, redirect to contact page - will be enhanced with auth routing
      window.location.href = '/contact';
    }
  };

  /**
   * Handles WhatsApp consultation - can be calendar booking or direct WhatsApp
   */
  const handleWhatsAppConsultation = () => {
    if (onWhatsAppConsultation) {
      onWhatsAppConsultation();
    } else {
      // Default: Direct WhatsApp with prefilled message
      const message = encodeURIComponent(
        "Hi John! I'm interested in your services and would like to schedule a consultation."
      );
      window.open(`https://wa.me/2348152657887?text=${message}`, '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * Handles the download action
   */
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // TODO: Implement admin-configurable download URL
      // For now, simulate download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'creator-bundle.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <section
      className="py-20 bg-gradient-to-br from-jstar-blue to-faith-purple"
      aria-labelledby="cta-heading">

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="glass-cta rounded-2xl p-8 md:p-12">
          <header>
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl font-bold text-white mb-6">

              Ready to Create Something <span className="text-sacred-gold">Meaningful</span>?
            </h2>
          </header>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you need cinematic video production, custom app development, or AI-powered creator tools, let&apos;s bring your vision to life with purpose and excellence.
          </p>

          <nav aria-label="Primary actions" className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleStartProject}
              className="inline-block px-8 py-4 bg-white text-jstar-blue font-bold rounded-xl text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-jstar-blue"
              aria-label="Start your project - redirects to dashboard if logged in, or contact form if not">

              Start Your Project
            </button>
            <button
              onClick={handleWhatsAppConsultation}
              className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-bold rounded-xl text-lg hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Schedule a WhatsApp consultation with our team">

              WhatsApp Consultation
            </button>
          </nav>

          <aside aria-label="Free resource offer" className="max-w-2xl mx-auto">
            <div className="bundle-card rounded-xl p-5 flex items-start">
              <svg
                className="text-2xl text-sacred-gold mt-1 mr-4 flex-shrink-0 w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="presentation">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Free Creator Resource Bundle</h3>
                <p className="text-white/80">Download our exclusive bundle of templates, guides, and resources used by professional creators.</p>
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="ml-auto px-4 py-2 bg-white text-jstar-blue rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-jstar-blue flex-shrink-0"
                aria-label="Download free creator resource bundle">

                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>);

};

export default FinalCTASection;