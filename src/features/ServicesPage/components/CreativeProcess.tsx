
import React from 'react';

const CreativeProcess = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            My <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Creative Process</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A proven approach to delivering exceptional results, from initial concept to final delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="process-step text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Discovery</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We discuss your vision, goals, and requirements to understand your unique needs.
            </p>
          </div>

          <div className="process-step text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-faith-purple to-growth-green rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Planning</h3>
            <p className="text-gray-600 dark:text-gray-400">
              I create a detailed project plan, timeline, and creative brief for your approval.
            </p>
          </div>

          <div className="process-step text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-growth-green to-jstar-blue rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Creation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              I bring your vision to life with professional production and attention to detail.
            </p>
          </div>

          <div className="process-step text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span className="text-white font-bold">4</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Review</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You review the work and provide feedback for any necessary revisions.
            </p>
          </div>

          <div className="process-step text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-faith-purple to-growth-green rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span className="text-white font-bold">5</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Delivery</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Final files are delivered in your preferred format with all necessary assets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeProcess;
