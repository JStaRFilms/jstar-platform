
import React from 'react';
import Link from 'next/link';

const ServicesHero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Professional <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Services</span> for Creators & Businesses
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              From cinematic storytelling to cutting-edge digital solutions, I help individuals and organizations
              amplify their message with technical excellence and faith-inspired purpose.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#video" className="px-6 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Video Services
              </Link>
              <Link href="#apps" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                App Development
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-jstar-blue/20 to-faith-purple/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-300">Projects</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm text-gray-300">Views</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-gray-300">Satisfaction</div>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-white">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Available for new projects
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
