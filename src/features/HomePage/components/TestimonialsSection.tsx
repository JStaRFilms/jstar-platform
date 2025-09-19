
'use client';

import React from 'react';
import Image from 'next/image';
import { useTestimonialCarousel } from '../hooks/useTestimonialCarousel';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '../../../components/icons/static-icons';

type Testimonial = {
  name: string;
  title: string;
  image: string;
  quote: string;
  tags: string[];
};

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    title: 'CEO, Creative Solutions',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: "Working with J StaR Films was an absolute pleasure. Their attention to detail and creative vision brought our brand story to life in ways we couldn't have imagined.",
    tags: ['Video Production', 'Brand Story']
  },
  {
    name: 'Michael Chen',
    title: 'Marketing Director, TechNova',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: "The web application J StaR developed for us has transformed our business operations. Their team's technical expertise and understanding of our needs were impressive.",
    tags: ['Web Development', 'Custom App']
  },
  {
    name: 'Emily Rodriguez',
    title: 'Founder, Bloom & Grow',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote: "The branding package we received was beyond our expectations. They captured our vision perfectly and created a cohesive identity that resonates with our target audience. Our new branding has already made a significant impact on our business.",
    tags: ['Branding', 'Visual Identity']
  },
  {
    name: 'David Kimani',
    title: 'Creative Director, UrbanPulse',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    quote: "The team at J StaR Films brought incredible creativity and technical expertise to our project. Their ability to understand our brand and translate it into stunning visuals was remarkable. The final product exceeded our expectations in every way.",
    tags: ['Video Production', 'Motion Graphics']
  },
  {
    name: 'Jessica Lee',
    title: 'Founder, Greenify',
    image: 'https://randomuser.me/api/portraits/women/76.jpg',
    quote: "J StaR Films exceeded our expectations with their professionalism, creativity, and attention to detail. We're thrilled with the final product and look forward to working with them again.",
    tags: ['Web Development', 'E-commerce']
  },
  {
    name: 'Michael Brown',
    title: 'Marketing Manager, Proxima',
    image: 'https://randomuser.me/api/portraits/men/77.jpg',
    quote: "We were impressed by J StaR Films' ability to understand our brand and create a custom video that exceeded our expectations. Their team was professional, creative, and easy to work with.",
    tags: ['Video Production', 'Corporate']
  },
  {
    name: 'Emily Davis',
    title: 'Founder, Lumin',
    image: 'https://randomuser.me/api/portraits/women/78.jpg',
    quote: "J StaR Films delivered a high-quality video that met our expectations. Their team was responsive, professional, and easy to work with. We would definitely recommend them to others.",
    tags: ['Video Production', 'Explainer']
  },
  {
    name: 'James Wilson',
    title: 'Creative Director, Pulse',
    image: 'https://randomuser.me/api/portraits/men/79.jpg',
    quote: "J StaR Films' video production services exceeded our expectations. Their team was professional, creative, and delivered a high-quality final product that met our needs.",
    tags: ['Video Production', 'Social Media']
  },
  {
    name: 'Sophia Patel',
    title: 'Founder, Zenith',
    image: 'https://randomuser.me/api/portraits/women/80.jpg',
    quote: "We were impressed by J StaR Films' professionalism, creativity, and attention to detail. Their video production services exceeded our expectations and we would definitely recommend them to others.",
    tags: ['Video Production', 'Event']
  },
  {
    name: 'William Lee',
    title: 'Marketing Manager, Apex',
    image: 'https://randomuser.me/api/portraits/men/81.jpg',
    quote: "J StaR Films' team was a pleasure to work with. They delivered a high-quality video that met our expectations and we would definitely recommend them to others.",
    tags: ['Video Production', 'Promotional']
  },
];

const TestimonialsSection = () => {
  const totalGroups = Math.ceil(testimonials.length / 3);
  const { currentIndex, prev, next, goToIndex } = useTestimonialCarousel(totalGroups);

  const handleDotClick = (index: number) => {
    goToIndex(index);
  };

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
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
            className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="testimonials-container overflow-hidden px-2">
            <div
              className="testimonials-track flex transition-transform duration-300 ease-in-out"
              style={{
                width: 'max-content',
                transform: `translateX(-${currentIndex * 100}%)`
              }}
            >
              {Array.from({ length: totalGroups }, (_, groupIndex) => (
                <div key={groupIndex} className="flex w-full flex-shrink-0">
                  {testimonials.slice(groupIndex * 3, (groupIndex + 1) * 3).map((testimonial, index) => (
                    <div
                      key={`${groupIndex}-${index}`}
                      className="testimonial-slide px-2 sm:px-3 md:px-4"
                      style={{
                        minWidth: '85vw',
                        maxWidth: '400px',
                        width: 'calc(100vw - 2rem)'
                      }}
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <div className="flex items-center mb-4 md:mb-6">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mr-3 md:mr-4 border-2 border-primary/20 dark:border-accent/30 flex-shrink-0">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                              {testimonial.title}
                            </p>
                            <div className="flex text-amber-400 mt-1">
                              <StarIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                              <span className="ml-1 text-xs md:text-sm text-gray-700 dark:text-gray-300">5.0</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 italic line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex flex-wrap gap-2">
                            {testimonial.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 md:px-3 md:py-1 bg-primary/10 dark:bg-accent/20 text-primary dark:text-accent text-xs font-medium rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalGroups }, (_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`testimonial-dot w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 focus:outline-none ${
                index === currentIndex
                  ? 'bg-primary dark:bg-accent'
                  : 'bg-primary/30 dark:bg-accent/30'
              }`}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to start your project?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Join our growing list of satisfied clients and let's create something amazing together.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started Today
            <ChevronRightIcon className="ml-2 -mr-1 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
