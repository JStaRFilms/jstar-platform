import { useState, useEffect } from 'react';

interface Section {
  id: string;
  href: string;
}

interface UseScrollSpyOptions {
  sections: Section[];
  offset?: number;
  threshold?: number;
}

export const useScrollSpy = ({ sections, offset = 100, threshold = 0.1 }: UseScrollSpyOptions) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // Find the section that is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);

        if (element) {
          const { offsetTop, offsetHeight } = element;
          const elementTop = offsetTop - offset;
          const elementBottom = elementTop + offsetHeight;

          // Check if the scroll position is within this section
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section.href);
            break;
          }
        }
      }

      // If we're at the top of the page, set home as active
      if (window.scrollY < 100) {
        setActiveSection('/');
      }
    };

    // Set initial active section
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections, offset]);

  return activeSection;
};
