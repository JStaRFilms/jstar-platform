
'use client';

import { useState, useEffect, useCallback } from 'react';

export const useProductCarousel = (count: number, itemsToShow: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const maxIndex = count - itemsToShow;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  }, [count, itemsToShow]);

  const prev = () => {
    setCurrentIndex(prevIndex => {
        const maxIndex = count - itemsToShow;
        return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };

  return { currentIndex, setCurrentIndex, next, prev };
};
