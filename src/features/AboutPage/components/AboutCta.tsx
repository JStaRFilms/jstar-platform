
import React from 'react';
import Link from 'next/link';
import { PROFILE_DATA } from '../data/portfolio';

const AboutCta = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-jstar-blue to-faith-purple border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Create Something Extraordinary?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Whether you need cinematic production, AI-powered apps, or just want to talk cubes & code — I'm just a message away.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={PROFILE_DATA.socials.linkedin}
            target="_blank"
            className="flex items-center gap-2 px-8 py-4 bg-white text-jstar-blue font-bold rounded-xl text-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1"
          >
            Let's Connect
          </Link>

          <Link
            href={PROFILE_DATA.socials.whatsapp}
            target="_blank"
            className="flex items-center gap-2 px-8 py-4 bg-green-500/20 border border-green-500/30 text-white font-bold rounded-xl text-lg hover:bg-green-500/30 backdrop-blur-md transition-all transform hover:-translate-y-1"
          >
            WhatsApp Me
          </Link>

          <Link
            href={PROFILE_DATA.socials.email}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/20 backdrop-blur-md transition-all transform hover:-translate-y-1"
          >
            Send Email
          </Link>
        </div>
      </div>
    </section>);

};

export default AboutCta;