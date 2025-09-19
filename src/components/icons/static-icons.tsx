import React from 'react';
import { IconProps } from './types';

/**
 * Play circle icon for video/media controls
 */
export const PlayCircleIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

/**
 * Check mark icon for success states
 */
export const CheckIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

/**
 * Shield with check mark for security/trust
 */
export const ShieldCheckIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

/**
 * Video camera icon for media production
 */
export const VideoCameraIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

/**
 * Code icon for development/programming
 */
export const CodeIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

/**
 * Camera icon for photography
 */
export const CameraIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/**
 * Film icon for cinema/video production
 */
export const FilmIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

/**
 * Megaphone icon for announcements/marketing
 */
export const MegaphoneIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

/**
 * Mobile device icon for responsive design
 */
export const DeviceMobileIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

/**
 * Right arrow icon for navigation
 */
export const ArrowRightIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

/**
 * Light bulb icon for ideas/innovation
 */
export const LightBulbIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

/**
 * Fancy pen icon for creative writing
 */
export const PenFancyIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

/**
 * Comments icon for communication/feedback
 */
export const CommentsIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/**
 * Rocket icon for growth/launch
 */
export const RocketIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

/**
 * Close/X icon for dismissal
 */
export const CloseIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * Star icon for ratings/favorites
 */
export const StarIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/**
 * Left chevron icon for navigation
 */
export const ChevronLeftIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

/**
 * Right chevron icon for navigation
 */
export const ChevronRightIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

/**
 * Check circle icon for completed tasks
 */
export const CheckCircleIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

/**
 * Envelope icon for email/contact
 */
export const EnvelopeIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

/**
 * Phone icon for contact information
 */
export const PhoneIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

/**
 * Map pin icon for location
 */
export const MapPinIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/**
 * Clock icon for time/scheduling
 */
export const ClockIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/**
 * Gift icon for special offers/rewards
 */
export const GiftIcon: React.FC<IconProps> = ({
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
