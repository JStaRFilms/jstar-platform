
'use client';

import React from 'react';
import { useTestimonialCarousel } from '../hooks/useTestimonialCarousel';
import { ChevronLeftIcon, ChevronRightIcon } from '../../../components/icons/static-icons';
import { testimonials } from '../../../content/testimonials';
import TestimonialCard from './TestimonialCard';


const TestimonialsSection = () => {
  const totalGroups = testimonials.length;
  const { currentIndex, prev, next, goToIndex } = useTestimonialCarousel(totalGroups, 999999); // Disable hook's auto-advance
  const [isPaused, setIsPaused] = React.useState(false);

  // Override auto-advance when paused
  React.useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, next]);

  const handleDotClick = (index: number) => {
    goToIndex(index);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-accent rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Creators & Brands</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hear what our clients have to say about working with us on their creative projects
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 active:scale-95 active:bg-primary active:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Previous testimonial">

            <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-active:scale-90" />
          </button>

          <div
            className="testimonials-container relative overflow-hidden min-h-[400px]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {testimonials.map((testimonial, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + totalGroups) % totalGroups;
              const isNext = index === (currentIndex + 1) % totalGroups;

              return (
                <div
                  key={index}
                  className={`absolute inset-0 flex justify-center items-center transition-all duration-500 ease-in-out ${
                    isActive
                      ? 'z-20 opacity-100 scale-100'
                      : isPrev || isNext
                      ? 'z-10 opacity-60 scale-95'
                      : 'z-0 opacity-0 scale-90'
                  }`}
                  style={{
                    transform: isActive
                      ? 'translateY(0) rotateY(0deg)'
                      : isPrev
                      ? 'translateY(-20px) translateX(-30px) rotateY(-5deg)'
                      : isNext
                      ? 'translateY(20px) translateX(30px) rotateY(5deg)'
                      : 'translateY(0) translateX(0) rotateY(0deg)'
                  }}
                >
                  <div
                    className="testimonial-slide"
                    style={{
                      minWidth: '350px',
                      maxWidth: '650px',
                      width: '80vw'
                    }}>
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={next}
            className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 active:scale-95 active:bg-primary active:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Next testimonial">

            <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-active:scale-90" />
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center mt-8 space-x-2 -mb-10">
          {Array.from({ length: totalGroups }, (_, index) =>
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`testimonial-dot w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 focus:outline-none ${
            index === currentIndex ?
            'bg-primary dark:bg-accent' :
            'bg-primary/30 dark:bg-accent/30'}`
            }
            aria-label={`Go to testimonial group ${index + 1}`} />

          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to start your project?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Join our growing list of satisfied clients and let&apos;s create something amazing together.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            
            Get Started Today
            <ChevronRightIcon className="ml-2 -mr-1 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;
