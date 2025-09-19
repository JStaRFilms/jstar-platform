import React from 'react';
import { AnimatedIconProps } from './types';
import {
  PlayCircleIcon,
  CheckIcon,
  ArrowRightIcon,
  CloseIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from './static-icons';

/**
 * Animated play button with hover and click effects
 */
export const AnimatedPlayIcon: React.FC<AnimatedIconProps> = ({
  className,
  onClick,
  duration = 300,
  trigger = 'hover',
  'aria-label': ariaLabel = 'Play',
  'aria-hidden': ariaHidden,
  role = 'button'
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClick = () => {
    if (onClick) {
      setIsAnimating(true);
      onClick();
      setTimeout(() => setIsAnimating(false), duration);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        transition-all duration-${duration} ease-in-out
        hover:scale-110 hover:rotate-12
        active:scale-95
        ${isAnimating ? 'animate-pulse' : ''}
        ${className || ''}
      `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
    >
      <PlayCircleIcon className="w-6 h-6" />
    </button>
  );
};

/**
 * Animated check icon with success animation
 */
export const AnimatedCheckIcon: React.FC<AnimatedIconProps> = ({
  className,
  onClick,
  duration = 500,
  trigger = 'load',
  'aria-label': ariaLabel = 'Success',
  'aria-hidden': ariaHidden,
  role = 'img'
}) => {
  const [isVisible, setIsVisible] = React.useState(trigger !== 'load');

  React.useEffect(() => {
    if (trigger === 'load') {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={`
        transition-all duration-${duration} ease-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        ${className || ''}
      `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
    >
      <CheckIcon className="w-5 h-5 text-green-500" />
    </div>
  );
};

/**
 * Animated arrow with bounce effect
 */
export const AnimatedArrowRightIcon: React.FC<AnimatedIconProps> = ({
  className,
  onClick,
  duration = 600,
  trigger = 'hover',
  'aria-label': ariaLabel = 'Next',
  'aria-hidden': ariaHidden,
  role = 'button'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        transition-all duration-${duration} ease-in-out
        hover:translate-x-2
        ${isHovered ? 'animate-bounce' : ''}
        ${className || ''}
      `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
    >
      <ArrowRightIcon className="w-5 h-5" />
    </button>
  );
};

/**
 * Animated close button with rotation
 */
export const AnimatedCloseIcon: React.FC<AnimatedIconProps> = ({
  className,
  onClick,
  duration = 300,
  trigger = 'hover',
  'aria-label': ariaLabel = 'Close',
  'aria-hidden': ariaHidden,
  role = 'button'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        transition-all duration-${duration} ease-in-out
        hover:rotate-90 hover:scale-110
        active:scale-95
        ${className || ''}
      `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
    >
      <CloseIcon className="w-5 h-5" />
    </button>
  );
};

/**
 * Animated star with sparkle effect
 */
export const AnimatedStarIcon: React.FC<AnimatedIconProps> = ({
  className,
  onClick,
  duration = 1000,
  trigger = 'hover',
  'aria-label': ariaLabel = 'Favorite',
  'aria-hidden': ariaHidden,
  role = 'button'
}) => {
  const [isActive, setIsActive] = React.useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        transition-all duration-${duration} ease-in-out
        hover:scale-125
        ${isActive ? 'text-yellow-400 animate-spin' : 'text-gray-400'}
        ${className || ''}
      `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
    >
      <StarIcon className="w-5 h-5" />
    </button>
  );
};

/**
 * Animated chevron with slide effect
 */
export const AnimatedChevronLeftIcon: React.FC<AnimatedIconProps> = ({
  className,
  onClick,
  duration = 400,
  trigger = 'hover',
  'aria-label': ariaLabel = 'Previous',
  'aria-hidden': ariaHidden,
  role = 'button'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        transition-all duration-${duration} ease-in-out
        hover:-translate-x-1
        ${isHovered ? 'animate-pulse' : ''}
        ${className || ''}
      `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
    >
      <ChevronLeftIcon className="w-5 h-5" />
    </button>
  );
};

/**
 * Animated chevron with slide effect
 */
export const AnimatedChevronRightIcon: React.FC<AnimatedIconProps> = ({
  className,
  onClick,
  duration = 400,
  trigger = 'hover',
  'aria-label': ariaLabel = 'Next',
  'aria-hidden': ariaHidden,
  role = 'button'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        transition-all duration-${duration} ease-in-out
        hover:translate-x-1
        ${isHovered ? 'animate-pulse' : ''}
        ${className || ''}
      `}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
    >
      <ChevronRightIcon className="w-5 h-5" />
    </button>
  );
};

/**
 * Pulse loading animation wrapper for any icon
 */
export const AnimatedLoadingIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
}> = ({ children, className, duration = 1500 }) => (
  <div
    className={`
      animate-pulse
      ${className || ''}
    `}
    style={{ animationDuration: `${duration}ms` }}
  >
    {children}
  </div>
);

/**
 * Bounce animation wrapper for any icon
 */
export const AnimatedBounceIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
}> = ({ children, className, duration = 1000 }) => (
  <div
    className={`
      animate-bounce
      ${className || ''}
    `}
    style={{ animationDuration: `${duration}ms` }}
  >
    {children}
  </div>
);
