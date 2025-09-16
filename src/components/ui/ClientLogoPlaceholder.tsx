import React from 'react';
import Image from 'next/image';

/**
 * ClientLogoPlaceholder - A flexible component for displaying client logos
 * Supports SVG strings, image URLs, or fallback placeholder
 */
interface ClientLogoProps {
  /** Custom CSS classes */
  className?: string;
  /** Logo source - can be SVG string, image URL, or undefined for placeholder */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Logo name for placeholder text */
  name?: string;
  /** Logo type - 'svg', 'png', 'jpg', etc. */
  type?: 'svg' | 'image';
}

const ClientLogoPlaceholder = ({
  className = "",
  src,
  alt = "Client logo",
  name = "Client Logo",
  type = 'image'
}: ClientLogoProps) => {
  // If no src provided, show placeholder
  if (!src) {
    return (
      <svg
        className={`h-12 text-gray-700 dark:text-gray-300 ${className}`}
        viewBox="0 0 120 40"
        fill="currentColor"
        role="img"
        aria-label={`${name} logo placeholder`}
      >
        <rect width="120" height="40" rx="8" ry="8" fill="#4B5563" />
        <text x="60" y="25" fontFamily="sans-serif" fontSize="12" fill="white" textAnchor="middle">
          {name}
        </text>
      </svg>
    );
  }

  // Handle SVG strings
  if (type === 'svg' && src.startsWith('<svg')) {
    return (
      <div
        className={`h-12 flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: src }}
        role="img"
        aria-label={`${name} logo`}
      />
    );
  }

  // Handle image URLs (PNG, JPG, etc.)
  return (
    <div className={`h-12 flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={120}
        height={40}
        className="max-h-full max-w-full object-contain"
        style={{ filter: 'grayscale(100%) contrast(0.8)' }} // Optional: make logos more uniform
      />
    </div>
  );
};

export default ClientLogoPlaceholder;
