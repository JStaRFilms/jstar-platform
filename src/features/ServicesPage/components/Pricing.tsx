
import React from 'react';
import Link from 'next/link';

const Pricing = () => {
  return (
    <section id="pricing" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Transparent <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Flexible pricing options to suit projects of all sizes. Custom packages available for complex requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Package */}
          <div className="pricing-card bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₦150,000</span>
              <span className="text-gray-600 dark:text-gray-400">/project</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">3-5 minute highlight film</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Basic color grading</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">1 revision round</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Delivery in 7-10 days</span>
              </li>
              <li className="flex items-center opacity-50">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span className="text-gray-500 dark:text-gray-500 line-through">Drone footage</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium Package (Featured) */}
          <div id="video-pricing" className="pricing-card featured bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 border-jstar-blue">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-jstar-blue to-faith-purple text-white px-4 py-1 rounded-bl-lg rounded-tr-xl font-bold">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₦350,000</span>
              <span className="text-gray-600 dark:text-gray-400">/project</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">5-8 minute highlight film</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Professional color grading</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Drone footage included</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">2 revision rounds</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Delivery in 5-7 days</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          {/* Enterprise Package */}
          <div className="pricing-card bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Full-length documentary</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Advanced color grading</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Unlimited revisions</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Priority delivery</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Dedicated project manager</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Need a custom solution or have specific requirements? Let&apos;s discuss your project.
          </p>
          <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Schedule a Consultation
            <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>);

};

export default Pricing;