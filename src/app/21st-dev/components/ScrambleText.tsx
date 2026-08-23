'use client';

import React, { useState } from 'react';

const GLYPHS = '0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?';

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const triggerScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
      iteration += 1 / 2;
    }, 25);
  };

  return (
    <span
      onMouseEnter={triggerOnHover ? triggerScramble : undefined}
      className={`inline-block select-none ${className}`}
    >
      {displayText}
    </span>
  );
};

export default ScrambleText;
