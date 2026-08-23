'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MorphingHeadlineProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

export const MorphingHeadline: React.FC<MorphingHeadlineProps> = ({
  words,
  intervalMs = 2800,
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [words, intervalMs]);

  return (
    <span className={`inline-block relative overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block text-chartreuse"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default MorphingHeadline;
