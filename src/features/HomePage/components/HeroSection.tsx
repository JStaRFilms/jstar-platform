
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSlideshow } from '../hooks/useSlideshow';
import { useHeroSlides } from '../hooks/useHeroSlides';
import { useSlideshowConfig } from '../hooks/useSlideshowConfig';
import { PlayCircleIcon } from '../../../components/icons/static-icons';
import { AnimatedIcon } from '../../../components/ui/AnimatedIcon';

/**
 * Interface defining the structure of a hero slide
 */
interface HeroSlide {
  /** Unique identifier for the slide */
  id: number | string;
  /** Tagline text displayed above the main title */
  tagline: string;
  /** First line of the main title */
  titleLine1: string;
  /** Second line of the main title */
  titleLine2: string;
  /** Description text for the slide */
  description: string;
  /** Image URL for the slide background */
  image?: string;
  /** Image URL for the slide background (database format) */
  imageUrl?: string;
  /** Tailwind gradient classes for the title text */
  gradient: string;
  /** Tailwind gradient classes for the primary button */
  buttonGradient: string;
  /** Tailwind border classes for the secondary button */
  buttonBorder: string;
  /** Tailwind text color classes for the secondary button */
  buttonText: string;
  /** Tailwind hover classes for the secondary button */
  buttonHover: string;
  /** Whether the slide is active and should be displayed */
  isActive?: boolean;
  /** Alt text for accessibility */
  altText?: string;
  /** Project title for overlay */
  projectTitle?: string;
  /** Project description for overlay */
  projectDesc?: string;
}

/**
 * Props interface for the HeroSection component
 */
interface HeroSectionProps {
  /** Optional custom slides to override defaults */
  customSlides?: HeroSlide[];
  /** Whether to show the statistics section (only on first slide) */
  showStats?: boolean;
  /** Custom interval for slide transitions in milliseconds */
  slideInterval?: number;
}

const slides = [
  {
    id: 0,
    tagline: 'Creative Vision, Technical Excellence',
    titleLine1: 'Elevate Your Story',
    titleLine2: 'With Purpose & Excellence',
    description: 'Transform your ideas into stunning visual experiences with professional video production, custom app development, and AI-powered creator tools.',
    image: undefined,
    gradient: 'from-primary to-accent',
    buttonGradient: 'from-primary to-accent',
    buttonBorder: 'border-primary dark:border-accent',
    buttonText: 'text-primary dark:text-accent',
    buttonHover: 'hover:bg-primary/10 dark:hover:bg-accent/10',
  },
  {
    id: 1,
    tagline: 'Faith-Driven Creative Solutions',
    titleLine1: 'Where Faith Meets',
    titleLine2: 'Innovation & Creativity',
    description: 'Empowering creators and businesses with purpose-driven content and technology solutions that make a lasting impact.',
    image: undefined,
    gradient: 'from-jstar-blue to-faith-purple',
    buttonGradient: 'from-jstar-blue to-faith-purple',
    buttonBorder: 'border-jstar-blue dark:border-faith-purple',
    buttonText: 'text-jstar-blue dark:text-faith-purple',
    buttonHover: 'hover:bg-jstar-blue/10 dark:hover:bg-faith-purple/10',
  },
];

/**
 * HeroSection - Main hero component for the homepage
 *
 * A dynamic, animated hero section featuring:
 * - Auto-advancing slideshow with manual controls
 * - Responsive design with mobile-first approach
 * - Animated background elements
 * - Gradient text effects and glassmorphism
 * - Statistics display for credibility
 * - Call-to-action buttons with hover effects
 *
 * @param props - Component props
 * @param props.customSlides - Optional custom slides to override defaults
 * @param props.showStats - Whether to show statistics section (default: true)
 * @param props.slideInterval - Custom slide transition interval in ms (default: 7000)
 * @returns JSX.Element - The rendered hero section
 *
 * @example
 * ```tsx
 * <HeroSection showStats={true} slideInterval={5000} />
 * ```
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  customSlides,
  showStats = true,
  slideInterval = 7000
}) => {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - Rules of Hooks
  // Fetch dynamic slides from API with fallback to defaults
  const { slides: dynamicSlides, loading, error } = useHeroSlides();

  // Fetch slideshow configuration
  const { config: slideshowConfig } = useSlideshowConfig();

  // Use custom slides if provided, otherwise use dynamic slides
  const allSlides = customSlides || dynamicSlides;

  // Filter to only show active slides on the homepage
  const activeSlides = allSlides.filter(slide => slide.isActive !== false);

  // Use dynamic configuration or fallback to props/defaults
  const finalSlideInterval = slideshowConfig.autoPlayEnabled
    ? slideshowConfig.autoPlayInterval
    : slideInterval;

  // Initialize slideshow hook with current slide count and configuration
  const { currentSlide, setCurrentSlide } = useSlideshow(
    activeSlides.length,
    finalSlideInterval
  );

  // Show loading state (AFTER all hooks are called)
  if (loading && !customSlides) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hero content...</p>
        </div>
      </section>
    );
  }

  // Show error state with fallback
  if (error && !customSlides && dynamicSlides.length === 0) {
    console.warn('Hero slides error, using fallback:', error);
  }

  return (
    <section className="relative min-h-screen overflow-visible">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-80 pb-20">
        <div className="relative w-full h-full">
          {activeSlides.map((slide, index) => {
            // Dynamic transition classes and styles based on configuration
            const getTransitionClasses = () => {
              const baseClasses = 'absolute inset-0 flex';

              switch (slideshowConfig.transitionEffect) {
                case 'slide':
                  return `${baseClasses} transition-transform ease-in-out ${
                    currentSlide === index
                      ? 'translate-x-0 opacity-100'
                      : index < currentSlide
                      ? '-translate-x-full opacity-0'
                      : 'translate-x-full opacity-0'
                  }`;
                case 'zoom':
                  return `${baseClasses} transition-all ease-in-out ${
                    currentSlide === index
                      ? 'scale-100 opacity-100'
                      : 'scale-95 opacity-0'
                  }`;
                case 'fade':
                default:
                  return `${baseClasses} transition-opacity ease-in-out ${
                    currentSlide === index ? 'opacity-100' : 'opacity-0'
                  }`;
              }
            };

            const getTransitionStyle = () => {
              return {
                transitionDuration: `${slideshowConfig.transitionDuration}ms`,
              };
            };

            return (
              <div
                key={slide.id}
                className={getTransitionClasses()}
                style={getTransitionStyle()}
                role="tabpanel"
                aria-labelledby={`slide-tab-${index}`}
                aria-hidden={currentSlide !== index}>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
                   {/* Text Content */}
                   <div className={`lg:w-1/2 text-center lg:text-left animate-fade-in-up ${slide.id === 1 ? 'lg:order-1' : ''}`}>
                     <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
                       slide.id === 0
                         ? 'bg-primary/10 text-primary dark:text-accent'
                         : 'bg-jstar-blue/10 text-jstar-blue dark:text-faith-purple'
                     }`}>
                       {slide.tagline}
                     </span>
                     <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                       <span className="text-foreground">{slide.titleLine1}</span>
                       <br />
                       <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                         slide.id === 0
                           ? 'from-primary to-accent'
                           : 'from-jstar-blue to-faith-purple'
                       }`}>
                         {slide.titleLine2}
                       </span>
                     </h1>
                     <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                       {slide.description}
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                       <Link href="#contact" className={`btn-enhanced px-8 py-4 bg-gradient-to-r ${slide.buttonGradient} text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300`}>
                         Start Your Project
                       </Link>
                       <Link href="#portfolio" className={`btn-enhanced px-8 py-4 bg-transparent border-2 ${slide.buttonBorder} ${slide.buttonText} rounded-full font-semibold ${slide.buttonHover} transition-all duration-300`}>
                         View Our Work
                       </Link>
                     </div>
                     {index === 0 && (
                        <div className="mt-10 flex items-center justify-center lg:justify-start space-x-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary dark:text-accent">10+</div>
                                <div className="text-muted-foreground">Years Experience</div>
                            </div>
                            <div className="h-12 w-px bg-border"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary dark:text-accent">200+</div>
                                <div className="text-muted-foreground">Projects Completed</div>
                            </div>
                            <div className="h-12 w-px bg-border"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary dark:text-accent">98%</div>
                                <div className="text-muted-foreground">Client Satisfaction</div>
                            </div>
                        </div>
                     )}
                   </div>

                   {/* Image Content */}
                   <div className={`lg:w-1/2 flex justify-center relative ${slide.id === 1 ? 'lg:order-2' : ''}`}>
                     <div className="relative w-full max-w-lg">
                       <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl -z-10"></div>
                       <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                         <Image src={slide.image || slide.imageUrl || ''} alt={slide.altText || "Video Production"} width={1074} height={716} className="w-full h-auto" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                           <div className="text-white">
                             <h3 className="text-xl font-bold mb-1">{slide.projectTitle || 'Latest Project'}</h3>
                             <p className="text-gray-200">{slide.projectDesc || 'Brand Storytelling for Tech Startup'}</p>
                           </div>
                         </div>
                         <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg">
                           <AnimatedIcon
                             animation="scale"
                             trigger="hover"
                             duration={300}
                             className="text-white"
                             aria-label="Play video"
                           >
                             <PlayCircleIcon className="w-8 h-8" />
                           </AnimatedIcon>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Slideshow Controls - Only show if indicators are enabled */}
      {slideshowConfig.showIndicators && activeSlides.length > 1 && (
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"
          role="tablist"
          aria-label="Hero slideshow navigation">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              id={`slide-tab-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black ${
                currentSlide === index
                  ? 'bg-primary dark:bg-accent opacity-100'
                  : 'bg-gray-300 dark:bg-gray-600 opacity-50 hover:opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1} of ${activeSlides.length}`}
              aria-selected={currentSlide === index}
              role="tab"
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <a href="#about" className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center scroll-indicator hidden lg:block">
          <div className="w-8 h-12 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center p-1">
              <div className="w-1 h-3 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">Scroll Down</span>
      </a>
    </section>
  );
};

export default HeroSection;
