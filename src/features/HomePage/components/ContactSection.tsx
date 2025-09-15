
import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-gradient-to-r from-jstar-blue to-faith-purple">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Create Something Amazing?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Whether you need cinematic video production, custom app development, or AI-powered creator tools, 
          let's bring your vision to life with purpose and excellence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="btn-enhanced px-8 py-4 bg-white text-jstar-blue font-bold rounded-xl text-lg hover:bg-gray-100">
            Start Your Project
          </button>
          <button className="btn-enhanced px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-bold rounded-xl text-lg hover:bg-white/20">
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
