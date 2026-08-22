'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const MagneticCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable or custom cursor target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveElement = target.closest('a, button, [role="button"], input, textarea, [data-cursor]');
        if (interactiveElement) {
          setIsPointer(true);
          const customText = interactiveElement.getAttribute('data-cursor-text');
          setCursorText(customText || '');
        } else {
          setIsPointer(false);
          setCursorText('');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Outer subtle glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-chartreuse/60 mix-blend-screen flex items-center justify-center transition-opacity duration-300"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isPointer ? (cursorText ? 84 : 44) : 28,
          height: isPointer ? (cursorText ? 84 : 44) : 28,
          backgroundColor: isPointer ? 'rgba(181, 230, 25, 0.12)' : 'rgba(181, 230, 25, 0.04)',
          borderColor: isPointer ? '#B5E619' : 'rgba(175, 194, 213, 0.4)',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {cursorText && (
          <span className="text-[10px] font-mono font-bold tracking-widest text-chartreuse uppercase select-none text-center px-1">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Center sharp pinpoint dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 w-1.5 h-1.5 rounded-full bg-chartreuse shadow-[0_0_8px_#B5E619]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 0 : 1,
          opacity: isPointer ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};
