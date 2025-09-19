
import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon, CheckIcon, ArrowRightIcon } from '../../../components/icons/static-icons';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-jstar-blue/10 text-jstar-blue rounded-full text-sm font-medium mb-4">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Choose Your Perfect <span className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">Plan</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Select the package that best fits your needs. All plans come with our 100% satisfaction guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Essential Plan */}
          <div className="pricing-card group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-jstar-blue/50 dark:hover:border-jstar-blue/50 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-4 right-6">
              <span className="bg-jstar-blue/10 text-jstar-blue text-xs font-semibold px-3 py-1 rounded-full">Starter</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Essential</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₦150,000</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">/project</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for small projects and getting started with professional web presence.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">3-5 Page Website</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Mobile-Responsive Design</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Basic SEO Optimization</span>
              </li>
              <li className="flex items-center text-gray-400">
                <CheckIcon className="h-5 w-5 mr-3 opacity-0" />
                <span>Premium Features</span>
              </li>
            </ul>
            <Link href="#contact" className="block w-full py-3 px-6 text-center rounded-lg border border-jstar-blue text-jstar-blue font-semibold hover:bg-jstar-blue hover:text-white transition-colors duration-300">
              Get Started
            </Link>
          </div>

          {/* Professional Plan */}
          <div className="pricing-card group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 border-jstar-blue/20 dark:border-faith-purple/20 transition-all duration-300 hover:border-jstar-blue/50 dark:hover:border-faith-purple/50 hover:-translate-y-2 md:scale-105 relative z-10">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-jstar-blue to-faith-purple text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Professional</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₦350,000</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">/project</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Ideal for established businesses looking for comprehensive digital solutions.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Up to 10 Pages</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Advanced Responsive Design</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Full SEO Optimization</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Content Management System</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-jstar-blue mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Basic Analytics Integration</span>
              </li>
            </ul>
            <Link href="#contact" className="block w-full py-3 px-6 text-center rounded-lg bg-gradient-to-r from-jstar-blue to-faith-purple text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              Choose Professional
            </Link>
          </div>

          {/* Custom Plan */}
          <div className="pricing-card group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-faith-purple/50 dark:hover:border-faith-purple/50 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-4 right-6">
              <span className="bg-faith-purple/10 text-faith-purple text-xs font-semibold px-3 py-1 rounded-full">Enterprise</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Custom</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">Custom</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">Quote</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Tailored solutions for complex projects and enterprise-level requirements.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-faith-purple mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited Pages</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-faith-purple mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Custom UI/UX Design</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-faith-purple mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Advanced SEO & Performance</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-faith-purple mr-3" />
                <span className="text-gray-700 dark:text-gray-300">E-commerce Integration</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-faith-purple mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Ongoing Support & Maintenance</span>
              </li>
            </ul>
            <Link href="#contact" className="block w-full py-3 px-6 text-center rounded-lg border border-faith-purple text-faith-purple font-semibold hover:bg-faith-purple hover:text-white transition-colors duration-300">
              Request Custom Quote
            </Link>
          </div>
        </div>

        {/* Features Comparison Table */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 font-semibold text-gray-900 dark:text-white">Features</th>
                  <th className="text-center py-4 font-semibold text-gray-900 dark:text-white">Essential</th>
                  <th className="text-center py-4 font-semibold text-gray-900 dark:text-white">Professional</th>
                  <th className="text-center py-4 font-semibold text-gray-900 dark:text-white">Custom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-4 text-gray-700 dark:text-gray-300">Pages</td>
                  <td className="text-center">3-5</td>
                  <td className="text-center">Up to 10</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-700 dark:text-gray-300">Responsive Design</td>
                  <td className="text-center"><CheckCircleIcon className="mx-auto h-5 w-5 text-jstar-blue" /></td>
                  <td className="text-center"><CheckCircleIcon className="mx-auto h-5 w-5 text-jstar-blue" /></td>
                  <td className="text-center"><CheckCircleIcon className="mx-auto h-5 w-5 text-jstar-blue" /></td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-700 dark:text-gray-300">SEO Optimization</td>
                  <td className="text-center">Basic</td>
                  <td className="text-center">Full</td>
                  <td className="text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-700 dark:text-gray-300">CMS Integration</td>
                  <td className="text-center"><CheckIcon className="mx-auto h-5 w-5 text-gray-400" /></td>
                  <td className="text-center"><CheckCircleIcon className="mx-auto h-5 w-5 text-jstar-blue" /></td>
                  <td className="text-center"><CheckCircleIcon className="mx-auto h-5 w-5 text-jstar-blue" /></td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-700 dark:text-gray-300">E-commerce</td>
                  <td className="text-center"><CheckIcon className="mx-auto h-5 w-5 text-gray-400" /></td>
                  <td className="text-center"><CheckIcon className="mx-auto h-5 w-5 text-gray-400" /></td>
                  <td className="text-center"><CheckCircleIcon className="mx-auto h-5 w-5 text-jstar-blue" /></td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-700 dark:text-gray-300">Support</td>
                  <td className="text-center">30 days</td>
                  <td className="text-center">90 days</td>
                  <td className="text-center">Ongoing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Not sure which plan is right for you?</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Our team is here to help you choose the perfect solution for your project. Let's discuss your needs.
          </p>
          <Link href="#contact" className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-jstar-blue to-faith-purple hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Schedule a Free Consultation
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
