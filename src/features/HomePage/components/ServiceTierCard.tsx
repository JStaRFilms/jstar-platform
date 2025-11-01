import React from 'react';
import Link from 'next/link';
import { CheckIcon } from '../../../components/icons/static-icons';
import { ServiceTier } from '../../../content/services';

interface ServiceTierCardProps {
  tier: ServiceTier;
}

const ServiceTierCard: React.FC<ServiceTierCardProps> = ({ tier }) => {
  const isFeatured = tier.isFeatured;

  return (
    <article
      className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
        isFeatured
          ? 'ring-2 ring-primary dark:ring-accent shadow-xl scale-105'
          : 'hover:shadow-xl'
      }`}
      role="article"
      aria-labelledby={`tier-${tier.id}-title`}
      aria-describedby={`tier-${tier.id}-description`}
    >
      {isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-6">
          <h3
            id={`tier-${tier.id}-title`}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {tier.name}
          </h3>
          <p
            id={`tier-${tier.id}-description`}
            className="text-gray-600 dark:text-gray-400"
          >
            {tier.description}
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            ₦{tier.price.amount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            per {tier.price.period}
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              What's Included:
            </h4>
            <ul className="space-y-3">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Key Deliverables:
            </h4>
            <ul className="space-y-2">
              {tier.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary dark:bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm">
                    {deliverable}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="#contact"
            className={`inline-block px-8 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isFeatured
                ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={`Get started with ${tier.name}`}
          >
            Choose {tier.name}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ServiceTierCard;
