import React from 'react';
import { IconSize, IconVariant } from './types';

/**
 * Get size classes for icons based on size variant
 */
export const getIconSizeClasses = (size: IconSize = 'md'): string => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };
  return sizeMap[size];
};

/**
 * Get variant classes for icons
 */
export const getIconVariantClasses = (variant: IconVariant = 'outline'): string => {
  const variantMap = {
    solid: 'fill-current',
    outline: 'stroke-current fill-none',
    duotone: 'fill-current opacity-50'
  };
  return variantMap[variant];
};

/**
 * Combine icon classes with custom classes
 */
export const combineIconClasses = (
  baseClasses: string,
  customClasses?: string,
  size?: IconSize,
  variant?: IconVariant
): string => {
  const classes = [baseClasses];

  if (size) {
    classes.push(getIconSizeClasses(size));
  }

  if (variant) {
    classes.push(getIconVariantClasses(variant));
  }

  if (customClasses) {
    classes.push(customClasses);
  }

  return classes.filter(Boolean).join(' ');
};

/**
 * Create accessible icon props
 */
export const createAccessibleIconProps = (
  label?: string,
  isDecorative = false
) => ({
  'aria-label': isDecorative ? undefined : label,
  'aria-hidden': isDecorative,
  role: isDecorative ? 'presentation' : 'img'
});

/**
 * Icon animation presets
 */
export const iconAnimationPresets = {
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  fadeIn: 'animate-fadeIn',
  slideInLeft: 'animate-slideInLeft',
  slideInRight: 'animate-slideInRight'
} as const;

/**
 * Get animation class based on preset
 */
export const getAnimationClass = (preset: keyof typeof iconAnimationPresets): string => {
  return iconAnimationPresets[preset];
};

/**
 * Icon hover effect presets
 */
export const iconHoverPresets = {
  scale: 'hover:scale-110 transition-transform duration-200',
  rotate: 'hover:rotate-12 transition-transform duration-200',
  glow: 'hover:drop-shadow-lg transition-all duration-200',
  colorShift: 'hover:text-blue-500 transition-colors duration-200',
  bounce: 'hover:animate-bounce'
} as const;

/**
 * Get hover effect class based on preset
 */
export const getHoverClass = (preset: keyof typeof iconHoverPresets): string => {
  return iconHoverPresets[preset];
};

/**
 * Create icon with combined effects
 */
export const createIconWithEffects = (
  baseIcon: React.ComponentType<any>,
  options: {
    size?: IconSize;
    variant?: IconVariant;
    animation?: keyof typeof iconAnimationPresets;
    hover?: keyof typeof iconHoverPresets;
    customClasses?: string;
    accessibleLabel?: string;
    isDecorative?: boolean;
  } = {}
) => {
  const {
    size,
    variant,
    animation,
    hover,
    customClasses,
    accessibleLabel,
    isDecorative = false
  } = options;

  const IconComponent = (props: any) => {
    const combinedClasses = combineIconClasses(
      '',
      customClasses,
      size,
      variant
    );

    const animationClass = animation ? getAnimationClass(animation) : '';
    const hoverClass = hover ? getHoverClass(hover) : '';

    const accessibleProps = createAccessibleIconProps(accessibleLabel, isDecorative);

    return React.createElement(baseIcon, {
      ...props,
      className: `${combinedClasses} ${animationClass} ${hoverClass}`.trim(),
      ...accessibleProps
    });
  };

  return IconComponent;
};
