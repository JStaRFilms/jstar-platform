/**
 * Enhanced icon props interface with accessibility support
 */
export interface IconProps {
  /** CSS class name for styling */
  className?: string;
  /** Icon name for screen readers */
  'aria-label'?: string;
  /** Hide from screen readers if decorative */
  'aria-hidden'?: boolean;
  /** Icon role */
  role?: 'img' | 'presentation';
}

/**
 * Props for animated icons with interaction support
 */
export interface AnimatedIconProps extends IconProps {
  /** Click handler for interactive icons */
  onClick?: () => void;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation trigger */
  trigger?: 'hover' | 'click' | 'load';
}

/**
 * Icon size variants
 */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Icon variant types
 */
export type IconVariant = 'solid' | 'outline' | 'duotone';
