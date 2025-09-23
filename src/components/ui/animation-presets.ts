import type { Variants } from 'motion/react';

/**
 * Animation presets for consistent motion design across the platform
 * Each preset contains initial, animate, and transition properties
 */
export const animationPresets = {
  // Basic transitions
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },

  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 0.3 }
  },

  slideInFromLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  slideInFromRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  slideInFromTop: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  slideInFromBottom: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  scaleOut: {
    initial: { scale: 1, opacity: 1 },
    animate: { scale: 0.8, opacity: 0 },
    transition: { duration: 0.3, ease: 'easeIn' }
  },

  // Bounce animations
  bounceIn: {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      duration: 0.6,
      ease: [0.68, -0.55, 0.265, 1.55]
    }
  },

  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  staggerItem: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4 }
  },

  // Hover effects
  hoverLift: {
    initial: { y: 0 },
    whileHover: { y: -4 },
    transition: { duration: 0.2 }
  },

  hoverGlow: {
    initial: { boxShadow: '0 0 0 rgba(0,0,0,0)' },
    whileHover: { boxShadow: '0 0 20px rgba(0,123,255,0.3)' },
    transition: { duration: 0.3 }
  },

  // Loading states
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },

  // Attention grabbers
  shake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  },

  wobble: {
    animate: {
      rotate: [0, -3, 3, -3, 3, 0],
      transition: { duration: 0.6 }
    }
  }
} as const;

/**
 * Animation variants for complex motion sequences
 * Note: Transitions should be passed separately when using these variants
 */
export const animationVariants: Record<string, Variants> = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },

  // Card animations
  cardHover: {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.02,
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    }
  },

  // Button interactions
  buttonTap: {
    initial: { scale: 1 },
    whileTap: { scale: 0.95 }
  },

  // Icon animations
  iconPulse: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1] }
  },

  iconSpin: {
    animate: { rotate: 360 }
  },

  // Loading states
  skeleton: {
    animate: { backgroundColor: ['#f3f4f6', '#e5e7eb', '#f3f4f6'] }
  }
};

/**
 * Transition configurations for animation variants
 */
export const animationTransitions = {
  pageEnter: { duration: 0.4 },
  cardHover: { duration: 0.2 },
  buttonTap: { duration: 0.1 },
  iconPulse: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  iconSpin: { duration: 2, repeat: Infinity, ease: 'linear' },
  skeleton: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
} as const;

/**
 * Utility function to get animation preset by name
 */
export function getAnimationPreset(name: keyof typeof animationPresets) {
  return animationPresets[name];
}

/**
 * Utility function to get animation variant by name
 */
export function getAnimationVariant(name: keyof typeof animationVariants) {
  return animationVariants[name];
}

/**
 * Type-safe animation preset keys
 */
export type AnimationPresetKey = keyof typeof animationPresets;

/**
 * Type-safe animation variant keys
 */
export type AnimationVariantKey = keyof typeof animationVariants;
