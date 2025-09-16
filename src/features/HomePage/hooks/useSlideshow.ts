
'use client';

import { useState, useEffect } from 'react';

export const useSlideshow = (slideCount: number, interval: number = 7000) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slideCount);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [slideCount, interval]);

  return {
    currentSlide,
    setCurrentSlide,
  };
};
