
'use client';

import { useState, useEffect, useCallback } from 'react';

export const useTestimonialCarousel = (count: number, interval: number = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + count) % count);
  }, [count]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [interval, next]);

  return { currentIndex, setCurrentIndex, next, prev, goToIndex };
};
