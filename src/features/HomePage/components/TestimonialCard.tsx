import React from 'react';
import Image from 'next/image';
import { StarIcon } from '../../../components/icons/static-icons';
import type { Testimonial } from '../../../content/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="flex items-center mb-4 md:mb-6">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mr-3 md:mr-4 border-2 border-primary/20 dark:border-accent/30 flex-shrink-0">
          <Image
            src={testimonial.authorImage}
            alt={testimonial.authorName}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">
            {testimonial.authorName}
          </h4>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
            {testimonial.authorRole}
          </p>
          <div className="flex text-amber-400 mt-1">
            <StarIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="ml-1 text-xs md:text-sm text-gray-700 dark:text-gray-300">5.0</span>
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 italic">
        "{testimonial.quote}"
      </p>
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {testimonial.tags.map((tag) => (
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
  );
};

export default TestimonialCard;
