
'use client';

import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VideoCameraIcon, CodeIcon, ShieldCheckIcon, CameraIcon, FilmIcon, MegaphoneIcon, DeviceMobileIcon, CheckIcon } from '../../../components/icons/static-icons';

// Enhanced TypeScript interfaces for comprehensive type safety
interface IconProps {
  className?: string;
}

interface PricingInfo {
  amount: number;
  currency: 'NGN';
  period: 'project' | 'package' | 'month';
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  features: string[];
  pricing: PricingInfo;
  image: string;
  popular?: boolean;
  category: 'main' | 'additional';
}

interface ServicesSectionProps {
  services?: ServiceItem[];
  showPricing?: boolean;
  showAdditionalServices?: boolean;
  onServiceClick?: (serviceId: string) => void;
}

// Default service data with enhanced structure
const defaultServices: ServiceItem[] = [
{
  id: 'video-production',
  title: 'Video Production',
  description: 'Professional video production services including concept development, filming, and post-production to create compelling visual stories.',
  icon: VideoCameraIcon,
  features: ['Pre-production planning', '4K cinematic filming', 'Professional editing & color grading'],
  pricing: { amount: 350000, currency: 'NGN', period: 'project' },
  image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80',
  popular: true,
  category: 'main'
},
{
  id: 'web-development',
  title: 'Web Development',
  description: 'Custom website development with modern technologies, responsive design, and seamless user experiences.',
  icon: CodeIcon,
  features: ['Responsive web design', 'Custom CMS development', 'E-commerce solutions'],
  pricing: { amount: 500000, currency: 'NGN', period: 'project' },
  image: 'https://images.unsplash.com/photo-1467232004584-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
  category: 'main'
},
{
  id: 'branding',
  title: 'Branding',
  description: 'Comprehensive branding solutions including logo design, brand identity, and visual language development.',
  icon: ShieldCheckIcon,
  features: ['Logo & identity design', 'Brand guidelines', 'Marketing collateral'],
  pricing: { amount: 250000, currency: 'NGN', period: 'package' },
  image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  category: 'main'
},
{
  id: 'photography',
  title: 'Photography',
  description: 'Professional photography services for products, events, and portraits.',
  icon: CameraIcon,
  features: ['Product photography', 'Event coverage', 'Portrait sessions'],
  pricing: { amount: 150000, currency: 'NGN', period: 'project' },
  image: '',
  category: 'additional'
},
{
  id: 'motion-graphics',
  title: 'Motion Graphics',
  description: 'Engaging motion graphics and animations for your brand.',
  icon: FilmIcon,
  features: ['2D/3D animations', 'Logo animations', 'Explainer videos'],
  pricing: { amount: 200000, currency: 'NGN', period: 'project' },
  image: '',
  category: 'additional'
},
{
  id: 'audio-production',
  title: 'Audio Production',
  description: 'Professional audio recording, editing, and sound design services.',
  icon: MegaphoneIcon,
  features: ['Voice recording', 'Sound design', 'Audio mixing'],
  pricing: { amount: 120000, currency: 'NGN', period: 'project' },
  image: '',
  category: 'additional'
},
{
  id: 'app-development',
  title: 'App Development',
  description: 'Custom mobile application development for iOS and Android.',
  icon: DeviceMobileIcon,
  features: ['iOS development', 'Android development', 'Cross-platform apps'],
  pricing: { amount: 800000, currency: 'NGN', period: 'project' },
  image: '',
  category: 'additional'
}];


/**
 * ServicesSection Component
 *
 * Professional services presentation component for J StaR Films homepage.
 * Displays main and additional services with pricing, features, and contact CTAs.
 *
 * @param services - Array of service items to display (defaults to defaultServices)
 * @param showPricing - Whether to show pricing information (default: true)
 * @param showAdditionalServices - Whether to show additional services section (default: true)
 * @param onServiceClick - Callback function when a service is clicked
 */
const ServicesSection: React.FC<ServicesSectionProps> = React.memo(({
  services = defaultServices,
  showPricing = true,
  showAdditionalServices = true,
  onServiceClick
}) => {
  // Performance optimizations with useMemo and useCallback
  const mainServices = useMemo(() =>
  services.filter((s) => s.category === 'main'),
  [services]
  );

  const additionalServices = useMemo(() =>
  services.filter((s) => s.category === 'additional'),
  [services]
  );

  const handleServiceClick = useCallback((serviceId: string) => {
    onServiceClick?.(serviceId);
  }, [onServiceClick]);

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-accent rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Comprehensive </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Creative Solutions</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We offer a full range of professional services to bring your creative vision to life with exceptional quality and attention to detail.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="grid" aria-label="Main services">
          {/* Service 1: Video Production */}
          <article
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            role="article"
            aria-labelledby={`service-video-production-title`}
            aria-describedby={`service-video-production-description`}>
            
            <div className="relative h-48 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80" alt="Video Production" fill className="object-cover transition-transform duration-500 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full">Popular</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Video Production</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                  <VideoCameraIcon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Professional video production services including concept development, filming, and post-production to create compelling visual stories.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Pre-production planning</span>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">4K cinematic filming</span>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Professional editing & color grading</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₦350,000</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/project</span>
                </div>
                <Link
                  href="#contact"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Get started with Video Production service`}
                  onClick={() => handleServiceClick('video-production')}>
                  
                  Get Started
                </Link>
              </div>
            </div>
          </article>

          {/* Service 2: Web Development */}
          <article
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            role="article"
            aria-labelledby={`service-web-development-title`}
            aria-describedby={`service-web-development-description`}>
            
            <div className="relative h-48 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1467232004584-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80" alt="Web Development" fill className="object-cover transition-transform duration-500 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 id={`service-web-development-title`} className="text-xl font-bold text-gray-900 dark:text-white">Web Development</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                  <CodeIcon className="w-5 h-5" />
                </div>
              </div>
              <p id={`service-web-development-description`} className="text-gray-600 dark:text-gray-400 mb-6">
                Custom website development with modern technologies, responsive design, and seamless user experiences.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Responsive web design</span>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Custom CMS development</span>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">E-commerce solutions</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₦500,000</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/project</span>
                </div>
                <Link
                  href="#contact"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Get started with Web Development service`}
                  onClick={() => handleServiceClick('web-development')}>
                  
                  Get Started
                </Link>
              </div>
            </div>
          </article>

          {/* Service 3: Branding */}
          <article
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            role="article"
            aria-labelledby={`service-branding-title`}
            aria-describedby={`service-branding-description`}>
            
            <div className="relative h-48 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Branding" fill className="object-cover transition-transform duration-500 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 id={`service-branding-title`} className="text-xl font-bold text-gray-900 dark:text-white">Branding</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
              </div>
              <p id={`service-branding-description`} className="text-gray-600 dark:text-gray-400 mb-6">
                Comprehensive branding solutions including logo design, brand identity, and visual language development.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Logo & identity design</span>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Brand guidelines</span>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-primary dark:text-accent mt-0.5 flex-shrink-0" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Marketing collateral</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₦250,000</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/package</span>
                </div>
                <Link
                  href="#contact"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Get started with Branding service`}
                  onClick={() => handleServiceClick('branding')}>
                  
                  Get Started
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* Additional Services */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Additional Services</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We offer a range of specialized services to meet all your creative needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary/10 dark:bg-accent/20 rounded-lg flex items-center justify-center text-primary dark:text-accent mb-4">
                <CameraIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Photography</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Professional photography services for products, events, and portraits.</p>
              <div className="mt-4">
                <span className="text-primary dark:text-accent font-medium">From ₦150,000</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary/10 dark:bg-accent/20 rounded-lg flex items-center justify-center text-primary dark:text-accent mb-4">
                <FilmIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Motion Graphics</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Engaging motion graphics and animations for your brand.</p>
              <div className="mt-4">
                <span className="text-primary dark:text-accent font-medium">From ₦200,000</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary/10 dark:bg-accent/20 rounded-lg flex items-center justify-center text-primary dark:text-accent mb-4">
                <MegaphoneIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Audio Production</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Professional audio recording, editing, and sound design services.</p>
              <div className="mt-4">
                <span className="text-primary dark:text-accent font-medium">From ₦120,000</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary/10 dark:bg-accent/20 rounded-lg flex items-center justify-center text-primary dark:text-accent mb-4">
                <DeviceMobileIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">App Development</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Custom mobile application development for iOS and Android.</p>
              <div className="mt-4">
                <span className="text-primary dark:text-accent font-medium">From ₦800,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Have a project in mind?</h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can bring your ideas to life with our professional services.
          </p>
          <Link href="#contact" className="inline-block px-8 py-3 bg-white text-primary rounded-full font-semibold hover:bg-opacity-90 transition-opacity">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>);

});

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;