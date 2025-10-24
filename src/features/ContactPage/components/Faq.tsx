
import React from 'react';

const Faq = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick answers to common questions about my services and process
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">What&apos;s your typical project timeline?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Wedding films typically take 4-6 weeks for delivery. App development projects vary from 2-6 months depending on complexity.
              AI tool implementations usually take 1-3 months. We&apos;ll discuss specific timelines during our initial consultation.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Do you work with clients outside Nigeria?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Absolutely! I work with clients worldwide through remote collaboration tools. For wedding cinematography,
              I&apos;m available for destination weddings with advance booking.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">What&apos;s included in your AI creator tools?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              My AI tools are designed specifically for content creators and include features like script generation,
              content ideation, YouTube optimization, and workflow automation. Each tool is customizable to your specific needs.
            </p>
          </div>
        </div>
      </div>
    </section>);

};

export default Faq;