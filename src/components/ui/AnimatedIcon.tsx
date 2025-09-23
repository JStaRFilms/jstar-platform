'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, useAnimation, useReducedMotion } from 'motion/react';

/**
 * Animation types supported by the AnimatedIcon component
 */
export type AnimationType =
  | 'bounce'
  | 'pulse'
  | 'spin'
  | 'scale'
  | 'fade'
  | 'slide'
  | 'rotate'
  | 'wobble'
  | 'heartbeat'
  | 'shake';

/**
 * Animation triggers for the AnimatedIcon component
 */
export type AnimationTrigger = 'hover' | 'click' | 'load' | 'programmatic';

/**
 * Ref methods exposed by AnimatedIcon
 */
export interface AnimatedIconRef {
  /** Start the animation programmatically */
  startAnimation: () => void;
  /** Stop the animation programmatically */
  stopAnimation: () => void;
  /** Whether the icon is currently animating */
  isAnimating: boolean;
}

/**
 * Props for the AnimatedIcon component
 */
export interface AnimatedIconProps {
  /** The icon component to animate (should be a React component) */
  children: React.ReactNode;
  /** Type of animation to apply */
  animation?: AnimationType;
  /** When to trigger the animation */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Whether animation is enabled */
  isEnabled?: boolean;
  /** Whether to respect user's reduced motion preference */
  respectReducedMotion?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler for interactive animations */
  onClick?: () => void;
  /** Accessibility label */
  'aria-label'?: string;
  /** Hide from screen readers if decorative */
  'aria-hidden'?: boolean;
  /** Icon role */
  role?: 'img' | 'button' | 'presentation';
}

/**
 * Universal AnimatedIcon wrapper component
 *
 * Provides a consistent way to add animations to any icon component.
 * Supports multiple animation types and triggers while respecting accessibility.
 */
export const AnimatedIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(({
  children,
  animation = 'bounce',
  trigger = 'hover',
  duration = 500,
  delay = 0,
  isEnabled = true,
  respectReducedMotion = true,
  className,
  onClick,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role = 'img',
  ...props
}, ref) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Check for reduced motion preference
  const prefersReducedMotion = respectReducedMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animation classes mapping
  const animationClasses: Record<AnimationType, string> = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    scale: 'hover:scale-110 active:scale-95 transition-transform',
    fade: 'hover:opacity-75 active:opacity-50 transition-opacity',
    slide: 'hover:translate-x-1 active:translate-x-0 transition-transform',
    rotate: 'hover:rotate-12 active:rotate-0 transition-transform',
    wobble: 'animate-pulse', // Using pulse as fallback for wobble
    heartbeat: 'animate-pulse', // Using pulse as fallback for heartbeat
    shake: 'animate-pulse', // Using pulse as fallback for shake
  };

  // Get animation class based on type and trigger
  const getAnimationClass = (): string => {
    if (!isEnabled || prefersReducedMotion) return '';

    const baseClass = animationClasses[animation] || '';

    switch (trigger) {
      case 'hover':
        return baseClass;
      case 'click':
        return isAnimating ? baseClass : '';
      case 'load':
        return hasTriggered ? baseClass : '';
      case 'programmatic':
        return isAnimating ? baseClass : '';
      default:
        return baseClass;
    }
  };

  // Handle click animations
  const handleClick = () => {
    if (trigger === 'click' && isEnabled) {
      setIsAnimating(true);
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, duration);
    }
    onClick?.();
  };

  // Handle load animations
  useEffect(() => {
    if (trigger === 'load' && isEnabled && !hasTriggered) {
      const timer = setTimeout(() => {
        setHasTriggered(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, isEnabled, delay, hasTriggered]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Programmatic animation control methods
  React.useImperativeHandle(ref, () => ({
    startAnimation: () => {
      if (trigger === 'programmatic' && isEnabled) {
        setIsAnimating(true);
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
        }, duration);
      }
    },
    stopAnimation: () => {
      setIsAnimating(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    isAnimating,
  }), [trigger, isEnabled, duration, isAnimating]);

  const animationClass = getAnimationClass();
  const isInteractive = trigger === 'click' || onClick;

  return (
    <div
      ref={iconRef}
      className={cn(
        'inline-flex items-center justify-center',
        animationClass,
        isInteractive && 'cursor-pointer',
        className
      )}
      onClick={isInteractive ? handleClick : undefined}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={isInteractive ? 'button' : role}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

AnimatedIcon.displayName = 'AnimatedIcon';

export default AnimatedIcon;
