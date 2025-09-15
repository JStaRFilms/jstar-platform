import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Filmmaker, app developer, and AI creator building faith-inspired content and tools.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">
                I'm John Oluleke-Oke, a creative technologist passionate about merging faith, technology, and storytelling. My journey began with wedding videography and has since expanded into app development and AI, all with the goal of empowering creators to share their message with the world.
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="w-48 h-48 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-5xl font-bold text-white">JO</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">John Oluleke-Oke</h3>
            <p className="text-gray-600 dark:text-gray-400">Filmmaker & Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;