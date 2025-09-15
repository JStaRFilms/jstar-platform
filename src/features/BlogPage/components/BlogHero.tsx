
import React from 'react';

const BlogHero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Insights</span> on Creativity, Technology & Faith
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Articles, tutorials, and thoughts on video production, app development, AI tools,
            and the intersection of faith with creative work.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 bg-jstar-blue/20 text-jstar-blue rounded-full text-sm">Video Production</span>
            <span className="px-3 py-1 bg-faith-purple/20 text-faith-purple rounded-full text-sm">App Development</span>
            <span className="px-3 py-1 bg-growth-green/20 text-growth-green rounded-full text-sm">AI Tools</span>
            <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">Faith & Creativity</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
