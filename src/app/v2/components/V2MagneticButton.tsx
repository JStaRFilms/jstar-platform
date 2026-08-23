'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface V2MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  href?: string;
}

export const V2MagneticButton: React.FC<V2MagneticButtonProps> = ({
  children,
  strength = 0.3,
  className = '',
  variant = 'primary',
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const { left, top, width, height } = element.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      'bg-chartreuse text-ink-black font-bold shadow-glow-chartreuse hover:bg-chartreuse/90 border border-chartreuse',
    secondary:
      'bg-card border border-powder-blue/25 text-ghost-white hover:border-chartreuse hover:text-chartreuse',
    ghost:
      'bg-transparent text-powder-blue hover:text-chartreuse border border-transparent hover:border-powder-blue/20',
  }[variant];

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className={`inline-block ${className}`}
    >
      <motion.button
        whileHover={{ scale: 1.04, rotate: -0.5 }}
        whileTap={{ scale: 0.96, rotate: 0.5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`px-7 py-3.5 rounded-full font-mono text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${variantStyles}`}
      >
        {children}
      </motion.button>
    </motion.div>
  );
};

export default V2MagneticButton;
