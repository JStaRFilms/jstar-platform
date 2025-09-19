
import React from 'react';
import { LightBulbIcon, PenFancyIcon, CameraIcon, CommentsIcon, RocketIcon } from '../../../components/icons/static-icons';

const processSteps = [
  { 
    icon: LightBulbIcon, 
    title: 'Discovery', 
    description: 'We discuss your vision, goals, and values to understand what matters most to your project.'
  },
  { 
    icon: PenFancyIcon, 
    title: 'Strategy', 
    description: 'We develop a tailored plan that aligns with your purpose and technical requirements.'
  },
  { 
    icon: CameraIcon, 
    title: 'Creation', 
    description: 'We bring your vision to life with technical excellence and creative passion.'
  },
  { 
    icon: CommentsIcon, 
    title: 'Refinement', 
    description: 'You review the work and provide feedback for any necessary revisions.'
  },
  { 
    icon: RocketIcon, 
    title: 'Launch', 
    description: 'Final files are delivered and we ensure everything is perfect for your launch.'
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-jstar-blue/10 text-jstar-blue rounded-full text-sm font-medium mb-4">
            How We Work
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Our <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Creative Process</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A proven approach to delivering exceptional results, from initial concept to final delivery, with faith and excellence at every step.
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-jstar-blue to-faith-purple animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-12 md:gap-x-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="process-step group relative text-center">
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-200 dark:border-gray-700 group-hover:border-jstar-blue transition-colors duration-300">
                      <Icon className="w-8 h-8 text-jstar-blue group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4">{index + 1}. {step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
