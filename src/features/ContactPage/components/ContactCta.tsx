
import React from 'react';
import Link from 'next/link';

const ContactCta = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-jstar-blue to-faith-purple">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Bring Your Vision to Life?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Whether you're planning a wedding, developing an app, or growing your creative business with AI tools,
          I'm here to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#contact-form" className="px-8 py-4 bg-white text-jstar-blue font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors">
            Send a Message
          </Link>
          <a href="#" className="px-8 py-4 bg-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/30 transition-colors">
            Schedule a Call
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCta;
