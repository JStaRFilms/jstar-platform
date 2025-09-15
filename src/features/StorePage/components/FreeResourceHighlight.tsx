
import React from 'react';

const FreeResourceHighlight = () => {
  return (
    <section id="free" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-jstar-blue to-faith-purple rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get Your Free Creator Bundle
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Download our exclusive bundle of templates, guides, and resources
                used by professional creators to enhance their workflow.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-white text-jstar-blue font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors">
                  Download Bundle
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 font-bold rounded-xl text-lg hover:bg-white/20 transition-colors">
                  View Contents
                </button>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">What's Included:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>5 Wedding Editing Templates</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>YouTube Thumbnail Design Guide</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Content Calendar Template</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Client Communication Templates</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Color Grading Cheat Sheet</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeResourceHighlight;
